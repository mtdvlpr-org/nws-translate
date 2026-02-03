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
  compatibilityDate: "2026-01-15",
  piniaPluginPersistedstate: {
    storage: "localStorage",
    debug: true,
  },
});
