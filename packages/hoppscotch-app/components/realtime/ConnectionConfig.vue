<template>
  <div class="flex flex-1 flex-col">
    <div
      class="sticky z-10 flex items-center justify-between pl-4 pr-2 py-2 border-b bg-primary border-dividerLight top-upperPrimaryStickyFold"
    >
      <span class="flex items-center">
        <label class="font-semibold text-secondaryLight">
          {{ t("mqtt.connection_config") }}
        </label>
      </span>

      <div class="flex">
        <SmartCheckbox
          :on="config.cleanSession"
          class="px-2"
          @change="config.cleanSession = !config.cleanSession"
          >{{ t("mqtt.clean_session") }}
        </SmartCheckbox>
      </div>
    </div>
    <div class="flex flex-1 border-dividerLight h-full">
      <div class="w-1/3 border-r border-dividerLight">
        <div class="flex flex-1 border-b border-dividerLight">
          <SmartEnvInput
            v-model="config.username"
            :placeholder="t('authorization.username')"
          />
        </div>
        <div class="flex flex-1 border-b border-dividerLight">
          <SmartEnvInput
            v-model="config.password"
            :placeholder="t('authorization.password')"
          />
        </div>
        <div class="flex items-center border-b border-dividerLight">
          <label class="ml-4 text-secondaryLight">
            {{ t("mqtt.keep_alive") }}
          </label>
          <SmartEnvInput
            v-model="config.keepAlive"
            :placeholder="t('mqtt.keep_alive')"
          />
        </div>
      </div>
      <div class="w-2/3">
        <div class="flex flex-1 border-b border-dividerLight">
          <SmartEnvInput
            v-model="config.lwTopic"
            :placeholder="t('mqtt.lw_topic')"
          />
        </div>
        <div class="flex flex-1 border-b border-dividerLight">
          <SmartEnvInput
            v-model="config.lwMessage"
            :placeholder="t('mqtt.lw_message')"
          />
        </div>
        <div class="flex items-center justify-between px-4">
          <div class="flex items-center">
            <label class="font-semibold text-secondaryLight">
              {{ t("mqtt.lw_qos") }}
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
                    :label="`${config.lwQos}`"
                  />
                </span>
              </template>
              <div class="flex flex-col" role="menu">
                <SmartItem
                  v-for="item in QoSValues"
                  :key="`qos-${item}`"
                  :label="`${item}`"
                  :icon="
                    config.lwQos === item
                      ? 'radio_button_checked'
                      : 'radio_button_unchecked'
                  "
                  :active="config.lwQos === item"
                  @click.native="
                    () => {
                      config.lwQos = item
                      QoSOptions.tippy().hide()
                    }
                  "
                />
              </div>
            </tippy>
          </div>

          <SmartCheckbox
            :on="config.lwRetain"
            class="py-2"
            @change="config.lwRetain = !config.lwRetain"
            >{{ t("mqtt.lw_retain") }}
          </SmartCheckbox>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "@nuxtjs/composition-api"
import { useI18n } from "~/helpers/utils/composables"
import { MQTTConnectionConfig } from "~/helpers/realtime/MQTTConnection"

const t = useI18n()
const QoSOptions = ref<any>()
const QoSValues = [2, 1, 0] as const

const emit = defineEmits<{
  (e: "change", body: MQTTConnectionConfig): void
}>()

// config
const config = ref<MQTTConnectionConfig>({
  username: "",
  password: "",
  keepAlive: "60",
  cleanSession: true,
  lwTopic: "",
  lwMessage: "",
  lwQos: 0,
  lwRetain: false,
})

watch(
  config,
  (newVal) => {
    emit("change", newVal)
  },
  { immediate: true }
)
</script>
