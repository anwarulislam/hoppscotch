import { defineConfig, loadEnv, normalizePath } from "vite"
import { APP_INFO, META_TAGS } from "./meta"
import { viteStaticCopy as StaticCopy } from "vite-plugin-static-copy"
import generateSitemap from "vite-plugin-pages-sitemap"
import HtmlConfig from "vite-plugin-html-config"
import Vue from "@vitejs/plugin-vue"
import VueI18n from "@intlify/vite-plugin-vue-i18n"
import Components from "unplugin-vue-components/vite"
import Icons from "unplugin-icons/vite"
import Inspect from "vite-plugin-inspect"
import WindiCSS from "vite-plugin-windicss"
import { VitePWA } from "vite-plugin-pwa"
import Pages from "vite-plugin-pages"
import Layouts from "vite-plugin-vue-layouts"
import IconResolver from "unplugin-icons/resolver"
import { FileSystemIconLoader } from "unplugin-icons/loaders"
import * as path from "path"
import { VitePluginFonts } from "vite-plugin-fonts"
import legacy from "@vitejs/plugin-legacy"

const ENV = loadEnv("development", path.resolve(__dirname, "../../"))

export default defineConfig({
  envDir: path.resolve(__dirname, "../../"),
  // TODO: Migrate @hoppscotch/data to full ESM
  define: {
    // For 'util' polyfill required by dep of '@apidevtools/swagger-parser'
    "process.env": {},
  },
  server: {
    port: 3000,
  },
  preview: {
    port: 3000,
  },
  publicDir: path.resolve(__dirname, "../hoppscotch-common/public"),
  build: {
    sourcemap: true,
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      // TODO: Maybe leave ~ only for individual apps and not use on common
      "~": path.resolve(__dirname, "../hoppscotch-common/src"),
      "@hoppscotch/common": "@hoppscotch/common/src",
      "@composables": path.resolve(
        __dirname,
        "../hoppscotch-common/src/composables"
      ),
      "@modules": path.resolve(__dirname, "../hoppscotch-common/src/modules"),
      "@components": path.resolve(
        __dirname,
        "../hoppscotch-common/src/components"
      ),
      "@helpers": path.resolve(__dirname, "../hoppscotch-common/src/helpers"),
      "@functional": path.resolve(
        __dirname,
        "../hoppscotch-common/src/helpers/functional"
      ),
      "@workers": path.resolve(__dirname, "../hoppscotch-common/src/workers"),

      stream: "stream-browserify",
      util: "util",
    },
    dedupe: ["vue"],
  },
  plugins: [
    Inspect(), // go to url -> /__inspect
    HtmlConfig({
      metas: META_TAGS(ENV),
    }),
    Vue(),
    Pages({
      routeStyle: "nuxt",
      dirs: "../hoppscotch-common/src/pages",
      importMode: "async",
      onRoutesGenerated(routes) {
        // HACK: See: https://github.com/jbaubree/vite-plugin-pages-sitemap/issues/173
        return ((generateSitemap as any).default as typeof generateSitemap)({
          routes,
          nuxtStyle: true,
          allowRobots: true,
          dest: ".sitemap-gen",
          hostname: ENV.VITE_BASE_URL,
        })
      },
    }),
    StaticCopy({
      targets: [
        {
          src: normalizePath(path.resolve(__dirname, "./.sitemap-gen/*")),
          dest: normalizePath(path.resolve(__dirname, "./dist")),
        },
      ],
    }),
    Layouts({
      layoutsDirs: "../hoppscotch-common/src/layouts",
      defaultLayout: "default",
    }),
    VueI18n({
      runtimeOnly: false,
      compositionOnly: true,
      include: [path.resolve(__dirname, "locales")],
    }),
    WindiCSS({
      root: path.resolve(__dirname, "../hoppscotch-common"),
    }),
    Components({
      dts: "../hoppscotch-common/src/components.d.ts",
      dirs: ["../hoppscotch-common/src/components"],
      directoryAsNamespace: true,
      resolvers: [
        IconResolver({
          prefix: "icon",
          customCollections: ["hopp", "auth", "brands"],
        }),
        (compName) => {
          if (compName.startsWith("Hopp"))
            return { name: compName, from: "@hoppscotch/ui/components" }
        },
      ],
      types: [
        {
          from: "vue-tippy",
          names: ["Tippy"],
        },
      ],
    }),
    Icons({
      compiler: "vue3",
      customCollections: {
        hopp: FileSystemIconLoader("../hoppscotch-common/assets/icons"),
        auth: FileSystemIconLoader("../hoppscotch-common/assets/icons/auth"),
        brands: FileSystemIconLoader(
          "../hoppscotch-common/assets/icons/brands"
        ),
      },
    }),
    VitePWA({
      manifest: {
        name: APP_INFO.name,
        short_name: APP_INFO.name,
        description: APP_INFO.shortDescription,
        start_url: "/?source=pwa",
        background_color: APP_INFO.app.background,
        theme_color: APP_INFO.app.background,
        icons: [
          {
            src: "/icon.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/logo.svg",
            sizes: "48x48 72x72 96x96 128x128 256x256 512x512",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
        ],
      },
      registerType: "prompt",
      workbox: {
        cleanupOutdatedCaches: true,
        maximumFileSizeToCacheInBytes: 4194304,
        navigateFallbackDenylist: [
          /robots.txt/,
          /sitemap.xml/,
          /discord/,
          /telegram/,
          /beta/,
          /careers/,
          /newsletter/,
          /twitter/,
          /github/,
          /announcements/,
        ],
      },
    }),
    VitePluginFonts({
      google: {
        families: [
          "Inter:wght@400;500;600;700;800",
          "Roboto+Mono:wght@400;500",
          "Material+Icons",
        ],
      },
    }),
    legacy({
      modernPolyfills: ["es.string.replace-all"],
      renderLegacyChunks: false,
    }),
  ],
})
