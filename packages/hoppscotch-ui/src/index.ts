import { Plugin } from "vue"
import * as components from "./components/"

const HoppUI = { ...components }

// Hopp UI will be available globally when in a browser environment
if (typeof window !== "undefined") {
  ;(window as any)["HoppUI"] = HoppUI
}

import "virtual:windi.css"
import "./assets/scss/styles.scss"

const plugin: Plugin = {
  install(app, options = {}) {
    for (const key in components) {
      // @ts-expect-error
      app.component(key, components[key])
    }
  },
}

export default plugin

export * from "./components/"