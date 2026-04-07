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

// Draft recipes are only visible in development.
// In production, accessing a draft URL directly returns a 404.
if (recipe.value.draft && !import.meta.dev) {
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

const allIngredients = computed(() =>
  recipe.value?.ingredients?.flatMap(g => g.items) ?? []
)

// Convert human-readable durations like "15 mins", "1 hr 30 mins" to ISO 8601
function toISO8601Duration(value: string | undefined): string | undefined {
  if (!value) return undefined
  const clean = value.toLowerCase().trim()
  const hours = clean.match(/(\d+)\s*h(?:r|our)?s?/)
  const mins = clean.match(/(\d+)\s*m(?:in)?s?/)
  const h = hours ? parseInt(hours[1]) : 0
  const m = mins ? parseInt(mins[1]) : 0
  if (!h && !m) return undefined
  return `PT${h ? `${h}H` : ''}${m ? `${m}M` : ''}`
}

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
      recipeCategory: recipe.value?.category,
      recipeCuisine: recipe.value?.recipeCuisine,
      keywords: recipe.value?.keywords?.join(', '),
      prepTime: toISO8601Duration(recipe.value?.prepTime),
      cookTime: toISO8601Duration(recipe.value?.cookTime),
      recipeYield: recipe.value?.servings ? `${recipe.value.servings} servings` : undefined,
      recipeIngredient: allIngredients.value.length ? allIngredients.value : undefined,
      recipeInstructions: recipe.value?.steps?.length
        ? recipe.value.steps.map((text, i) => ({
            '@type': 'HowToStep',
            text,
            url: `${runtimeConfig.public.appUrl}${route.path.replace(/\/$/, '')}#step-${i + 1}`,
          }))
        : undefined,
      nutrition: recipe.value?.nutrition
        ? { '@type': 'NutritionInformation', ...recipe.value.nutrition }
        : undefined,
    }))
  }]
})
</script>

<template>
  <AppTemplate>
    <article v-if="recipe" class="recipe-detail">

      <!-- Draft banner — only visible in development -->
      <div v-if="recipe.draft" class="recipe-draft-banner">
        <Icon name="fa6-solid:pencil" />
        <span>Draft — this recipe is not published yet</span>
      </div>

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
        :category="recipe.category"
        :prepTime="recipe.prepTime"
        :cookTime="recipe.cookTime"
        :servings="recipe.servings"
      />

      <!-- Intro paragraph -->
      <p v-if="recipe.intro" class="recipe-intro">{{ recipe.intro }}</p>

      <!-- Ingredients -->
      <section v-if="recipe.ingredients?.length" class="recipe-ingredients">
        <h2 class="recipe-section-heading">Ingredients</h2>
        <div
          v-for="group in recipe.ingredients"
          :key="group.group ?? 'default'"
          class="recipe-ingredients-group"
        >
          <h3 v-if="group.group" class="recipe-ingredients-group-name">{{ group.group }}</h3>
          <ul class="recipe-ingredients-list">
            <li v-for="item in group.items" :key="item" class="recipe-ingredients-item">
              {{ item }}
            </li>
          </ul>
        </div>
      </section>

      <!-- Method steps with quantity highlighting -->
      <RecipeMethod v-if="recipe.steps?.length" :steps="recipe.steps" />

      <!-- Serve -->
      <section v-if="recipe.serve" class="recipe-serve">
        <h2 class="recipe-section-heading">Serve</h2>
        <p class="recipe-serve-text">{{ recipe.serve }}</p>
      </section>

      <!-- Tips -->
      <section v-if="recipe.tips?.length" class="recipe-tips">
        <h2 class="recipe-section-heading">Tips</h2>
        <ul class="recipe-tips-list">
          <li v-for="tip in recipe.tips" :key="tip" class="recipe-tips-item">
            {{ tip }}
          </li>
        </ul>
      </section>

      <!-- Fallback: remaining markdown body content -->
      <div v-if="(recipe.body as any)?.children?.length" class="recipe-body">
        <ContentRenderer :value="recipe" />
      </div>
    </article>
  </AppTemplate>
</template>

<style scoped>
.recipe-detail {
  @apply max-w-3xl mx-auto;
}

.recipe-draft-banner {
  @apply flex items-center gap-2 mb-6;
  @apply bg-amber-50 border border-amber-300 text-amber-800;
  @apply rounded-xl px-4 py-3 text-sm font-semibold;
}

.recipe-intro {
  @apply text-base text-stone-600 leading-relaxed mb-8 italic;
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
  @apply mt-0;
  max-height: 400px;
  object-fit: cover;
}

.recipe-section-heading {
  @apply text-xl font-bold text-emerald-900 mb-4 mt-0;
}

.recipe-ingredients {
  @apply mb-6;
}

.recipe-ingredients-group {
  @apply mb-4 last:mb-0;
}

.recipe-ingredients-group-name {
  @apply text-sm font-semibold uppercase tracking-wide text-emerald-600 mb-2 mt-0;
}

.recipe-ingredients-list {
  @apply list-none p-0 m-0 space-y-1;
}

.recipe-ingredients-item {
  @apply text-stone-700 flex items-start gap-2;
  margin: 0;

  &::before {
    content: '–';
    @apply text-emerald-400 flex-shrink-0;
  }
}

.recipe-serve {
  @apply mb-6;
}

.recipe-serve-text {
  @apply text-stone-700 leading-relaxed;
}

.recipe-tips {
  @apply mb-6;
}

.recipe-tips-list {
  @apply list-none p-0 m-0 space-y-2;
}

.recipe-tips-item {
  @apply text-stone-700 flex items-start gap-2;

  &::before {
    content: '💡';
    font-size: 1.5rem;
    line-height: 1;
    @apply flex-shrink-0;
  }
}

.recipe-body {
  /* Markdown content — base styles from main.css */
}
</style>
