<script setup lang="ts">
const route = useRoute()
const runtimeConfig = useRuntimeConfig()

const contentPath = computed(() => route.path.replace(/\/$/, '') || '/')

const { data: recipe } = await useAsyncData(
  `recipe-${contentPath.value}`,
  () => queryCollection('recipes').path(contentPath.value).first()
)

if (!recipe.value) {
  throw createError({ statusCode: 404, statusMessage: 'Recipe not found' })
}

useHead({
  title: computed(() => recipe.value?.title),
  titleTemplate: (t) => t ? `${t} | Ivy's Recipes` : "Ivy's Recipes",
})

useSeoMeta({
  ogTitle: computed(() => `${recipe.value?.title} | Ivy's Recipes`),
  description: computed(() => recipe.value?.description ?? runtimeConfig.public.appDescription),
  ogDescription: computed(() => recipe.value?.description ?? runtimeConfig.public.appDescription),
  ogImage: computed(() => recipe.value?.image ?? runtimeConfig.public.appImage),
  ogType: 'article',
  ogLocale: 'en_GB',
  ogUrl: computed(() => `${runtimeConfig.public.appUrl}${route.path.replace(/\/$/, '')}`),
  twitterCard: 'summary_large_image',
  twitterTitle: computed(() => `${recipe.value?.title} | Ivy's Recipes`),
  twitterDescription: computed(() => recipe.value?.description ?? runtimeConfig.public.appDescription),
  twitterImage: computed(() => recipe.value?.image ?? runtimeConfig.public.appImage),
})

useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: computed(() => JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Recipe',
      name: recipe.value?.title,
      description: recipe.value?.description,
      image: recipe.value?.image,
      datePublished: recipe.value?.date,
      author: [{ '@type': 'Person', name: 'Andy Evans', url: runtimeConfig.public.appUrl }],
      recipeCategory: recipe.value?.cuisine,
      prepTime: recipe.value?.prepTime,
      cookTime: recipe.value?.cookTime,
      recipeYield: recipe.value?.servings ? `${recipe.value.servings} servings` : undefined,
    }))
  }]
})
</script>

<template>
  <AppTemplate>
    <article v-if="recipe" class="recipe-detail">
      <header class="recipe-detail-header">
        <NuxtLink to="/recipes" class="recipe-back-link">
          <Icon name="fa6-solid:arrow-left" /> All Recipes
        </NuxtLink>
        <h1>{{ recipe.title }}</h1>
        <p class="recipe-detail-description">{{ recipe.description }}</p>

        <div class="recipe-detail-tags" v-if="recipe.tags?.length">
          <span v-for="tag in recipe.tags" :key="tag" class="recipe-detail-tag">{{ tag }}</span>
        </div>
      </header>

      <img
        v-if="recipe.image"
        :src="recipe.image"
        :alt="recipe.imageAlt ?? recipe.title"
        class="recipe-hero-image"
      />

      <RecipeMeta
        :cuisine="recipe.cuisine"
        :prepTime="recipe.prepTime"
        :cookTime="recipe.cookTime"
        :servings="recipe.servings"
      />

      <div class="recipe-body">
        <ContentRenderer :value="recipe" />
      </div>
    </article>
  </AppTemplate>
</template>

<style scoped>
.recipe-detail {
  @apply max-w-3xl mx-auto;
}

.recipe-detail-header {
  @apply mb-8;
}

.recipe-back-link {
  @apply no-underline inline-flex items-center gap-2;
  @apply text-sm text-emerald-700 font-semibold mb-4;
  @apply hover:text-emerald-900 transition-colors;
}

.recipe-detail-description {
  @apply text-lg text-stone-600 leading-relaxed mb-4;
}

.recipe-detail-tags {
  @apply flex flex-wrap gap-2;
}

.recipe-detail-tag {
  @apply text-sm bg-emerald-50 text-emerald-800 border border-emerald-200;
  @apply rounded-full px-3 py-1;
}

.recipe-hero-image {
  @apply w-full rounded-2xl shadow-md mb-8;
  @apply my-0;
  max-height: 400px;
  object-fit: cover;
}

.recipe-body {
  /* Markdown content — base styles from main.css */
}
</style>
