<template>
  <div class="relative flex flex-1 flex-col">
    <HttpResponseMeta :response="doc.response" :is-embed="false" />
    <LensesResponseBodyRenderer v-if="hasResponse" v-model:document="doc" />
  </div>
</template>

<script setup lang="ts">
import { useVModel } from "@vueuse/core"
import { computed } from "vue"
import {
  HoppRequestDocument,
  HoppTestRunnerDocument,
} from "~/helpers/rest/document"
import { HoppTab } from "~/services/tab"

const props = defineProps<{
  document: HoppTab<HoppTestRunnerDocument>
}>()

const emit = defineEmits<{
  (e: "update:tab", val: HoppRequestDocument): void
}>()

const doc = useVModel(props, "document", emit)

const hasResponse = computed(
  () =>
    doc.value.response?.type === "success" ||
    doc.value.response?.type === "fail"
)
</script>
