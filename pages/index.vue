<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()

const { data: recentRecipes } = await useAsyncData('home-recent-recipes', () => {
  const query = queryCollection('recipes').order('date', 'DESC').limit(6)
  if (!import.meta.dev) query.where('draft', '<>', true)
  return query.all()
})

useHead({
  titleTemplate: () => `Ivy's Recipes`,
})

useSeoMeta({
  ogTitle: "Ivy's Recipes",
  description: runtimeConfig.public.appDescription,
  ogDescription: runtimeConfig.public.appDescription,
  ogLocale: 'en_GB',
  ogImage: runtimeConfig.public.appImage,
  ogUrl: runtimeConfig.public.appUrl,
  twitterCard: 'summary_large_image',
  twitterTitle: "Ivy's Recipes",
  twitterDescription: runtimeConfig.public.appDescription,
  twitterImage: runtimeConfig.public.appImage,
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: "Ivy's Recipes",
        url: runtimeConfig.public.appUrl,
      })
    }
  ]
})
</script>

<template>
  <AppTemplate>
    <HomeHero />
    <RecipeList
      :recipes="recentRecipes ?? []"
      heading="Recent Recipes"
    />
  </AppTemplate>
</template>
