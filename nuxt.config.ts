const isDev = process.env.NODE_ENV === "development";

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
    public: { isDev },
    jwpubKey: process.env.JWPUB_KEY,
  },
  compatibilityDate: "2026-01-15",
  piniaPluginPersistedstate: {
    storage: "localStorage",
    debug: true,
  },
});
