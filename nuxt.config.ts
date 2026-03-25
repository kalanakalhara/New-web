// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2026-03-25',
  devtools: { enabled: true },

  modules: ['@nuxtjs/tailwindcss'],

  css: ['~/assets/css/main.css'],
})