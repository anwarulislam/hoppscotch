<template>
  <div class="flex items-stretch group ml-4 flex-col">
    <button
      @click="selectRequest()"
      class="w-full rounded px-4 py-3 transition cursor-pointer focus:outline-none hover:active hover:bg-primaryLight hover:text-secondaryDark"
    >
      <div class="flex gap-4 mb-1">
        <span
          class="flex items-center justify-center truncate pointer-events-none"
          :style="{ color: requestLabelColor }"
        >
          <span class="font-bold truncate">
            {{ request.method }}
          </span>
        </span>
        <span class="truncate text-sm text-secondaryDark">
          {{ request.name }}
        </span>
        <span
          :class="[
            statusCategory.className,
            'outlined text-xs rounded-md px-2 flex items-center',
          ]"
          v-if="statusCode"
        >
          {{ statusCode }}
        </span>

        <span
          v-if="requestResult?.isLoading"
          class="flex flex-col items-center"
        >
          <HoppSmartSpinner />
        </span>
      </div>

      <p
        class="text-left text-secondaryLight text-sm"
        :aria-details="`${isLoading}`"
      >
        {{ request.endpoint }}
      </p>
    </button>
    <HttpTestTestResult
      :show-empty-message="false"
      v-if="requestResult?.testResults"
      :model-value="requestResult.testResults"
    />
  </div>
</template>

<script setup lang="ts">
import { useService } from "dioc/vue"
import { computed, ref } from "vue"
import findStatusGroup from "~/helpers/findStatusGroup"
import { getMethodLabelColorClassOf } from "~/helpers/rest/labelColoring"
import {
  TestRunnerRequest,
  TestRunnerService,
} from "~/services/test-runner/test-runner.service"

const props = withDefaults(
  defineProps<{
    request: TestRunnerRequest
    requestID?: string
    parentID: string | null
    isActive?: boolean
    isSelected?: boolean
    showSelection?: boolean
  }>(),
  {
    parentID: null,
    isActive: false,
    isSelected: false,
    showSelection: false,
  }
)

const isLoading = ref(false)

const testRunner = useService(TestRunnerService)

const requestResult = computed(() => {
  if (!props.request.requestId) return null
  return testRunner.getRequestResults(props.request.requestId)
})

const statusCode = computed(() => {
  return requestResult.value?.response?.type === "success" ||
    requestResult.value?.response?.type === "fail"
    ? requestResult.value?.response?.statusCode
    : null
})

const statusCategory = computed(() => {
  const def = {
    name: "error",
    className: "text-red-500",
  }
  if (!requestResult.value) return def
  const { response } = requestResult.value

  if (
    response === null ||
    response === undefined ||
    response.type === "loading" ||
    response.type === "network_fail" ||
    response.type === "script_fail" ||
    response.type === "fail" ||
    response.type === "extension_error"
  )
    return def

  return findStatusGroup(response.statusCode)
})

const emit = defineEmits<{
  (event: "select-request"): void
}>()

const requestLabelColor = computed(() =>
  getMethodLabelColorClassOf(props.request.method)
)

const selectRequest = () => {
  emit("select-request")
}
</script>

<style lang="scss" scoped>
.active {
  @apply after:bg-accentLight;
}
</style>
