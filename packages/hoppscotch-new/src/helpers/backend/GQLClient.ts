import { ref } from 'vue';
import {
  createClient,
  TypedDocumentNode,
  dedupExchange,
  OperationContext,
  fetchExchange,
  makeOperation,
  createRequest,
  errorExchange,
  CombinedError,
  Operation,
  OperationResult,
  Client,
} from '@urql/vue';
import { authExchange } from '@urql/exchange-auth';
import { devtoolsExchange } from '@urql/devtools';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe, constVoid, flow } from 'fp-ts/function';
import { subscribe, pipe as wonkaPipe } from 'wonka';
import { filter, map, Subject } from 'rxjs';
import { platform } from '~/platform';

// TODO: Implement caching

const BACKEND_GQL_URL = 'https://stage-api.hoppscotch.io/graphql';

type GQLOpType = 'query' | 'mutation' | 'subscription';
/**
 * A type that defines error events that are possible during backend operations on the GQLCLient
 */
export type GQLClientErrorEvent =
  | { type: 'SUBSCRIPTION_CONN_CALLBACK_ERR_REPORT'; errors: Error[] }
  | { type: 'CLIENT_REPORTED_ERROR'; error: CombinedError; op: Operation }
  | {
      type: 'GQL_CLIENT_REPORTED_ERROR';
      opType: GQLOpType;
      opResult: OperationResult;
    };

/**
 * A stream of the errors that occur during GQLClient operations.
 * Exposed to be subscribed to by systems like sentry for error reporting
 */
export const gqlClientError$ = new Subject<GQLClientErrorEvent>();

const createHoppClient = () => {
  const exchanges = [
    devtoolsExchange,
    dedupExchange,
    authExchange({
      addAuthToOperation({ authState, operation }) {
        if (!authState) {
          return operation;
        }

        const fetchOptions =
          typeof operation.context.fetchOptions === 'function'
            ? operation.context.fetchOptions()
            : operation.context.fetchOptions || {};

        const authHeaders = platform.auth.getBackendHeaders();

        return makeOperation(operation.kind, operation, {
          ...operation.context,
          fetchOptions: {
            ...fetchOptions,
            headers: {
              ...fetchOptions.headers,
              ...authHeaders,
            },
          },
        });
      },
      willAuthError() {
        return platform.auth.willBackendHaveAuthError();
      },
      getAuth: async () => {
        const probableUser = platform.auth.getProbableUser();

        if (probableUser !== null)
          await platform.auth.waitProbableLoginToConfirm();

        return {};
      },
    }),
    fetchExchange,
    errorExchange({
      onError(error, op) {
        gqlClientError$.next({
          type: 'CLIENT_REPORTED_ERROR',
          error,
          op,
        });
      },
    }),
  ];

  return createClient({
    url: BACKEND_GQL_URL,
    exchanges,
    ...(platform.auth.getGQLClientOptions
      ? platform.auth.getGQLClientOptions()
      : {}),
  });
};

export const client = ref<Client>();

export function initBackendGQLClient() {
  client.value = createHoppClient();

  platform.auth.onBackendGQLClientShouldReconnect(() => {
    const currentUser = platform.auth.getCurrentUser();
    client.value = createHoppClient();
  });
}

type RunQueryOptions<T = any, V = object> = {
  query: TypedDocumentNode<T, V>;
  variables?: V;
};

/**
 * A wrapper type for defining errors possible in a GQL operation
 */
export type GQLError<T extends string> =
  | {
      type: 'network_error';
      error: Error;
    }
  | {
      type: 'gql_error';
      error: T;
    };

export const runGQLQuery = <DocType, DocVarType, DocErrorType extends string>(
  args: RunQueryOptions<DocType, DocVarType>
): Promise<E.Either<GQLError<DocErrorType>, DocType>> => {
  const request = createRequest<DocType, DocVarType>(
    args.query,
    args.variables
  );
  const source = client.value!.executeQuery(request, {
    requestPolicy: 'network-only',
  });

  return new Promise((resolve) => {
    const sub = wonkaPipe(
      source,
      subscribe((res) => {
        if (sub) {
          sub.unsubscribe();
        }

        pipe(
          // The target
          res.data as DocType | undefined,
          // Define what happens if data does not exist (it is an error)
          E.fromNullable(
            pipe(
              // Take the network error value
              res.error?.networkError,
              // If it null, set the left to the generic error name
              E.fromNullable(res.error?.message),
              E.match(
                // The left case (network error was null)
                (gqlErr) => {
                  if (res.error) {
                    gqlClientError$.next({
                      type: 'GQL_CLIENT_REPORTED_ERROR',
                      opType: 'query',
                      opResult: res,
                    });
                  }

                  return <GQLError<DocErrorType>>{
                    type: 'gql_error',
                    error: parseGQLErrorString(gqlErr ?? '') as DocErrorType,
                  };
                },
                // The right case (it was a GraphQL Error)
                (networkErr) =>
                  <GQLError<DocErrorType>>{
                    type: 'network_error',
                    error: networkErr,
                  }
              )
            )
          ),
          resolve
        );
      })
    );
  });
};

export const parseGQLErrorString = (s: string) =>
  s.startsWith('[GraphQL] ') ? s.split('[GraphQL] ')[1] : s;

export const runMutation = <
  DocType,
  DocVariables extends object | undefined,
  DocErrors extends string
>(
  mutation: TypedDocumentNode<DocType, DocVariables>,
  variables?: DocVariables,
  additionalConfig?: Partial<OperationContext>
): TE.TaskEither<GQLError<DocErrors>, DocType> =>
  pipe(
    TE.tryCatch(
      () =>
        client
          .value!.mutation(mutation, variables, {
            requestPolicy: 'cache-and-network',
            ...additionalConfig,
          })
          .toPromise(),
      () => constVoid() as never // The mutation function can never fail, so this will never be called ;)
    ),
    TE.chainEitherK((result) =>
      pipe(
        result.data,
        E.fromNullable(
          // Result is null
          pipe(
            result.error?.networkError,
            E.fromNullable(result.error?.message),
            E.match(
              // The left case (network error was null)
              (gqlErr) => {
                if (result.error) {
                  gqlClientError$.next({
                    type: 'GQL_CLIENT_REPORTED_ERROR',
                    opType: 'mutation',
                    opResult: result,
                  });
                }

                return <GQLError<DocErrors>>{
                  type: 'gql_error',
                  error: parseGQLErrorString(gqlErr ?? ''),
                };
              },
              // The right case (it was a network error)
              (networkErr) =>
                <GQLError<DocErrors>>{
                  type: 'network_error',
                  error: networkErr,
                }
            )
          )
        )
      )
    )
  );
