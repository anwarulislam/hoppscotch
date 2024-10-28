import { HoppCollection, HoppRESTRequest } from "@hoppscotch/data"
import { Service } from "dioc"
import * as E from "fp-ts/Either"
import { cloneDeep } from "lodash-es"
import { reactive, Ref, ref } from "vue"
import { runTestRunnerRequest } from "~/helpers/RequestRunner"
import {
  HoppTestRunnerDocument,
  TestRunnerConfig,
} from "~/helpers/rest/document"
import { HoppRESTResponse } from "~/helpers/types/HoppRESTResponse"
import { HoppTestResult } from "~/helpers/types/HoppTestResult"
import { HoppTab } from "../tab"

// Modified to remove response and testResults from the request itself
export type TestRunnerRequest = HoppRESTRequest & {
  requestId: string
}

// New interface for storing request results
export interface RequestResults {
  response?: HoppRESTResponse | null
  isLoading: boolean
  testResults?: HoppTestResult | null
  error?: string
}

export type TestRunState = {
  status: "idle" | "running" | "stopped" | "error"
  totalRequests: number
  totalTime: number
  completedRequests: number
  errors: Array<{
    requestPath: string
    error: string
  }>
  result: HoppCollection
}

export type TestRunnerOptions = {
  stopRef: Ref<boolean>
} & TestRunnerConfig

function delay(timeMS: number) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(resolve, timeMS)
    return () => {
      clearTimeout(timeout)
      reject(new Error("Operation cancelled"))
    }
  })
}

export class TestRunnerService extends Service {
  public static readonly ID = "TEST_RUNNER_SERVICE"

  // Map to store request results
  protected requestResultsMap = reactive(new Map<string, RequestResults>())

  // Generate unique ID for requests
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Get results for a request
  public getRequestResults(requestId: string) {
    return this.requestResultsMap.get(requestId)
    // return computed(() => this.requestResultsMap.get(requestId))
  }

  private getRequestPath(
    collection: HoppCollection,
    request: TestRunnerRequest,
    parentPath: string = ""
  ): string {
    const currentPath = parentPath
      ? `${parentPath} > ${collection.name}`
      : collection.name

    if (collection.requests.includes(request)) {
      return `${currentPath} > ${request.name}`
    }

    for (const folder of collection.folders) {
      const path = this.getRequestPath(folder, request, currentPath)
      if (path) return path
    }

    return ""
  }

  private async runTestRequest(
    state: Ref<TestRunState>,
    request: TestRunnerRequest,
    collection: HoppCollection,
    options: TestRunnerOptions
  ) {
    if (options.stopRef?.value) {
      throw new Error("Test execution stopped")
    }

    // Generate ID if not exists
    if (!request.requestId) {
      request.requestId = this.generateRequestId()
    }

    // Create or get reference for results
    let resultsRef = this.requestResultsMap.get(request.requestId)
    if (!resultsRef) {
      resultsRef = {
        isLoading: true,
      }
      this.requestResultsMap.set(request.requestId, resultsRef)
    }

    try {
      resultsRef.error = undefined

      const results = await runTestRunnerRequest(request)

      // Check again after the request in case it was stopped during execution
      if (options.stopRef?.value) {
        throw new Error("Test execution stopped")
      }

      if (results && E.isRight(results)) {
        const { response, testResult } = results.right

        if (options.persistResponses) {
          resultsRef.response = response
        }
        resultsRef.testResults = testResult

        if (response.type === "success" || response.type === "fail") {
          state.value.totalTime += response.meta.responseDuration
          state.value.completedRequests++
        }
      } else {
        const errorMsg = "Request execution failed"
        resultsRef.error = errorMsg
        state.value.errors.push({
          requestPath: this.getRequestPath(collection, request),
          error: errorMsg,
        })

        if (options.stopOnError) {
          state.value.status = "stopped"
          throw new Error("Test execution stopped due to error")
        }
      }
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "Test execution stopped"
      ) {
        throw error
      }

      const errorMsg =
        error instanceof Error ? error.message : "Unknown error occurred"
      resultsRef.error = errorMsg
      state.value.errors.push({
        requestPath: this.getRequestPath(collection, request),
        error: errorMsg,
      })

      if (options.stopOnError) {
        state.value.status = "stopped"
        throw new Error("Test execution stopped due to error")
      }
    } finally {
      resultsRef.isLoading = false
    }

    console.log("Request results", this.requestResultsMap)
  }

  private async runTestCollection(
    tab: Ref<HoppTab<HoppTestRunnerDocument>>,
    state: Ref<TestRunState>,
    collection: TestRunState["result"],
    options: TestRunnerOptions
  ) {
    try {
      for (const folder of collection.folders) {
        if (options.stopRef?.value) {
          state.value.status = "stopped"
          throw new Error("Test execution stopped")
        }
        await this.runTestCollection(tab, state, folder, options)
      }

      for (const request of collection.requests) {
        if (options.stopRef?.value) {
          state.value.status = "stopped"
          throw new Error("Test execution stopped")
        }

        await this.runTestRequest(
          state,
          request as TestRunnerRequest,
          collection,
          options
        )

        if (options.delay && options.delay > 0) {
          try {
            await delay(options.delay)
          } catch (error) {
            if (options.stopRef?.value) {
              state.value.status = "stopped"
              throw new Error("Test execution stopped")
            }
          }
        }
      }
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "Test execution stopped"
      ) {
        throw error
      }
      state.value.status = "error"
      console.error("Collection execution failed:", error)
      throw error
    }
  }

  public runTests(
    tab: Ref<HoppTab<HoppTestRunnerDocument>>,
    collection: HoppCollection,
    options: TestRunnerOptions
  ): Ref<TestRunState> {
    // Clear previous results map when starting new test run
    this.requestResultsMap.clear()

    const state = ref<TestRunState>({
      status: "running",
      totalRequests: collection.requests.length,
      totalTime: 0,
      completedRequests: 0,
      errors: [],
      result: cloneDeep(collection),
    })

    tab.value.document.isRunning = state.value.status === "running"

    this.runTestCollection(tab, state, state.value.result, options)
      .then(() => {
        state.value.status = "stopped"
        tab.value.document.isRunning = false
      })
      .catch((error) => {
        tab.value.document.isRunning = false
        if (
          error instanceof Error &&
          error.message === "Test execution stopped"
        ) {
          state.value.status = "stopped"
        } else {
          state.value.status = "error"
          console.error("Test runner failed:", error)
        }
      })
      .finally(() => {
        state.value.status = "stopped"
        tab.value.document.isRunning = false
      })

    return state
  }
}
