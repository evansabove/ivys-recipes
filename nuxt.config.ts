// https://nuxt.com/docs/api/configuration/nuxt-config
const appName = "Ivy's Recipes"

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/content', '@nuxtjs/tailwindcss', '@nuxtjs/sitemap', '@nuxt/icon', 'dayjs-nuxt', 'nuxt-seo-utils'],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      appName: appName,
      appUrl: 'https://ivys-recipes.net',
      appDescription: "Ivy's Recipes — simple, delicious recipes for every occasion. 100% ad-free and cookie-free.",
      appImage: 'https://ivys-recipes.net/og-image.png',
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
        // Declared here so nuxt-seo-utils doesn't auto-inject og-image.png's
        // width/height/type, which would leak onto pages with their own image
        { property: 'og:image', content: 'https://ivys-recipes.net/og-image.png' },
        { name: 'twitter:image', content: 'https://ivys-recipes.net/og-image.png' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon.png' },
      ],
      script: [],
      htmlAttrs: {
        lang: 'en-GB'
      }
    }
  },
  site: {
    url: 'https://ivys-recipes.net',
    name: appName,
    defaultLocale: 'en-GB',
    trailingSlash: true
  },
  experimental: {
    payloadExtraction: false,
    // Match the trailing-slash canonical URLs so internal links don't point at duplicates
    defaults: {
      nuxtLink: {
        trailingSlash: 'append'
      }
    }
  }
})
