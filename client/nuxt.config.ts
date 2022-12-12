export default defineNuxtConfig({
  ssr: true,
  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss'],
  // Global CSS styles
  css: ['~/assets/css/main.pcss', '@fortawesome/fontawesome-svg-core/styles.css'],
  runtimeConfig: {
    // Keys within public are also exposed client-side
    public: {
      apiBase: process.env.API_BASE_URL || 'http://localhost:5000/api',
      // apiKey: process.env.API_KEY || '123',
    },
  },
  telemetry: false,
});
