<template>
  <AppPaneLayout>
    <template #primary>
      <div
        class="sticky top-0 z-10 flex flex-shrink-0 p-4 overflow-x-auto space-x-2 bg-primary hide-scrollbar"
      >
        <div class="inline-flex flex-1 space-x-2">
          <div class="flex flex-1">
            <input
              id="server"
              v-model="server"
              type="url"
              autocomplete="off"
              :class="{ error: !isUrlValid }"
              class="flex flex-1 w-full px-4 py-2 border rounded-l bg-primaryLight border-divider text-secondaryDark"
              :placeholder="$t('sse.url')"
              :disabled="connectionSSEState"
              @keyup.enter="isUrlValid ? toggleSSEConnection() : null"
            />
            <label
              for="event-type"
              class="px-4 py-2 font-semibold truncate border-t border-b bg-primaryLight border-divider text-secondaryLight"
            >
              {{ $t("sse.event_type") }}
            </label>
            <input
              id="event-type"
              v-model="eventType"
              class="flex flex-1 w-full px-4 py-2 border rounded-r bg-primaryLight border-divider text-secondaryDark"
              spellcheck="false"
              :disabled="connectionSSEState"
              @keyup.enter="isUrlValid ? toggleSSEConnection() : null"
            />
          </div>
          <ButtonPrimary
            id="start"
            :disabled="!isUrlValid"
            name="start"
            class="w-32"
            :label="
              !connectionSSEState ? $t('action.start') : $t('action.stop')
            "
            :loading="connectingState"
            @click.native="toggleSSEConnection"
          />
        </div>
      </div>
    </template>
    <template #secondary>
      <RealtimeLog :title="$t('sse.log')" :log="log" />
    </template>
  </AppPaneLayout>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted, onMounted } from "@nuxtjs/composition-api"
import "splitpanes/dist/splitpanes.css"
import debounce from "lodash/debounce"
import { logHoppRequestRunToAnalytics } from "~/helpers/fb/analytics"
import {
  SSEEndpoint$,
  setSSEEndpoint,
  SSEEventType$,
  setSSEEventType,
  SSESocket$,
  setSSESocket,
  SSEConnectingState$,
  SSEConnectionState$,
  setSSEConnectionState,
  setSSEConnectingState,
  SSELog$,
  setSSELog,
  addSSELogLine,
} from "~/newstore/SSESession"
import {
  useNuxt,
  useStream,
  useToast,
  useI18n,
} from "~/helpers/utils/composables"

const t = useI18n()
const nuxt = useNuxt()
const toast = useToast()

const connectionSSEState = useStream(
  SSEConnectionState$,
  false,
  setSSEConnectionState
)
const connectingState = useStream(
  SSEConnectingState$,
  false,
  setSSEConnectingState
)
const server = useStream(SSEEndpoint$, "", setSSEEndpoint)
const eventType = useStream(SSEEventType$, "", setSSEEventType)
const sse = useStream(SSESocket$, null, setSSESocket)
const log = useStream(SSELog$, [], setSSELog)

const isUrlValid = ref(true)

let worker: Worker

const debouncer = debounce(function () {
  worker.postMessage({ type: "sse", url: server.value })
}, 1000)

watch(server, (url) => {
  if (url) debouncer()
})

const workerResponseHandler = ({
  data,
}: {
  data: { url: string; result: boolean }
}) => {
  if (data.url === server.value) isUrlValid.value = data.result
}

onMounted(() => {
  worker = nuxt.value.$worker.createRejexWorker()
  worker.addEventListener("message", workerResponseHandler)
})

// METHODS

const toggleSSEConnection = () => {
  // If it is connecting:
  if (!connectionSSEState.value) return start()
  // Otherwise, it's disconnecting.
  else return stop()
}
const start = () => {
  connectingState.value = true
  log.value = [
    {
      payload: t("state.connecting_to", { name: server.value }) as string,
      source: "info",
      color: "var(--accent-color)",
      ts: "",
    },
  ]
  if (typeof EventSource !== "undefined") {
    try {
      sse.value = new EventSource(server.value)
      sse.value.onopen = () => {
        connectingState.value = false
        connectionSSEState.value = true
        log.value = [
          {
            payload: t("state.connected_to", { name: server.value }) as string,
            source: "info",
            color: "var(--accent-color)",
            ts: new Date().toLocaleTimeString(),
          },
        ]
        toast.success(t("state.connected") as string)
      }
      sse.value.onerror = handleSSEError
      sse.value.addEventListener(eventType.value, ({ data }) => {
        addSSELogLine({
          payload: data,
          source: "server",
          ts: new Date().toLocaleTimeString(),
        })
      })
    } catch (e) {
      handleSSEError(e)
      toast.error(t("error.something_went_wrong") as string)
    }
  } else {
    log.value = [
      {
        payload: t("error.browser_support_sse") as string,
        source: "info",
        color: "#ff5555",
        ts: new Date().toLocaleTimeString(),
      },
    ]
  }

  logHoppRequestRunToAnalytics({
    platform: "sse",
  })
}
const handleSSEError = (error: any) => {
  stop()
  connectionSSEState.value = false
  addSSELogLine({
    payload: t("error.something_went_wrong") as string,
    source: "info",
    color: "#ff5555",
    ts: new Date().toLocaleTimeString(),
  })
  if (error !== null)
    addSSELogLine({
      payload: error,
      source: "info",
      color: "#ff5555",
      ts: new Date().toLocaleTimeString(),
    })
}
const stop = () => {
  sse.value?.close()
}

onUnmounted(() => {
  worker.terminate()
})
</script>
