export default defineNuxtConfig({
  compatibilityDate: '2026-05-11',
  devtools: {
    enabled: false,
  },
  future: {
    compatibilityVersion: 4,
  },
  modules: ['@pinia/nuxt'],
  css: ['~/assets/styles/main.css'],
  typescript: {
    typeCheck: true,
  },
})
