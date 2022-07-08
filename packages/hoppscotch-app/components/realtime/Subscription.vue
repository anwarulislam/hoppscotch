<template>
  <SmartModal v-if="show" dialog :title="t('mqtt.new')" @close="hideModal">
    <template #body>
      <div class="flex justify-between px-2 mb-4">
        <div class="flex items-center">
          <label class="font-semibold text-secondaryLight">
            {{ t("mqtt.qos") }}
          </label>
          <tippy
            ref="QoSOptions"
            interactive
            trigger="click"
            theme="popover"
            arrow
          >
            <template #trigger>
              <span class="select-wrapper">
                <ButtonSecondary
                  class="pr-8 ml-2 rounded-none"
                  :label="`${QoS}`"
                />
              </span>
            </template>
            <div class="flex flex-col" role="menu">
              <SmartItem
                v-for="item in QoSValues"
                :key="`qos-${item}`"
                :label="`${item}`"
                :icon="
                  QoS === item
                    ? 'radio_button_checked'
                    : 'radio_button_unchecked'
                "
                :active="QoS === item"
                @click.native="
                  () => {
                    QoS = item
                    QoSOptions.tippy().hide()
                  }
                "
              />
            </div>
          </tippy>
        </div>

        <div class="flex items-center">
          <label
            for="select-color"
            class="px-4 font-semibold text-secondaryLight"
          >
            {{ t("mqtt.color") }}
          </label>
          <input
            id="select-color"
            v-model="color"
            type="color"
            class="px-1 rounded-md"
          />
        </div>
      </div>

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
import { MQTTTopic } from "~/helpers/realtime/MQTTConnection"
import { useI18n, useToast } from "~/helpers/utils/composables"

const toastr = useToast()
const t = useI18n()

const QoSOptions = ref<any>()

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
  (e: "submit", body: MQTTTopic): void
}>()

const QoSValues = [2, 1, 0] as const
const QoS = ref<2 | 1 | 0>(2)
const name = ref("")
const color = ref("#f58290")

const addNewSubscription = () => {
  if (!name.value) {
    toastr.error(t("mqtt.invalid_topic").toString())
    return
  }
  emit("submit", {
    name: name.value,
    qos: QoS.value,
    color: color.value,
  })

  const randomColor = Math.floor(Math.random() * 16777215).toString(16)
  color.value = `#${randomColor}`
}
const hideModal = () => {
  name.value = ""
  QoS.value = 2
  emit("hide-modal")
}
</script>
