// https://nuxt.com/docs/api/configuration/nuxt-config
const appName = "Ivy's Recipes"
const adsensePublisherId = '6658400101081479'

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
      appUrl: 'https://ivys-recipes.andyevans.dev',
      appDescription: "Ivy's Recipes — simple, delicious recipes for every occasion.",
      appImage: 'https://ivys-recipes.andyevans.dev/og-image.png',
      adsensePublisherId: adsensePublisherId,
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
      // AdSense loader — present in all environments.
      // Google won't serve real ads on localhost, but the containers will render.
      script: [
        {
          src: `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${adsensePublisherId}`,
          async: true,
          crossorigin: 'anonymous',
        }
      ],
      htmlAttrs: {
        lang: 'en'
      }
    }
  },
  site: {
    url: 'https://ivys-recipes.andyevans.dev',
    name: appName,
    trailingSlash: false
  },
  experimental: {
    payloadExtraction: false
  }
})
