<template>
  <div class="h-full">
    <div
      class="sticky z-10 flex items-center justify-between pl-4 pr-2 py-2 border-b bg-primary border-dividerLight top-upperPrimaryStickyFold"
    >
      <label class="font-semibold text-secondaryLight">
        {{ t("mqtt.connection_config") }}
      </label>
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
        <div class="flex items-center border-b border-dividerLight">
          <SmartCheckbox
            :on="config.cleanSession"
            class="py-2 px-4"
            @change="config.cleanSession = !config.cleanSession"
            >{{ t("mqtt.clean_session") }}
          </SmartCheckbox>
        </div>
        <div class="flex items-center border-b border-dividerLight">
          <SmartCheckbox
            :on="config.ssl"
            class="py-2 px-4"
            @change="config.ssl = !config.ssl"
            >{{ t("mqtt.ssl") }}
          </SmartCheckbox>
        </div>
      </div>
      <div class="w-2/3 px-4">
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "@nuxtjs/composition-api"
import { useI18n } from "~/helpers/utils/composables"

const t = useI18n()
const QoSOptions = ref<any>()
const QoSValues = [2, 1, 0] as const

// config
const config = ref<{
  username: string
  password: string
  keepAlive: string
  cleanSession: boolean
  lwTopic: string
  lwMessage: string
  lwQos: 2 | 1 | 0
  lwRetain: boolean
  ssl: boolean
}>({
  username: "",
  password: "",
  keepAlive: "60",
  cleanSession: true,
  lwTopic: "",
  lwMessage: "",
  lwQos: 0,
  lwRetain: false,
  ssl: false,
})
</script>
