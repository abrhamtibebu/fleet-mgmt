// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/image',
    '@nuxt/icon',
    '@nuxt/fonts',
  ],
  css: [
    'vuetify/lib/styles/main.sass',
    '@mdi/font/css/materialdesignicons.min.css',
  ],
  build: {
    transpile: ['vuetify'],
  },
  vite: {
    define: {
      'process.env.DEBUG': false,
    },
  },
  app: {
    head: {
      title: 'Fleet Management System',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'WebSprix Fleet Management System' },
        { name: 'theme-color', content: '#FFD700' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/WS yellow logo-16.png' },
        { rel: 'apple-touch-icon', href: '/WS yellow logo-16.png' },
      ],
    },
  },
  runtimeConfig: {
    public: {
      baseURL: process.env.BASE_API_URL || 'http://localhost:3000',
      authURL: process.env.AUTH_URL || 'http://localhost:3000'
    },
  },
})