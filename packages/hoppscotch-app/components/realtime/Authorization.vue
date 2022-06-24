<template>
  <div>
    <div
      class="sticky z-10 flex items-center justify-between pl-4 pr-2 border-b bg-primary border-dividerLight top-upperPrimaryStickyFold"
    >
      <span class="flex items-center">
        <label class="font-semibold text-secondaryLight">
          {{ t("authorization.type") }}
        </label>
        <tippy
          ref="authTypeOptions"
          interactive
          trigger="click"
          theme="popover"
          arrow
        >
          <template #trigger>
            <span class="select-wrapper">
              <ButtonSecondary
                class="pr-8 ml-2 rounded-none"
                :label="authType"
              />
            </span>
          </template>
          <div class="flex flex-col" role="menu">
            <SmartItem
              label="None"
              :icon="
                authType === 'none'
                  ? 'radio_button_checked'
                  : 'radio_button_unchecked'
              "
              :active="authType === 'none'"
              @click.native="
                () => {
                  authType = 'none'
                  authTypeOptions.tippy().hide()
                }
              "
            />
            <SmartItem
              label="Basic Auth"
              :icon="
                authType === 'basic'
                  ? 'radio_button_checked'
                  : 'radio_button_unchecked'
              "
              :active="authType === 'basic'"
              @click.native="
                () => {
                  authType = 'basic'
                  authTypeOptions.tippy().hide()
                }
              "
            />
            <SmartItem
              label="Token"
              :icon="
                authType === 'token'
                  ? 'radio_button_checked'
                  : 'radio_button_unchecked'
              "
              :active="authType === 'token'"
              @click.native="
                () => {
                  authType = 'token'
                  authTypeOptions.tippy().hide()
                }
              "
            />
          </div>
        </tippy>
      </span>
      <div class="flex">
        <ButtonSecondary
          v-tippy="{ theme: 'tooltip' }"
          to="https://docs.hoppscotch.io/features/authorization"
          blank
          :title="t('app.wiki')"
          svg="help-circle"
        />
      </div>
    </div>
    <div
      v-if="authType === 'none'"
      class="flex flex-col items-center justify-center p-4 text-secondaryLight"
    >
      <img
        :src="`/images/states/${$colorMode.value}/login.svg`"
        loading="lazy"
        class="inline-flex flex-col object-contain object-center w-16 h-16 my-4"
        :alt="`${t('empty.authorization')}`"
      />
      <span class="pb-4 text-center">
        {{ t("mqtt.connection_not_authorized") }}
      </span>
      <ButtonSecondary
        outline
        :label="t('app.documentation')"
        to="https://docs.hoppscotch.io/features/authorization"
        blank
        svg="external-link"
        reverse
        class="mb-4"
      />
    </div>

    <div v-else class="flex flex-1 border-b border-dividerLight">
      <div class="w-2/3 border-r border-dividerLight">
        <div v-if="authType === 'basic'">
          <div class="flex flex-1 border-b border-dividerLight">
            <SmartEnvInput
              v-model="username"
              :placeholder="t('authorization.username')"
            />
          </div>
          <div class="flex flex-1 border-b border-dividerLight">
            <SmartEnvInput
              v-model="password"
              :placeholder="t('authorization.password')"
            />
          </div>
        </div>
        <div v-if="authType === 'token'">
          <div class="flex flex-1 border-b border-dividerLight">
            <SmartEnvInput
              v-model="token"
              :placeholder="t('authorization.token')"
            />
          </div>
        </div>
      </div>
      <div
        class="sticky h-full p-4 overflow-auto bg-primary top-upperTertiaryStickyFold min-w-46 max-w-1/3 z-9"
      >
        <div class="p-2">
          <div class="pb-2 text-secondaryLight">
            {{ t("helpers.authorization") }}
          </div>
          <SmartAnchor
            class="link"
            :label="`${t('authorization.learn')} \xA0 →`"
            to="https://docs.hoppscotch.io/features/authorization"
            blank
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "@nuxtjs/composition-api"
import { useI18n } from "~/helpers/utils/composables"

const t = useI18n()
// Authorization
const authTypeOptions = ref<any>()
const authType = ref<"none" | "basic" | "token">("none")

// Basic Auth
const username = ref("")
const password = ref("")

// Token Auth
const token = ref("")
</script>
