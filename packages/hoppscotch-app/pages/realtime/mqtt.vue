<template>
  <AppPaneLayout layout-id="mqtt">
    <template #primary>
      <div
        class="sticky top-0 z-10 flex flex-shrink-0 p-4 overflow-x-auto space-x-2 bg-primary hide-scrollbar"
      >
        <div class="inline-flex flex-1 space-x-2">
          <input
            id="mqtt-url"
            v-model="url"
            type="url"
            autocomplete="off"
            spellcheck="false"
            class="w-full px-4 py-2 border rounded bg-primaryLight border-divider text-secondaryDark"
            :placeholder="t('mqtt.url')"
            :disabled="
              connectionState === 'CONNECTED' ||
              connectionState === 'CONNECTING'
            "
            @keyup.enter="isUrlValid ? toggleConnection() : null"
          />
          <ButtonPrimary
            id="connect"
            :disabled="!isUrlValid"
            class="w-32"
            :label="
              connectionState === 'DISCONNECTED'
                ? t('action.connect')
                : t('action.disconnect')
            "
            :loading="connectionState === 'CONNECTING'"
            @click.native="toggleConnection"
          />
        </div>
      </div>

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
    </template>
    <template #secondary>
      <div class="h-full flex flex-col hide-scrollbar !overflow-auto">
        <div
          class="relative sticky top-0 inline-flex w-full divide-divider divide-x bg-primaryLight"
        >
          <draggable
            v-bind="dragOptions"
            :list="tabs"
            :style="tabsWidth"
            class="flex overflow-x-auto transition hide-scrollbar"
          >
            <transition-group
              class="flex divide-primaryDark divide-x"
              name="fade"
              appear
            >
              <button
                v-for="tab in tabs"
                :key="`tab-${tab.id}`"
                :class="[{ active: active(tab.id) }, 'tab']"
                @click="changeTab(tab.id)"
              >
                <span class="truncate">{{ tab.name }}</span>
                <ButtonSecondary
                  v-if="tab.removable"
                  svg="x"
                  :class="[{ active: active(tab.id) }, 'close']"
                  class="rounded my-0.5 mr-0.5 ml-4 !p-1"
                  @click.native.stop="closeTab(tab.id)"
                />
              </button>
            </transition-group>
          </draggable>
          <span class="flex items-center justify-center p-1 bg-primaryLight">
            <ButtonSecondary
              svg="plus"
              class="sticky right-0 rounded"
              @click.native="addTab"
            />
          </span>
        </div>

        <div v-if="tabs.length">
          <div
            v-for="(tab, index) in tabs"
            :key="`subscription-${tab.id}`"
            :class="[{ active: active(tab.id) }, 'tab-content !px-0']"
          >
            <div class="w-full flex flex-col">
              <RealtimeLog
                :title="t('mqtt.log')"
                :log="log"
                @delete="clearLogEntries()"
              />
              <RealtimeCommunication
                :show-event-field="index === 0"
                :is-connected="connectionState === 'CONNECTED'"
                @send-message="publish($event)"
              />
            </div>
          </div>
        </div>
        <div v-else>
          <div class="empty-tab-content">Empty</div>
        </div>
      </div>
    </template>
    <template #sidebar>
      <div
        class="sticky z-10 flex flex-col border-b rounded-t divide-y divide-dividerLight bg-primary border-dividerLight"
      >
        <div class="flex justify-between flex-1">
          <ButtonSecondary
            svg="plus"
            :label="t('mqtt.new')"
            class="!rounded-none"
            @click.native="showSubscriptionModal(true)"
          />
          <span class="flex">
            <ButtonSecondary
              v-tippy="{ theme: 'tooltip' }"
              to="https://docs.hoppscotch.io/features/mqtt"
              blank
              :title="t('app.wiki')"
              svg="help-circle"
            />
          </span>
        </div>
      </div>

      <div
        v-if="subscriptions.length === 0"
        class="flex flex-col items-center justify-center p-4 text-secondaryLight"
      >
        <img
          :src="`/images/states/${$colorMode.value}/pack.svg`"
          loading="lazy"
          class="inline-flex flex-col object-contain object-center w-16 h-16 my-4"
          :alt="t('empty.subscription')"
        />
        <span class="pb-4 text-center">
          {{ t("empty.subscription") }}
        </span>
        <ButtonSecondary
          :label="t('mqtt.new')"
          filled
          @click.native="showSubscriptionModal(true)"
        />
      </div>

      <div v-else>
        <div
          v-for="(subscription, index) in subscriptions"
          :key="`subscription-${index}`"
          class="flex flex-col"
        >
          <div class="flex items-stretch group">
            <span class="flex items-center justify-center px-4 cursor-pointer">
              <SmartIcon
                class="svg-icons"
                name="square"
                :style="{
                  fill: subscription.color,
                  color: subscription.color,
                }"
              />
            </span>
            <span
              class="flex flex-1 min-w-0 py-2 pr-2 cursor-pointer transition group-hover:text-secondaryDark"
            >
              <span class="truncate"> {{ subscription.topic }} </span>
            </span>
            <ButtonSecondary
              v-tippy="{ theme: 'tooltip' }"
              svg="trash"
              color="red"
              :title="t('mqtt.unsubscribe')"
              class="hidden group-hover:inline-flex"
              data-testid="unsubscribe_mqtt_subscription"
              @click.native="unsubscribeFromTopic(subscription.topic)"
            />
          </div>
        </div>
      </div>

      <RealtimeSubscription
        :show="subscriptionModal"
        :loading-state="subscribing"
        @submit="subscribeToTopic"
        @hide-modal="showSubscriptionModal(false)"
      />
    </template>
  </AppPaneLayout>
</template>

<script setup lang="ts">
import {
  computed,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from "@nuxtjs/composition-api"
import debounce from "lodash/debounce"
import draggable from "vuedraggable"
import { MQTTConnection, MQTTError } from "~/helpers/realtime/MQTTConnection"
import {
  useI18n,
  useNuxt,
  useReadonlyStream,
  useStream,
  useStreamSubscriber,
  useToast,
} from "~/helpers/utils/composables"
import {
  addMQTTLogLine,
  MQTTConn$,
  MQTTEndpoint$,
  MQTTLog$,
  setMQTTConn,
  setMQTTEndpoint,
  setMQTTLog,
} from "~/newstore/MQTTSession"

const t = useI18n()
const nuxt = useNuxt()
const toast = useToast()
const { subscribeToStream } = useStreamSubscriber()

const url = useStream(MQTTEndpoint$, "", setMQTTEndpoint)
const log = useStream(MQTTLog$, [], setMQTTLog)
const socket = useStream(MQTTConn$, new MQTTConnection(), setMQTTConn)
const connectionState = useReadonlyStream(
  socket.value.connectionState$,
  "DISCONNECTED"
)
const subscriptionState = useReadonlyStream(
  socket.value.subscriptionState$,
  false
)
const subscribing = useReadonlyStream(socket.value.subscribing$, false)

const isUrlValid = ref(true)
const subTopic = ref("")

// Authorization
const authTypeOptions = ref<HTMLElement>()
const authType = ref<"none" | "basic" | "token">("none")

// Basic Auth
const username = ref("")
const password = ref("")

// Token Auth
const token = ref("")

let worker: Worker

const colors = [
  "#f58290",
  "#00c0a5",
  "#6776e8",
  "#e2c31d",
  "#189bfe",
  "#c778f5",
  "#bd28bd",
  "#e87936",
  "#486bed",
  "#1fc84d",
  "#0052cc",
  "#866dff",
] as const
const subscriptionModal = ref(false)
const canSubscribe = computed(
  () => subTopic.value !== "" && connectionState.value === "CONNECTED"
)
const subscriptions = ref<{ color: string; topic: string }[]>([])

const showSubscriptionModal = (show: boolean) => {
  subscriptionModal.value = show
}

const workerResponseHandler = ({
  data,
}: {
  data: { url: string; result: boolean }
}) => {
  if (data.url === url.value) isUrlValid.value = data.result
}

onMounted(() => {
  worker = nuxt.value.$worker.createRejexWorker()
  worker.addEventListener("message", workerResponseHandler)

  subscribeToStream(socket.value.event$, (event) => {
    switch (event?.type) {
      case "CONNECTING":
        log.value = [
          {
            payload: `${t("state.connecting_to", { name: url.value })}`,
            source: "info",
            color: "var(--accent-color)",
            ts: undefined,
          },
        ]
        break

      case "CONNECTED":
        log.value = [
          {
            payload: `${t("state.connected_to", { name: url.value })}`,
            source: "info",
            color: "var(--accent-color)",
            ts: Date.now(),
          },
        ]
        toast.success(`${t("state.connected")}`)
        break

      case "MESSAGE_SENT":
        addMQTTLogLine({
          prefix: `${event.message.topic}`,
          payload: event.message.message,
          source: "client",
          ts: Date.now(),
        })
        break

      case "MESSAGE_RECEIVED":
        addMQTTLogLine({
          prefix: `${event.message.topic}`,
          payload: event.message.message,
          source: "server",
          ts: event.time,
        })
        break

      case "SUBSCRIBED":
        subscriptions.value.push({
          topic: event.topic,
          color: colors[subscriptions.value.length % colors.length],
        })
        showSubscriptionModal(false)
        addMQTTLogLine({
          payload: subscriptionState.value
            ? `${t("state.subscribed_success", { topic: event.topic })}`
            : `${t("state.unsubscribed_success", { topic: event.topic })}`,
          source: "server",
          ts: event.time,
        })
        break

      case "SUBSCRIPTION_FAILED":
        addMQTTLogLine({
          payload: subscriptionState.value
            ? `${t("state.subscribed_failed", { topic: subTopic.value })}`
            : `${t("state.unsubscribed_failed", { topic: subTopic.value })}`,
          source: "server",
          ts: event.time,
        })
        break

      case "ERROR":
        addMQTTLogLine({
          payload: getI18nError(event.error),
          source: "info",
          color: "#ff5555",
          ts: event.time,
        })
        break

      case "DISCONNECTED":
        addMQTTLogLine({
          payload: t("state.disconnected_from", { name: url.value }).toString(),
          source: "info",
          color: "#ff5555",
          ts: event.time,
        })
        toast.error(`${t("state.disconnected")}`)
        break
    }
  })
})

const debouncer = debounce(function () {
  worker.postMessage({ type: "ws", url: url.value })
}, 1000)

watch(url, (newUrl) => {
  if (newUrl) debouncer()
})

onUnmounted(() => {
  worker.terminate()
})

// METHODS
const toggleConnection = () => {
  // If it is connecting:
  if (connectionState.value === "DISCONNECTED") {
    return socket.value.connect(url.value, username.value, password.value)
  }
  // Otherwise, it's disconnecting.
  socket.value.disconnect()
}
const publish = (event: { message: string; eventName: string }) => {
  socket.value?.publish(event.eventName, event.message)
}

const subscribeToTopic = (topic: string) => {
  if (canSubscribe.value) {
    socket.value.subscribe(topic)
  } else {
    subscriptionModal.value = false
    toast.error(`${t("mqtt.not_connected")}`)
  }
  console.log(topic)
}

const unsubscribeFromTopic = (topic: string) => {
  subscriptions.value = subscriptions.value.filter((sub) => sub.topic !== topic)
  console.log(topic)
}

const getI18nError = (error: MQTTError): string => {
  if (typeof error === "string") return error

  switch (error.type) {
    case "CONNECTION_NOT_ESTABLISHED":
      return t("state.connection_lost").toString()
    case "SUBSCRIPTION_FAILED":
      return t("state.mqtt_subscription_failed", {
        topic: error.topic,
      }).toString()
    case "PUBLISH_ERROR":
      return t("state.publish_error", { topic: error.topic }).toString()
    case "CONNECTION_LOST":
      return t("state.connection_lost").toString()
    case "CONNECTION_FAILED":
      return t("state.connection_failed").toString()
    default:
      return t("state.disconnected_from", { name: url.value }).toString()
  }
}
const clearLogEntries = () => {
  log.value = []
}

const currentTabId = ref(0)
const nextTabId = ref(1)
const tabs = ref([
  {
    id: 0,
    name: "All Topics",
    removable: false,
  },
])

const dragOptions = computed(() => ({
  group: "tabs",
  animation: 250,
  handle: ".tab",
  draggable: ".tab",
  ghostClass: "cursor-move",
}))

const tabsWidth = computed(() => ({
  maxWidth: `${tabs.value.length * 184}px`,
  width: "100%",
  minWidth: "0px",
  transition: "max-width 0.2s",
}))

const active = (id: number) => id === currentTabId.value

const changeTab = (id: number) => {
  currentTabId.value = id
}

const addTab = () => {
  tabs.value.push({
    id: nextTabId.value,
    name: "Untitled request",
    removable: true,
  })
  currentTabId.value = nextTabId.value
  nextTabId.value++
}

const closeTab = (id: number) => {
  const index = tabs.value.findIndex((tab) => tab.id === id)
  tabs.value.splice(index, 1)
  if (currentTabId.value === id) {
    if (tabs.value[index]?.id) currentTabId.value = tabs.value[index]?.id
    else currentTabId.value = tabs.value[tabs.value.length - 1]?.id
  }
}
</script>

<style lang="scss" scoped>
.tab {
  @apply relative;
  @apply flex;
  @apply pl-4;
  @apply pr-1;
  @apply py-1;
  @apply font-semibold;
  @apply w-46;
  @apply transition;
  @apply flex-1;
  @apply items-center;
  @apply justify-between;
  @apply text-secondaryLight;
  @apply hover:bg-primaryDark;
  @apply hover:text-secondary;
  @apply focus-visible:text-secondaryDark;
  &::after {
    @apply absolute;
    @apply left-0;
    @apply right-0;
    @apply top-0;
    @apply bg-transparent;
    @apply z-2;
    @apply h-0.5;
    content: "";
  }
  &:focus::after {
    @apply bg-divider;
  }
  &.active {
    @apply text-secondaryDark;
    @apply bg-primary;
    &::after {
      @apply bg-accent;
    }
  }
}
.tab-content {
  @apply p-4;
  @apply hidden;
  &.active {
    @apply flex;
  }
}
.close {
  @apply opacity-50;
  &.active {
    @apply opacity-100;
  }
}
</style>
