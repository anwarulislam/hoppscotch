import { BehaviorSubject } from "rxjs"
import { logHoppRequestRunToAnalytics } from "../fb/analytics"

export type WSEvent = { time: number } & (
  | { type: "CONNECTION"; manual: boolean }
  | { type: "DISCONNECTION"; manual: boolean }
  | { type: "MESSAGE_SENT"; message: string }
  | { type: "MESSAGE_RECEIVED"; message: string }
  | { type: "ERROR"; error: string }
)

export default class WSConnection {
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
      this.socket.next(new WebSocket(url, protocols))

      this.socket.value.onopen = () => {
        this.connecting$.next(false)
        this.connection$.next(true)
        this.events$.next([
          {
            time: Date.now(),
            type: "CONNECTION",
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
            time: Date.now(),
            type: "DISCONNECTION",
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
        error: error.message,
      },
    ])
    if (error !== null)
      this.events$.next([
        {
          time: Date.now(),
          type: "ERROR",
          error: error.message,
        },
      ])
  }

  disconnect() {
    if (this.socket.value) {
      this.socket.value.close()
      this.connecting$.next(false)
      this.connection$.next(false)
    }
  }
}
