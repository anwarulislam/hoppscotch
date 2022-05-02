<template>
  <AppPaneLayout>
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
            :placeholder="$t('mqtt.url')"
            :disabled="connectionState"
            @keyup.enter="isUrlValid ? toggleConnection() : null"
          />
          <ButtonPrimary
            id="connect"
            :disabled="!isUrlValid"
            class="w-32"
            :label="
              connectionState ? $t('action.disconnect') : $t('action.connect')
            "
            :loading="connectingState"
            @click.native="toggleConnection"
          />
        </div>
        <div class="flex space-x-4">
          <input
            id="mqtt-username"
            v-model="username"
            type="text"
            spellcheck="false"
            class="input"
            :placeholder="$t('authorization.username')"
          />
          <input
            id="mqtt-password"
            v-model="password"
            type="password"
            spellcheck="false"
            class="input"
            :placeholder="$t('authorization.password')"
          />
        </div>
      </div>
    </template>
    <template #secondary>
      <RealtimeLog :title="$t('mqtt.log')" :log="log" />
    </template>
    <template #sidebar>
      <div class="flex items-center justify-between p-4">
        <label for="pubTopic" class="font-semibold text-secondaryLight">
          {{ $t("mqtt.topic") }}
        </label>
      </div>
      <div class="flex px-4">
        <input
          id="pubTopic"
          v-model="pubTopic"
          class="input"
          :placeholder="$t('mqtt.topic_name')"
          type="text"
          autocomplete="off"
          spellcheck="false"
        />
      </div>
      <div class="flex items-center justify-between p-4">
        <label for="mqtt-message" class="font-semibold text-secondaryLight">
          {{ $t("mqtt.communication") }}
        </label>
      </div>
      <div class="flex px-4 space-x-2">
        <input
          id="mqtt-message"
          v-model="msg"
          class="input"
          type="text"
          autocomplete="off"
          :placeholder="$t('mqtt.message')"
          spellcheck="false"
        />
        <ButtonPrimary
          id="publish"
          name="get"
          :disabled="!canpublish"
          :label="$t('mqtt.publish')"
          @click.native="publish"
        />
      </div>
      <div
        class="flex items-center justify-between p-4 mt-4 border-t border-dividerLight"
      >
        <label for="subTopic" class="font-semibold text-secondaryLight">
          {{ $t("mqtt.topic") }}
        </label>
      </div>
      <div class="flex px-4 space-x-2">
        <input
          id="subTopic"
          v-model="subTopic"
          type="text"
          autocomplete="off"
          :placeholder="$t('mqtt.topic_name')"
          spellcheck="false"
          class="input"
        />
        <ButtonPrimary
          id="subscribe"
          name="get"
          :disabled="!cansubscribe"
          :label="
            subscriptionState ? $t('mqtt.unsubscribe') : $t('mqtt.subscribe')
          "
          reverse
          @click.native="toggleSubscription"
        />
      </div>
    </template>
  </AppPaneLayout>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  watch,
  onUnmounted,
  onMounted,
} from "@nuxtjs/composition-api"
import Paho, { ConnectionOptions } from "paho-mqtt"
import debounce from "lodash/debounce"
import { logHoppRequestRunToAnalytics } from "~/helpers/fb/analytics"
import {
  MQTTEndpoint$,
  setMQTTEndpoint,
  MQTTConnectingState$,
  MQTTConnectionState$,
  setMQTTConnectingState,
  setMQTTConnectionState,
  MQTTSubscriptionState$,
  setMQTTSubscriptionState,
  MQTTSocket$,
  setMQTTSocket,
  MQTTLog$,
  setMQTTLog,
  addMQTTLogLine,
} from "~/newstore/MQTTSession"
import {
  useI18n,
  useNuxt,
  useStream,
  useToast,
} from "~/helpers/utils/composables"

const t = useI18n()
const nuxt = useNuxt()
const toast = useToast()

const url = useStream(MQTTEndpoint$, "", setMQTTEndpoint)
const connectionState = useStream(
  MQTTConnectionState$,
  false,
  setMQTTConnectionState
)
const connectingState = useStream(
  MQTTConnectingState$,
  false,
  setMQTTConnectingState
)
const subscriptionState = useStream(
  MQTTSubscriptionState$,
  false,
  setMQTTSubscriptionState
)
const log = useStream(MQTTLog$, [], setMQTTLog)
const client = useStream(MQTTSocket$, null, setMQTTSocket)

const isUrlValid = ref(true)
const pubTopic = ref("")
const subTopic = ref("")
const msg = ref("")
const manualDisconnect = ref(false)
const username = ref("")
const password = ref("")

let worker: Worker

const canpublish = computed(
  () => pubTopic.value !== "" && msg.value !== "" && connectionState.value
)
const cansubscribe = computed(
  () => subTopic.value !== "" && connectionState.value
)

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

const connect = () => {
  connectingState.value = true
  log.value = [
    {
      payload: t("state.connecting_to", { name: url.value }) as string,
      source: "info",
      color: "var(--accent-color)",
      ts: new Date().toLocaleTimeString(),
    },
  ]
  const parseUrl = new URL(url.value)
  client.value = new Paho.Client(
    `${parseUrl.hostname}${parseUrl.pathname !== "/" ? parseUrl.pathname : ""}`,
    parseUrl.port !== "" ? Number(parseUrl.port) : 8081,
    "hoppscotch"
  )
  const connectOptions: ConnectionOptions = {
    onSuccess: onConnectionSuccess,
    onFailure: onConnectionFailure,
    useSSL: parseUrl.protocol !== "ws:",
  }
  if (username.value !== "") {
    connectOptions.userName = username.value
  }
  if (password.value !== "") {
    connectOptions.password = password.value
  }
  client.value.connect(connectOptions)
  client.value.onConnectionLost = onConnectionLost
  client.value.onMessageArrived = onMessageArrived

  logHoppRequestRunToAnalytics({
    platform: "mqtt",
  })
}
const onConnectionFailure = () => {
  connectingState.value = false
  connectionState.value = false
  addMQTTLogLine({
    payload: t("error.something_went_wrong") as string,
    source: "info",
    color: "#ff5555",
    ts: new Date().toLocaleTimeString(),
  })
}
const onConnectionSuccess = () => {
  connectingState.value = false
  connectionState.value = true
  addMQTTLogLine({
    payload: t("state.connected_to", { name: url.value }) as string,
    source: "info",
    color: "var(--accent-color)",
    ts: new Date().toLocaleTimeString(),
  })
  toast.success(t("state.connected") as string)
}
const onMessageArrived = (data: {
  payloadString: string
  destinationName: string
}) => {
  const { payloadString, destinationName } = data
  addMQTTLogLine({
    payload: `Message: ${payloadString} arrived on topic: ${destinationName}`,
    source: "info",
    color: "var(--accent-color)",
    ts: new Date().toLocaleTimeString(),
  })
}
const toggleConnection = () => {
  if (connectionState.value) {
    disconnect()
  } else {
    connect()
  }
}
const disconnect = () => {
  manualDisconnect.value = true
  client.value?.disconnect()
  addMQTTLogLine({
    payload: t("state.disconnected_from", { name: url.value }) as string,
    source: "info",
    color: "#ff5555",
    ts: new Date().toLocaleTimeString(),
  })
}
const onConnectionLost = () => {
  connectingState.value = false
  connectionState.value = false
  if (manualDisconnect.value) {
    toast.error(t("state.disconnected") as string)
  } else {
    toast.error(t("error.something_went_wrong") as string)
  }
  manualDisconnect.value = false
  subscriptionState.value = false
}
const publish = () => {
  try {
    // it was publish
    client.value?.send(pubTopic.value, msg.value, 0, false)
    addMQTTLogLine({
      payload: `Published message: ${msg.value} to topic: ${pubTopic.value}`,
      ts: new Date().toLocaleTimeString(),
      source: "info",
      color: "var(--accent-color)",
    })
  } catch (e) {
    addMQTTLogLine({
      payload:
        t("error.something_went_wrong") +
        `while publishing msg: ${msg.value} to topic:  ${pubTopic.value}`,
      source: "info",
      color: "#ff5555",
      ts: new Date().toLocaleTimeString(),
    })
  }
}
const toggleSubscription = () => {
  if (subscriptionState.value) {
    unsubscribe()
  } else {
    subscribe()
  }
}
const subscribe = () => {
  try {
    client.value?.subscribe(subTopic.value, {
      onSuccess: usubSuccess,
      onFailure: usubFailure,
    })
  } catch (e) {
    addMQTTLogLine({
      payload:
        t("error.something_went_wrong") +
        `while subscribing to topic:  ${subTopic.value}`,
      source: "info",
      color: "#ff5555",
      ts: new Date().toLocaleTimeString(),
    })
  }
}
const usubSuccess = () => {
  subscriptionState.value = !subscriptionState.value
  addMQTTLogLine({
    payload:
      `Successfully ` +
      (subscriptionState.value ? "subscribed" : "unsubscribed") +
      ` to topic: ${subTopic.value}`,
    source: "info",
    color: "var(--accent-color)",
    ts: new Date().toLocaleTimeString(),
  })
}
const usubFailure = () => {
  addMQTTLogLine({
    payload:
      `Failed to ` +
      (subscriptionState.value ? "unsubscribe" : "subscribe") +
      ` to topic: ${subTopic.value}`,
    source: "info",
    color: "#ff5555",
    ts: new Date().toLocaleTimeString(),
  })
}
const unsubscribe = () => {
  client.value?.unsubscribe(subTopic.value, {
    onSuccess: usubSuccess,
    onFailure: usubFailure,
  })
}
</script>
