import { join } from "node:path";
import { normalizePath } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

/* eslint-disable perfectionist/sort-objects */
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  modules: [
    "@nuxt/eslint",
    "@nuxt/ui",
    "@pinia/nuxt",
    "@vueuse/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "@nuxt/test-utils",
  ],
  css: ["~/assets/css/main.css"],
  runtimeConfig: {
    jwpubKey: process.env.JWPUB_KEY,
  },
  compatibilityDate: "2026-01-15",
  piniaPluginPersistedstate: {
    storage: "localStorage",
    debug: true,
  },
  vite: {
    plugins: [
      viteStaticCopy({
        targets: [
          {
            src: normalizePath(
              join(__dirname, "node_modules/sql.js/dist/sql-wasm.wasm"),
            ),
            dest: normalizePath(join(__dirname, "public")),
          },
        ],
      }),
    ],
  },
});
