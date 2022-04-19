import { BehaviorSubject } from "rxjs"
import ClientV2 from "socket.io-client-v2"
import { io as ClientV3 } from "socket.io-client-v3"
import { io as ClientV4 } from "socket.io-client-v4"
import wildcard from "socketio-wildcard"
import { logHoppRequestRunToAnalytics } from "../fb/analytics"
import { ClientVersion } from "~/newstore/SocketIOSession"

export const socketIoClients = {
  v4: ClientV4,
  v3: ClientV3,
  v2: ClientV2,
}

export type ConnectionOption = {
  url: string
  path: string
  clientVersion: ClientVersion
  bearerToken?: string
  authType?: "None" | "Bearer"
  authActive?: boolean
}

export type SIOEvent = { time: number } & (
  | { type: "CONNECTING"; manual: boolean }
  | { type: "CONNECTED"; manual: boolean }
  | { type: "MESSAGE_SENT"; message: string }
  | { type: "MESSAGE_RECEIVED"; message: string }
  | { type: "DISCONNECTED"; manual: boolean }
  | { type: "ERROR"; error: string }
)

export type ConnectionState = "CONNECTING" | "CONNECTED" | "DISCONNECTED"

export class SIOConnection {
  connectionState$: BehaviorSubject<ConnectionState>
  events$: BehaviorSubject<SIOEvent[]>
  io: any | undefined
  constructor() {
    this.connectionState$ = new BehaviorSubject<ConnectionState>("DISCONNECTED")
    this.events$ = new BehaviorSubject<SIOEvent[]>([])
  }

  private addEvent(event: SIOEvent) {
    this.events$.next([...this.events$.value, event])
  }

  connect({
    url,
    path,
    clientVersion,
    bearerToken,
    authType,
    authActive,
  }: ConnectionOption) {
    this.connectionState$.next("CONNECTING")
    this.addEvent({
      time: Date.now(),
      type: "CONNECTING",
      manual: false,
    })
    try {
      path = path || "/socket.io"
      // using any as temporary workaround for
      const Client: any = socketIoClients[clientVersion]
      if (authActive && authType === "Bearer") {
        this.io = new Client(url, {
          path,
          auth: {
            token: bearerToken,
          },
        })
      } else {
        this.io = new Client(url, { path })
      }

      // Add ability to listen to all events
      wildcard(Client.Manager)(this.io)

      this.io.on("connect", () => {
        this.connectionState$.next("CONNECTED")
        this.addEvent({
          type: "CONNECTED",
          time: Date.now(),
          manual: true,
        })
      })

      this.io.on("*", ({ data }: { data: string[] }) => {
        const [eventName, message] = data
        this.addEvent({
          message: `[${eventName}] ${message ? JSON.stringify(message) : ""}`,
          type: "MESSAGE_RECEIVED",
          time: Date.now(),
        })
      })

      this.io.on("connect_error", (error: any) => {
        this.handleError(error)
      })

      this.io.on("reconnect_error", (error: any) => {
        this.handleError(error)
      })

      this.io.on("error", (error: any) => {
        this.handleError(error)
      })

      this.io.on("disconnect", () => {
        this.connectionState$.next("DISCONNECTED")
        this.addEvent({
          type: "DISCONNECTED",
          time: Date.now(),
          manual: true,
        })
      })
    } catch (e) {
      this.handleError(e)
    }

    logHoppRequestRunToAnalytics({
      platform: "socketio",
    })
  }

  private handleError(error: any) {
    this.disconnect()
    this.addEvent({
      time: Date.now(),
      type: "ERROR",
      error,
    })
  }

  sendMessage(event: { message: string; eventName: string }) {
    if (this.connectionState$.value === "DISCONNECTED") return
    const { message, eventName } = event

    this.io?.emit(eventName, message, (data: object) => {
      // receive response from server
      this.addEvent({
        time: Date.now(),
        type: "MESSAGE_RECEIVED",
        message: `[${eventName}] ${JSON.stringify(data)}`,
      })
    })

    this.addEvent({
      time: Date.now(),
      type: "MESSAGE_SENT",
      message: `[${eventName}] ${JSON.stringify(message)}`,
    })
  }

  disconnect() {
    this.io?.close()
    this.connectionState$.next("DISCONNECTED")
  }
}
