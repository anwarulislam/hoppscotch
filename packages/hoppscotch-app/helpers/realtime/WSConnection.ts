import { BehaviorSubject } from "rxjs"
import { logHoppRequestRunToAnalytics } from "../fb/analytics"

export type WSEvent = { time: number } & (
  | { type: "CONNECTING"; manual: boolean }
  | { type: "CONNECTED"; manual: boolean }
  | { type: "MESSAGE_SENT"; message: string }
  | { type: "MESSAGE_RECEIVED"; message: string }
  | { type: "DISCONNECTED"; manual: boolean }
  | { type: "ERROR"; error: string }
)

export class WebSocketConnection {
  connecting$: BehaviorSubject<boolean>
  connection$: BehaviorSubject<boolean>

  socket!: BehaviorSubject<WebSocket>

  events$: BehaviorSubject<WSEvent[]>

  constructor() {
    this.connecting$ = new BehaviorSubject<boolean>(false)
    this.connection$ = new BehaviorSubject<boolean>(false)
    this.events$ = new BehaviorSubject<WSEvent[]>([])
  }

  connect(url: string, protocols: string[]) {
    try {
      this.connecting$.next(true)
      this.socket = new BehaviorSubject<WebSocket>(
        new WebSocket(url, protocols)
      )

      this.socket.value.onopen = () => {
        this.connecting$.next(false)
        this.connection$.next(true)
        this.events$.next([
          {
            type: "CONNECTED",
            time: Date.now(),
            manual: true,
          },
        ])
      }

      this.socket.value.onerror = (error) => {
        this.handleError(error)
      }

      this.socket.value.onclose = () => {
        this.connection$.next(false)
        this.events$.next([
          {
            type: "DISCONNECTED",
            time: Date.now(),
            manual: true,
          },
        ])
      }

      this.socket.value.onmessage = ({ data }) => {
        this.events$.next([
          {
            time: Date.now(),
            type: "MESSAGE_RECEIVED",
            message: data,
          },
        ])
      }
    } catch (e) {
      this.handleError(e)
    }

    logHoppRequestRunToAnalytics({
      platform: "wss",
    })
  }

  private handleError(error: any) {
    this.disconnect()
    this.events$.next([
      {
        time: Date.now(),
        type: "ERROR",
        error,
      },
    ])
  }

  sendMessage(event: { message: string; eventName: string }) {
    if (!this.connection$.value) return
    const { message } = event
    this.socket.value?.send(message)
    this.events$.next([
      {
        time: Date.now(),
        type: "MESSAGE_SENT",
        message,
      },
    ])
  }

  disconnect() {
    if (this.socket?.value) {
      this.socket.value.close()
      this.connecting$.next(false)
      this.connection$.next(false)
    }
  }
}
