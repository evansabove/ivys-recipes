// https://nuxt.com/docs/api/configuration/nuxt-config
const appName = "Ivy's Recipes"
const adsensePublisherId = '6658400101081479'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/content', '@nuxtjs/tailwindcss', '@nuxtjs/sitemap', '@nuxt/icon', 'dayjs-nuxt', 'nuxt-seo-utils'],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      appName: appName,
      appUrl: 'https://ivys-recipes.net',
      appDescription: "Ivy's Recipes — simple, delicious recipes for every occasion.",
      appImage: 'https://ivys-recipes.net/og-image.png',
      adsensePublisherId: adsensePublisherId,
      adsEnabled: false, // ← flip to true once approved by AdSense
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
      // AdSense loader — only injected when adsEnabled is true.
      script: [],
      // To re-enable ads: set adsEnabled to true in runtimeConfig above.
      htmlAttrs: {
        lang: 'en'
      }
    }
  },
  site: {
    url: 'https://ivys-recipes.net',
    name: appName,
    trailingSlash: true
  },
  experimental: {
    payloadExtraction: false
  }
})
