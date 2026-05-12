// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  tailwindcss: {
    config: {
      content: [
        "./app/**/*.{js,vue,ts}" // Menyuruh Tailwind memeriksa semua file di dalam folder app
      ]
    }
  }
})