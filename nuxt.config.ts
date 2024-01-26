// https://nuxt.com/docs/api/configuration/nuxt-config
// @ts-ignore

export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },
  typescript: {
    shim: false,
  },
  runtimeConfig: {
    // The private keys which are only available within server-side
    apiSecret: '123',
    // Keys within public, will be also exposed to the client-side
    public: {
      apiBase: process.env.BASE_API_URL,
    },
  },
  css: ['vue-final-modal/style.css'],
  build: {
    //   extractCSS: false,
    transpile: ['vuetify'],
  },
  modules: ['@pinia/nuxt', '@nuxt/devtools', '@nuxtjs/tailwindcss', '@sidebase/nuxt-auth'],
  plugins: [
    '@/plugins/axios',
    '@/plugins/api',
    '@/plugins/vue-final-modal',
    '@/plugins/vue-query',
    '@/plugins/vue-money',
  ],
  auth: {
    origin: process.env.ORIGIN,
    enableGlobalAppMiddleware: false,
    enableSessionRefreshPeriodically: false,
    enableSessionRefreshOnWindowFocus: true,
  },
  app: {
    head: {
      title: 'Zola',
    },
  },
  nitro: {
    serveStatic: true,
  },
  devServerHandlers: [],
  vuetify: {
    /* vuetify options */
    vuetifyOptions: {
      // @TODO: list all vuetify options
    },

    moduleOptions: {
      styles: {
        configFile: '~/assets/scss/_variables.scss',
      },
    },
  },
})
