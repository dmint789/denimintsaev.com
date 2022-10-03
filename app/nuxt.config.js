export default {
  target: 'server',
  // SSR is true by default anyways
  ssr: true,
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'denimintsaev',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['@/assets/css/main.css'],
  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],
  components: true,
  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: ['@nuxt/typescript-build', '@nuxtjs/tailwindcss'],
  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
  ],
  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    // Base URL for making requests as server (SSR). API_URL env variable overrides this.
    baseURL: 'http://localhost:5000',
    // Base URL for making requests as client (if unset defaults to the value of baseURL). API_URL_BROWSER overrides this.
    //browserBaseURL: 'http://localhost:5000',
    retry: {
      retries: 2,
    },
  },
  router: {
    extendRoutes(routes, resolve) {
      routes.push({
        name: 'kanjiSorter',
        path: '/kanjisorter',
        component: resolve(__dirname, 'pages/projects/kanjiSorter.vue'),
      });
    },
  },
  serverMiddleware: [{ path: '/api', handler: '~/server' }],
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    postcss: {
      plugins: {
        tailwindcss: {},
        autoprefixer: {},
        'postcss-import': {},
      },
    },
  },
  telemetry: false,
};
