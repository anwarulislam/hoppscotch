<template>
  <SmartModal v-if="show" dialog :title="t('mqtt.new')" @close="hideModal">
    <template #body>
      <div class="flex flex-col px-2">
        <input
          id="selectLabelAdd"
          v-model="name"
          v-focus
          class="input floating-input"
          placeholder=" "
          type="text"
          autocomplete="off"
          @keyup.enter="addNewSubscription"
        />
        <label for="selectLabelAdd">
          {{ t("action.label") }}
        </label>
      </div>
    </template>
    <template #footer>
      <span>
        <ButtonPrimary
          :label="t('mqtt.subscribe')"
          :loading="loadingState"
          @click.native="addNewSubscription"
        />
        <ButtonSecondary
          :label="t('action.cancel')"
          @click.native="hideModal"
        />
      </span>
    </template>
  </SmartModal>
</template>

<script lang="ts" setup>
import { ref } from "@nuxtjs/composition-api"
import { useI18n, useToast } from "~/helpers/utils/composables"

const toastr = useToast()
const t = useI18n()

defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  loadingState: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  (e: "hide-modal"): void
  (e: "submit", body: string): void
}>()
const name = ref("")

const addNewSubscription = () => {
  if (!name.value) {
    toastr.error(t("mqtt.invalid_topic").toString())
    return
  }
  emit("submit", name.value)
}
const hideModal = () => {
  name.value = ""
  emit("hide-modal")
}
</script>
