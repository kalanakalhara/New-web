// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2026-03-25',
  devtools: { enabled: true },

  modules: ['@nuxtjs/tailwindcss'],

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      // Overridden by NUXT_PUBLIC_API_BASE in .env
      apiBase: 'http://localhost/newapp/api'
    }
  }
})