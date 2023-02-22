import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
};

export type CollectionReorderData = {
  __typename?: 'CollectionReorderData';
  /** Team Collection being moved */
  collection: TeamCollection;
  /** Team Collection succeeding the collection being moved in its new position */
  nextCollection?: Maybe<TeamCollection>;
};

export type CreateTeamRequestInput = {
  /** JSON string representing the request data */
  request: Scalars['String'];
  /** ID of the team the collection belongs to */
  teamID: Scalars['ID'];
  /** Displayed title of the request */
  title: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Accept an Invitation */
  acceptTeamInvitation: TeamMember;
  /**
   * Adds a team member to the team via email
   * @deprecated This is only present for backwards compatibility and will be removed soon use team invitations instead
   */
  addTeamMemberByEmail: TeamMember;
  /** Create a collection that has a parent collection */
  createChildCollection: TeamCollection;
  /** Create a duplicate of an existing environment */
  createDuplicateEnvironment: TeamEnvironment;
  /** Create a request in the given collection. */
  createRequestInCollection: TeamRequest;
  /** Creates a collection at the root of the team hierarchy (no parent collection) */
  createRootCollection: TeamCollection;
  /** Create a shortcode for the given request. */
  createShortcode: Shortcode;
  /** Creates a team owned by the executing user */
  createTeam: Team;
  /** Create a new Team Environment for given Team ID */
  createTeamEnvironment: TeamEnvironment;
  /** Creates a Team Invitation */
  createTeamInvitation: TeamInvitation;
  /** Delete all variables from a Team Environment */
  deleteAllVariablesFromTeamEnvironment: TeamEnvironment;
  /** Delete a collection */
  deleteCollection: Scalars['Boolean'];
  /** Delete a request with the given ID */
  deleteRequest: Scalars['Boolean'];
  /** Deletes the team */
  deleteTeam: Scalars['Boolean'];
  /** Delete a Team Environment for given Team ID */
  deleteTeamEnvironment: Scalars['Boolean'];
  /** Delete an user account */
  deleteUser: Scalars['Boolean'];
  /** Import collection from user firestore */
  importCollectionFromUserFirestore: TeamCollection;
  /** Import collections from JSON string to the specified Team */
  importCollectionsFromJSON: Scalars['Boolean'];
  /** Leaves a team the executing user is a part of */
  leaveTeam: Scalars['Boolean'];
  /** Move a collection into a new parent collection or the root of the team */
  moveCollection: TeamCollection;
  /** Move a request to the given collection */
  moveRequest: TeamRequest;
  /** Removes the team member from the team */
  removeTeamMember: Scalars['Boolean'];
  /** Rename a collection */
  renameCollection: TeamCollection;
  /** Renames a team */
  renameTeam: Team;
  /** Replace existing collections of a specific team with collections in JSON string */
  replaceCollectionsWithJSON: Scalars['Boolean'];
  /** Revoke a user generated shortcode */
  revokeShortcode: Scalars['Boolean'];
  /** Revokes an invitation and deletes it */
  revokeTeamInvitation: Scalars['Boolean'];
  /** Update the order of collections */
  updateCollectionOrder: Scalars['Boolean'];
  /** Update the order of requests in the lookup table */
  updateLookUpRequestOrder: Scalars['Boolean'];
  /** Update a request with the given ID */
  updateRequest: TeamRequest;
  /** Add/Edit a single environment variable or variables to a Team Environment */
  updateTeamEnvironment: TeamEnvironment;
  /** Update role of a team member the executing user owns */
  updateTeamMemberRole: TeamMember;
};


export type MutationAcceptTeamInvitationArgs = {
  inviteID: Scalars['ID'];
};


export type MutationAddTeamMemberByEmailArgs = {
  teamID: Scalars['ID'];
  userEmail: Scalars['String'];
  userRole: TeamMemberRole;
};


export type MutationCreateChildCollectionArgs = {
  childTitle: Scalars['String'];
  collectionID: Scalars['ID'];
};


export type MutationCreateDuplicateEnvironmentArgs = {
  id: Scalars['ID'];
};


export type MutationCreateRequestInCollectionArgs = {
  collectionID: Scalars['ID'];
  data: CreateTeamRequestInput;
};


export type MutationCreateRootCollectionArgs = {
  teamID: Scalars['ID'];
  title: Scalars['String'];
};


export type MutationCreateShortcodeArgs = {
  request: Scalars['String'];
};


export type MutationCreateTeamArgs = {
  name: Scalars['String'];
};


export type MutationCreateTeamEnvironmentArgs = {
  name: Scalars['String'];
  teamID: Scalars['ID'];
  variables: Scalars['String'];
};


export type MutationCreateTeamInvitationArgs = {
  inviteeEmail: Scalars['String'];
  inviteeRole: TeamMemberRole;
  teamID: Scalars['ID'];
};


export type MutationDeleteAllVariablesFromTeamEnvironmentArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteCollectionArgs = {
  collectionID: Scalars['ID'];
};


export type MutationDeleteRequestArgs = {
  requestID: Scalars['ID'];
};


export type MutationDeleteTeamArgs = {
  teamID: Scalars['ID'];
};


export type MutationDeleteTeamEnvironmentArgs = {
  id: Scalars['ID'];
};


export type MutationImportCollectionFromUserFirestoreArgs = {
  fbCollectionPath: Scalars['String'];
  parentCollectionID?: InputMaybe<Scalars['ID']>;
  teamID: Scalars['ID'];
};


export type MutationImportCollectionsFromJsonArgs = {
  jsonString: Scalars['String'];
  parentCollectionID?: InputMaybe<Scalars['ID']>;
  teamID: Scalars['ID'];
};


export type MutationLeaveTeamArgs = {
  teamID: Scalars['ID'];
};


export type MutationMoveCollectionArgs = {
  collectionID: Scalars['ID'];
  parentCollectionID?: InputMaybe<Scalars['ID']>;
};


export type MutationMoveRequestArgs = {
  destCollID: Scalars['ID'];
  requestID: Scalars['ID'];
};


export type MutationRemoveTeamMemberArgs = {
  teamID: Scalars['ID'];
  userUid: Scalars['ID'];
};


export type MutationRenameCollectionArgs = {
  collectionID: Scalars['ID'];
  newTitle: Scalars['String'];
};


export type MutationRenameTeamArgs = {
  newName: Scalars['String'];
  teamID: Scalars['ID'];
};


export type MutationReplaceCollectionsWithJsonArgs = {
  jsonString: Scalars['String'];
  parentCollectionID?: InputMaybe<Scalars['ID']>;
  teamID: Scalars['ID'];
};


export type MutationRevokeShortcodeArgs = {
  code: Scalars['ID'];
};


export type MutationRevokeTeamInvitationArgs = {
  inviteID: Scalars['ID'];
};


export type MutationUpdateCollectionOrderArgs = {
  collectionID: Scalars['ID'];
  destCollID?: InputMaybe<Scalars['ID']>;
};


export type MutationUpdateLookUpRequestOrderArgs = {
  collectionID: Scalars['ID'];
  nextRequestID?: InputMaybe<Scalars['ID']>;
  requestID: Scalars['ID'];
};


export type MutationUpdateRequestArgs = {
  data: UpdateTeamRequestInput;
  requestID: Scalars['ID'];
};


export type MutationUpdateTeamEnvironmentArgs = {
  id: Scalars['ID'];
  name: Scalars['String'];
  variables: Scalars['String'];
};


export type MutationUpdateTeamMemberRoleArgs = {
  newRole: TeamMemberRole;
  teamID: Scalars['ID'];
  userUid: Scalars['ID'];
};

export type Query = {
  __typename?: 'Query';
  /** Get a collection with the given ID or null (if not exists) */
  collection?: Maybe<TeamCollection>;
  /**
   * Returns the collections of the team
   * @deprecated Deprecated because of no practical use. Use `rootCollectionsOfTeam` instead.
   */
  collectionsOfTeam: Array<TeamCollection>;
  /** Returns the JSON string giving the collections and their contents of the team */
  exportCollectionsToJSON: Scalars['String'];
  /** Gives details of the user executing this query (pass Authorization 'Bearer' header) */
  me: User;
  /** List all shortcodes the current user has generated */
  myShortcodes: Array<Shortcode>;
  /** List of teams that the executing user belongs to. */
  myTeams: Array<Team>;
  /** Gives a request with the given ID or null (if not exists) */
  request?: Maybe<TeamRequest>;
  /** Gives a list of requests in the collection */
  requestsInCollection: Array<TeamRequest>;
  /** Returns the collections of the team */
  rootCollectionsOfTeam: Array<TeamCollection>;
  /** Search the team for a specific request with title */
  searchForRequest: Array<TeamRequest>;
  /** Resolves and returns a shortcode data */
  shortcode?: Maybe<Shortcode>;
  /** Returns the detail of the team with the given ID */
  team?: Maybe<Team>;
  /** Gets the Team Invitation with the given ID, or null if not exists */
  teamInvitation: TeamInvitation;
  /**
   * Finds a user by their UID or null if no match
   * @deprecated Deprecated due to privacy concerns. Try to get the user from the context-relevant queries
   */
  user?: Maybe<User>;
};


export type QueryCollectionArgs = {
  collectionID: Scalars['ID'];
};


export type QueryCollectionsOfTeamArgs = {
  cursor?: InputMaybe<Scalars['ID']>;
  teamID: Scalars['ID'];
};


export type QueryExportCollectionsToJsonArgs = {
  teamID: Scalars['ID'];
};


export type QueryMyShortcodesArgs = {
  cursor?: InputMaybe<Scalars['ID']>;
};


export type QueryMyTeamsArgs = {
  cursor?: InputMaybe<Scalars['ID']>;
};


export type QueryRequestArgs = {
  requestID: Scalars['ID'];
};


export type QueryRequestsInCollectionArgs = {
  collectionID: Scalars['ID'];
  cursor?: InputMaybe<Scalars['ID']>;
};


export type QueryRootCollectionsOfTeamArgs = {
  cursor?: InputMaybe<Scalars['ID']>;
  teamID: Scalars['ID'];
};


export type QuerySearchForRequestArgs = {
  cursor?: InputMaybe<Scalars['ID']>;
  searchTerm: Scalars['String'];
  teamID: Scalars['ID'];
};


export type QueryShortcodeArgs = {
  code: Scalars['ID'];
};


export type QueryTeamArgs = {
  teamID: Scalars['ID'];
};


export type QueryTeamInvitationArgs = {
  inviteID: Scalars['ID'];
};


export type QueryUserArgs = {
  uid: Scalars['ID'];
};

export type RequestReorderData = {
  __typename?: 'RequestReorderData';
  /** Team Request succeeding the request being moved in its new position */
  nextRequest?: Maybe<TeamRequest>;
  /** Team Request being moved */
  request: TeamRequest;
};

export type Shortcode = {
  __typename?: 'Shortcode';
  /** Timestamp of when the Shortcode was created */
  createdOn: Scalars['DateTime'];
  /** The shortcode. 12 digit alphanumeric. */
  id: Scalars['ID'];
  /** JSON string representing the request data */
  request: Scalars['String'];
};

export type Subscription = {
  __typename?: 'Subscription';
  /** Listen to when a collections position has changed */
  collectionOrderUpdated: CollectionReorderData;
  /** Listen for shortcode creation */
  myShortcodesCreated: Shortcode;
  /** Listen for shortcode deletion */
  myShortcodesRevoked: Shortcode;
  /** Emitted when a request has been moved from one collection into another */
  requestMoved: TeamRequest;
  /** Emitted when a requests position has been changed in its collection */
  requestOrderUpdated: RequestReorderData;
  /** Listen to when a collection has been added to a team. The emitted value is the team added */
  teamCollectionAdded: TeamCollection;
  /** Listen to when a collection has been moved */
  teamCollectionMoved: TeamCollection;
  /** Listen to when a collection has been removed */
  teamCollectionRemoved: Scalars['ID'];
  /** Listen to when a collection has been updated. */
  teamCollectionUpdated: TeamCollection;
  /** Listen for Team Environment Creation Messages */
  teamEnvironmentCreated: TeamEnvironment;
  /** Listen for Team Environment Deletion Messages */
  teamEnvironmentDeleted: TeamEnvironment;
  /** Listen for Team Environment Updates */
  teamEnvironmentUpdated: TeamEnvironment;
  /** Listens to when a Team Invitation is added */
  teamInvitationAdded: TeamInvitation;
  /** Listens to when a Team Invitation is removed */
  teamInvitationRemoved: Scalars['ID'];
  /** Listen to when a new team member being added to the team. The emitted value is the new team member added. */
  teamMemberAdded: TeamMember;
  /** Listen to when a team member has been removed. The emitted value is the uid of the user removed */
  teamMemberRemoved: Scalars['ID'];
  /** Listen to when a team member status has been updated. The emitted value is the new team member status */
  teamMemberUpdated: TeamMember;
  /** Emits when a new request is added to a team */
  teamRequestAdded: TeamRequest;
  /** Emitted when a request has been deleted. Only the id of the request is emitted. */
  teamRequestDeleted: Scalars['ID'];
  /** Emitted when a request has been updated */
  teamRequestUpdated: TeamRequest;
  /** Listen for user deletion */
  userDeleted: User;
};


export type SubscriptionCollectionOrderUpdatedArgs = {
  teamID: Scalars['ID'];
};


export type SubscriptionRequestMovedArgs = {
  teamID: Scalars['ID'];
};


export type SubscriptionRequestOrderUpdatedArgs = {
  teamID: Scalars['ID'];
};


export type SubscriptionTeamCollectionAddedArgs = {
  teamID: Scalars['ID'];
};


export type SubscriptionTeamCollectionMovedArgs = {
  teamID: Scalars['ID'];
};


export type SubscriptionTeamCollectionRemovedArgs = {
  teamID: Scalars['ID'];
};


export type SubscriptionTeamCollectionUpdatedArgs = {
  teamID: Scalars['ID'];
};


export type SubscriptionTeamEnvironmentCreatedArgs = {
  teamID: Scalars['ID'];
};


export type SubscriptionTeamEnvironmentDeletedArgs = {
  teamID: Scalars['ID'];
};


export type SubscriptionTeamEnvironmentUpdatedArgs = {
  teamID: Scalars['ID'];
};


export type SubscriptionTeamInvitationAddedArgs = {
  teamID: Scalars['ID'];
};


export type SubscriptionTeamInvitationRemovedArgs = {
  teamID: Scalars['ID'];
};


export type SubscriptionTeamMemberAddedArgs = {
  teamID: Scalars['ID'];
};


export type SubscriptionTeamMemberRemovedArgs = {
  teamID: Scalars['ID'];
};


export type SubscriptionTeamMemberUpdatedArgs = {
  teamID: Scalars['ID'];
};


export type SubscriptionTeamRequestAddedArgs = {
  teamID: Scalars['ID'];
};


export type SubscriptionTeamRequestDeletedArgs = {
  teamID: Scalars['ID'];
};


export type SubscriptionTeamRequestUpdatedArgs = {
  teamID: Scalars['ID'];
};

export type Team = {
  __typename?: 'Team';
  /** The number of users with the EDITOR role in the team */
  editorsCount: Scalars['Int'];
  /** ID of the team */
  id: Scalars['ID'];
  /** Returns the list of members of a team */
  members: Array<TeamMember>;
  /** The role of the current user in the team */
  myRole: TeamMemberRole;
  /** Displayed name of the team */
  name: Scalars['String'];
  /** The number of users with the OWNER role in the team */
  ownersCount: Scalars['Int'];
  /** Returns all Team Environments for the given Team */
  teamEnvironments: Array<TeamEnvironment>;
  /** Get all the active invites in the team */
  teamInvitations: Array<TeamInvitation>;
  /** Returns the list of members of a team */
  teamMembers: Array<TeamMember>;
  /** The number of users with the VIEWER role in the team */
  viewersCount: Scalars['Int'];
};


export type TeamMembersArgs = {
  cursor?: InputMaybe<Scalars['ID']>;
};

export type TeamCollection = {
  __typename?: 'TeamCollection';
  /** List of children collection */
  children: Array<TeamCollection>;
  /** ID of the collection */
  id: Scalars['ID'];
  /** The collection whom is the parent of this collection (null if this is root collection) */
  parent?: Maybe<TeamCollection>;
  /** Team the collection belongs to */
  team: Team;
  /** Displayed title of the collection */
  title: Scalars['String'];
};


export type TeamCollectionChildrenArgs = {
  cursor?: InputMaybe<Scalars['String']>;
};

export type TeamEnvironment = {
  __typename?: 'TeamEnvironment';
  /** ID of the Team Environment */
  id: Scalars['ID'];
  /** Name of the environment */
  name: Scalars['String'];
  /** ID of the team this environment belongs to */
  teamID: Scalars['ID'];
  /** All variables present in the environment */
  variables: Scalars['String'];
};

export type TeamInvitation = {
  __typename?: 'TeamInvitation';
  /** Get the creator of the invite */
  creator: User;
  /** UID of the creator of the invite */
  creatorUid: Scalars['ID'];
  /** ID of the invite */
  id: Scalars['ID'];
  /** Email of the invitee */
  inviteeEmail: Scalars['ID'];
  /** The role that will be given to the invitee */
  inviteeRole: TeamMemberRole;
  /** Get the team associated to the invite */
  team: Team;
  /** ID of the team the invite is to */
  teamID: Scalars['ID'];
};

export type TeamMember = {
  __typename?: 'TeamMember';
  /** Membership ID of the Team Member */
  membershipID: Scalars['ID'];
  /** Role of the given team member in the given team */
  role: TeamMemberRole;
  user: User;
};

export enum TeamMemberRole {
  Editor = 'EDITOR',
  Owner = 'OWNER',
  Viewer = 'VIEWER'
}

export type TeamRequest = {
  __typename?: 'TeamRequest';
  /** Collection the request belongs to */
  collection: TeamCollection;
  /** ID of the collection the request belongs to. */
  collectionID: Scalars['ID'];
  /** ID of the request */
  id: Scalars['ID'];
  /** JSON string representing the request data */
  request: Scalars['String'];
  /** Team the request belongs to */
  team: Team;
  /** ID of the team the request belongs to. */
  teamID: Scalars['ID'];
  /** Displayed title of the request */
  title: Scalars['String'];
};

export type UpdateTeamRequestInput = {
  /** JSON string representing the request data */
  request?: InputMaybe<Scalars['String']>;
  /** Displayed title of the request */
  title?: InputMaybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  /** Displayed name of the user (if given) */
  displayName?: Maybe<Scalars['String']>;
  /** Email of the user (if given) */
  email?: Maybe<Scalars['String']>;
  /** URL to the profile photo of the user (if given) */
  photoURL?: Maybe<Scalars['String']>;
  /** Firebase UID of the user */
  uid: Scalars['ID'];
};

export type GetCollectionChildrenQueryVariables = Exact<{
  collectionID: Scalars['ID'];
  cursor?: InputMaybe<Scalars['String']>;
}>;


export type GetCollectionChildrenQuery = { __typename?: 'Query', collection?: { __typename?: 'TeamCollection', children: Array<{ __typename?: 'TeamCollection', id: string, title: string }> } | null };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'User', uid: string, displayName?: string | null, photoURL?: string | null } };


export const GetCollectionChildrenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCollectionChildren"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"collectionID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"collection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"collectionID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"collectionID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"children"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cursor"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]} as unknown as DocumentNode<GetCollectionChildrenQuery, GetCollectionChildrenQueryVariables>;
export const MeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"photoURL"}}]}}]}}]} as unknown as DocumentNode<MeQuery, MeQueryVariables>;
import { IntrospectionQuery } from 'graphql';
export default {
  "__schema": {
    "queryType": {
      "name": "Query"
    },
    "mutationType": {
      "name": "Mutation"
    },
    "subscriptionType": {
      "name": "Subscription"
    },
    "types": [
      {
        "kind": "OBJECT",
        "name": "CollectionReorderData",
        "fields": [
          {
            "name": "collection",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "TeamCollection",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "nextCollection",
            "type": {
              "kind": "OBJECT",
              "name": "TeamCollection",
              "ofType": null
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "Mutation",
        "fields": [
          {
            "name": "acceptTeamInvitation",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "TeamMember",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "inviteID",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "addTeamMemberByEmail",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "TeamMember",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "teamID",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "userEmail",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "userRole",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "createChildCollection",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "TeamCollection",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "childTitle",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "collectionID",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "createDuplicateEnvironment",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "TeamEnvironment",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "id",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "createRequestInCollection",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "TeamRequest",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "collectionID",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "data",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "createRootCollection",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "TeamCollection",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "teamID",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "title",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "createShortcode",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "Shortcode",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "request",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "createTeam",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "Team",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "name",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "createTeamEnvironment",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "TeamEnvironment",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "name",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "teamID",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "variables",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "createTeamInvitation",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "TeamInvitation",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "inviteeEmail",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "inviteeRole",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "teamID",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "deleteAllVariablesFromTeamEnvironment",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "TeamEnvironment",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "id",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "deleteCollection",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": [
              {
                "name": "collectionID",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "deleteRequest",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": [
              {
                "name": "requestID",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "deleteTeam",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": [
              {
                "name": "teamID",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "deleteTeamEnvironment",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": [
              {
                "name": "id",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "deleteUser",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "importCollectionFromUserFirestore",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "TeamCollection",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "fbCollectionPath",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "parentCollectionID",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "teamID",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "importCollectionsFromJSON",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": [
              {
                "name": "jsonString",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "parentCollectionID",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "teamID",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "leaveTeam",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": [
              {
                "name": "teamID",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "moveCollection",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "TeamCollection",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "collectionID",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "parentCollectionID",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          },
          {
            "name": "moveRequest",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "TeamRequest",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "destCollID",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "requestID",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "removeTeamMember",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": [
              {
                "name": "teamID",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "userUid",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "renameCollection",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "TeamCollection",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "collectionID",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "newTitle",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "renameTeam",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "Team",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "newName",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "teamID",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "replaceCollectionsWithJSON",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": [
              {
                "name": "jsonString",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "parentCollectionID",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "teamID",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "revokeShortcode",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": [
              {
                "name": "code",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "revokeTeamInvitation",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": [
              {
                "name": "inviteID",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "updateCollectionOrder",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": [
              {
                "name": "collectionID",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "destCollID",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          },
          {
            "name": "updateLookUpRequestOrder",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": [
              {
                "name": "collectionID",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "nextRequestID",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "requestID",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "updateRequest",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "TeamRequest",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "data",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "requestID",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "updateTeamEnvironment",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "TeamEnvironment",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "id",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "name",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "variables",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "updateTeamMemberRole",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "TeamMember",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "newRole",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "teamID",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "userUid",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "Query",
        "fields": [
          {
            "name": "collection",
            "type": {
              "kind": "OBJECT",
              "name": "TeamCollection",
              "ofType": null
            },
            "args": [
              {
                "name": "collectionID",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "collectionsOfTeam",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "TeamCollection",
                    "ofType": null
                  }
                }
              }
            },
            "args": [
              {
                "name": "cursor",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "teamID",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "exportCollectionsToJSON",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": [
              {
                "name": "teamID",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "me",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "User",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "myShortcodes",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "Shortcode",
                    "ofType": null
                  }
                }
              }
            },
            "args": [
              {
                "name": "cursor",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          },
          {
            "name": "myTeams",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "Team",
                    "ofType": null
                  }
                }
              }
            },
            "args": [
              {
                "name": "cursor",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          },
          {
            "name": "request",
            "type": {
              "kind": "OBJECT",
              "name": "TeamRequest",
              "ofType": null
            },
            "args": [
              {
                "name": "requestID",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "requestsInCollection",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "TeamRequest",
                    "ofType": null
                  }
                }
              }
            },
            "args": [
              {
                "name": "collectionID",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "cursor",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          },
          {
            "name": "rootCollectionsOfTeam",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "TeamCollection",
                    "ofType": null
                  }
                }
              }
            },
            "args": [
              {
                "name": "cursor",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "teamID",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "searchForRequest",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "TeamRequest",
                    "ofType": null
                  }
                }
              }
            },
            "args": [
              {
                "name": "cursor",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "searchTerm",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "teamID",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "shortcode",
            "type": {
              "kind": "OBJECT",
              "name": "Shortcode",
              "ofType": null
            },
            "args": [
              {
                "name": "code",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "team",
            "type": {
              "kind": "OBJECT",
              "name": "Team",
              "ofType": null
            },
            "args": [
              {
                "name": "teamID",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "teamInvitation",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "TeamInvitation",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "inviteID",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "user",
            "type": {
              "kind": "OBJECT",
              "name": "User",
              "ofType": null
            },
            "args": [
              {
                "name": "uid",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "RequestReorderData",
        "fields": [
          {
            "name": "nextRequest",
            "type": {
              "kind": "OBJECT",
              "name": "TeamRequest",
              "ofType": null
            },
            "args": []
          },
          {
            "name": "request",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "TeamRequest",
                "ofType": null
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "Shortcode",
        "fields": [
          {
            "name": "createdOn",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "id",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "request",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "Subscription",
        "fields": [
          {
            "name": "collectionOrderUpdated",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "CollectionReorderData",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "teamID",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "myShortcodesCreated",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "Shortcode",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "myShortcodesRevoked",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "Shortcode",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "requestMoved",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "TeamRequest",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "teamID",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "requestOrderUpdated",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "RequestReorderData",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "teamID",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "teamCollectionAdded",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "TeamCollection",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "teamID",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "teamCollectionMoved",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "TeamCollection",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "teamID",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "teamCollectionRemoved",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": [
              {
                "name": "teamID",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "teamCollectionUpdated",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "TeamCollection",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "teamID",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "teamEnvironmentCreated",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "TeamEnvironment",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "teamID",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "teamEnvironmentDeleted",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "TeamEnvironment",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "teamID",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "teamEnvironmentUpdated",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "TeamEnvironment",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "teamID",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "teamInvitationAdded",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "TeamInvitation",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "teamID",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "teamInvitationRemoved",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": [
              {
                "name": "teamID",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "teamMemberAdded",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "TeamMember",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "teamID",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "teamMemberRemoved",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": [
              {
                "name": "teamID",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "teamMemberUpdated",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "TeamMember",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "teamID",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "teamRequestAdded",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "TeamRequest",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "teamID",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "teamRequestDeleted",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": [
              {
                "name": "teamID",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "teamRequestUpdated",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "TeamRequest",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "teamID",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "userDeleted",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "User",
                "ofType": null
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "Team",
        "fields": [
          {
            "name": "editorsCount",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "id",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "members",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "TeamMember",
                    "ofType": null
                  }
                }
              }
            },
            "args": [
              {
                "name": "cursor",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          },
          {
            "name": "myRole",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "name",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "ownersCount",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "teamEnvironments",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "TeamEnvironment",
                    "ofType": null
                  }
                }
              }
            },
            "args": []
          },
          {
            "name": "teamInvitations",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "TeamInvitation",
                    "ofType": null
                  }
                }
              }
            },
            "args": []
          },
          {
            "name": "teamMembers",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "TeamMember",
                    "ofType": null
                  }
                }
              }
            },
            "args": []
          },
          {
            "name": "viewersCount",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "TeamCollection",
        "fields": [
          {
            "name": "children",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "TeamCollection",
                    "ofType": null
                  }
                }
              }
            },
            "args": [
              {
                "name": "cursor",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          },
          {
            "name": "id",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "parent",
            "type": {
              "kind": "OBJECT",
              "name": "TeamCollection",
              "ofType": null
            },
            "args": []
          },
          {
            "name": "team",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "Team",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "title",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "TeamEnvironment",
        "fields": [
          {
            "name": "id",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "name",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "teamID",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "variables",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "TeamInvitation",
        "fields": [
          {
            "name": "creator",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "User",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "creatorUid",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "id",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "inviteeEmail",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "inviteeRole",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "team",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "Team",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "teamID",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "TeamMember",
        "fields": [
          {
            "name": "membershipID",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "role",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "user",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "User",
                "ofType": null
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "TeamRequest",
        "fields": [
          {
            "name": "collection",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "TeamCollection",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "collectionID",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "id",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "request",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "team",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "Team",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "teamID",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "title",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "User",
        "fields": [
          {
            "name": "displayName",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "email",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "photoURL",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "uid",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "SCALAR",
        "name": "Any"
      }
    ],
    "directives": []
  }
} as unknown as IntrospectionQuery;