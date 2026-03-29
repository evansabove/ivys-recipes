// https://nuxt.com/docs/api/configuration/nuxt-config
const appName = "Ivy's Recipes"

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/content', '@nuxtjs/tailwindcss', '@nuxt/fonts', '@nuxtjs/sitemap', '@nuxt/icon', 'dayjs-nuxt', 'nuxt-seo-utils'],
  fonts: {
    families: [{ name: 'Nunito', provider: 'google', display: 'swap' }]
  },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      appName: appName,
      appUrl: 'https://food.andyevans.dev',
      appDescription: "Ivy's Recipes — simple, delicious recipes for every occasion.",
      appImage: 'https://food.andyevans.dev/og-image.png',
    }
  },
  ssr: true,
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/']
    }
  },
  content: {},
  app: {
    head: {
      title: appName,
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon.png' },
      ],
      htmlAttrs: {
        lang: 'en'
      }
    }
  },
  site: {
    url: 'https://food.andyevans.dev',
    name: appName,
    trailingSlash: false
  },
  experimental: {
    payloadExtraction: false
  }
})
