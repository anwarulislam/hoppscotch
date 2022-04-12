import { Ref } from "@nuxtjs/composition-api"
import { NuxtApp } from "@nuxt/types/app"
import { debounce } from "lodash"
import { BehaviorSubject } from "rxjs"
import { logHoppRequestRunToAnalytics } from "../fb/analytics"
import { useStream } from "../utils/composables"
import {
  addWSLogLine,
  addWSProtocol,
  deleteWSProtocol,
  setWSLog,
  setWSProtocols,
  setWSSocket,
  updateWSProtocol,
  WSLog$,
  WSProtocols$,
  WSSocket$,
} from "~/newstore/WebSocketSession"

export default class WSSessionAdapter {
  error$: BehaviorSubject<string | null>
  connecting$: BehaviorSubject<boolean>
  connection$: BehaviorSubject<boolean>
  urlValid$: BehaviorSubject<boolean>

  socket: Ref<WebSocket>
  worker!: Worker

  log = useStream(WSLog$, [], setWSLog)
  protocols = useStream(WSProtocols$, [], setWSProtocols)

  toast: any
  t: any

  constructor(nuxt: NuxtApp, toast: any, t: any) {
    this.toast = toast
    this.t = t
    this.error$ = new BehaviorSubject<string | null>(null)
    this.connecting$ = new BehaviorSubject<boolean>(false)
    this.connection$ = new BehaviorSubject<boolean>(false)
    this.urlValid$ = new BehaviorSubject<boolean>(true)

    this.socket = useStream(WSSocket$, null, setWSSocket) as Ref<WebSocket>

    if (process.browser) {
      this.worker = nuxt.$worker.createRejexWorker()
      this.worker.addEventListener("message", this.workerResponseHandler)
    }
  }

  addProtocol() {
    addWSProtocol({ value: "", active: true })
  }

  get activeProtocols() {
    return this.protocols.value
      .filter((item) =>
        Object.prototype.hasOwnProperty.call(item, "active")
          ? item.active === true
          : true
      )
      .map(({ value }) => value)
  }

  deleteProtocol(index: number) {
    const oldProtocols = this.protocols.value.slice()
    deleteWSProtocol(index)
    this.toast.success(`${this.t("state.deleted")}`, {
      duration: 4000,
      action: {
        text: `${this.t("action.undo")}`,
        onClick: (_: any, toastObject: { goAway: () => void }) => {
          this.protocols.value = oldProtocols
          toastObject.goAway()
        },
      },
    })
  }

  updateProtocol(index: number, updated: any) {
    updateWSProtocol(index, updated)
  }

  workerResponseHandler = ({
    data,
  }: {
    data: { url: string; result: boolean }
  }) => {
    this.urlValid$.next(data.result)
  }

  connect(url: string) {
    this.log.value = [
      {
        payload: `${this.t("state.connecting_to", { name: url })}`,
        source: "info",
        color: "var(--accent-color)",
        ts: "",
      },
    ]
    try {
      this.connecting$.next(true)
      this.socket.value = new WebSocket(url, this.activeProtocols)

      this.socket.value.onopen = () => {
        this.connecting$.next(false)
        this.connection$.next(true)
        this.log.value = [
          {
            payload: `${this.t("state.connected_to", { name: url })}`,
            source: "info",
            color: "var(--accent-color)",
            ts: new Date().toLocaleTimeString(),
          },
        ]
        this.toast.success(this.t("state.connected") as string)
      }

      this.socket.value.onerror = (error) => {
        this.handleError(error)
      }

      this.socket.value.onclose = () => {
        this.connection$.next(false)
        addWSLogLine({
          payload: this.t("state.disconnected_from", { name: url }) as string,
          source: "info",
          color: "#ff5555",
          ts: new Date().toLocaleTimeString(),
        })
        this.toast.error(this.t("state.disconnected") as string)
      }

      this.socket.value.onmessage = ({ data }) => {
        addWSLogLine({
          payload: data,
          source: "server",
          ts: new Date().toLocaleTimeString(),
        })
      }
    } catch (e) {
      this.handleError(e)
      this.toast.error(this.t("error.something_went_wrong") as string)
    }

    logHoppRequestRunToAnalytics({
      platform: "wss",
    })
  }

  sendMessage = (event: { message: string; eventName: string }) => {
    if (!this.connection$.value) return
    const { message } = event
    this.socket.value.send(message)
    addWSLogLine({
      payload: message,
      source: "client",
      ts: new Date().toLocaleTimeString(),
    })
  }

  debouncer(url: string) {
    debounce(() => {
      this.worker.postMessage({ type: "ws", url })
    }, 1000)
  }

  terminate() {
    if (this.worker) this.worker.terminate()
  }

  private handleError(error: any) {
    this.disconnect()
    addWSLogLine({
      payload: `${this.t("error.something_went_wrong")}`,
      source: "info",
      color: "#ff5555",
      ts: new Date().toLocaleTimeString(),
    })
    if (error !== null)
      addWSLogLine({
        payload: error,
        source: "info",
        color: "#ff5555",
        ts: new Date().toLocaleTimeString(),
      })
  }

  disconnect() {
    if (this.socket.value) {
      this.socket.value.close()
      this.connecting$.next(false)
      this.connection$.next(false)
    }
  }
}
