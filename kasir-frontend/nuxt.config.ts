// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
  tailwindcss: {
    config: {
      content: ["./app/**/*.{js,vue,ts}"]
    }
  },
  runtimeConfig: {
    public: {
      apiBase: 'http://192.168.43.183:5000/api'
    }
  }
})