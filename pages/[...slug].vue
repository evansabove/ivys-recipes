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

const description = computed(() => recipe.value?.description ?? runtimeConfig.public.appDescription)

// Structured data and social tags need absolute URLs
const absoluteUrl = (path: string) => new URL(path, runtimeConfig.public.appUrl).href
const pageUrl = computed(() => absoluteUrl(route.path.replace(/\/?$/, '/')))

const shareImage = computed(() =>
  recipe.value?.image ? absoluteUrl(recipe.value.image) : runtimeConfig.public.appImage
)
const shareImageAlt = computed(() => recipe.value?.imageAlt ?? recipe.value?.title)
const shareImageType = computed(() =>
  /\.png$/i.test(shareImage.value) ? 'image/png' as const : 'image/jpeg' as const
)

useSeoMeta({
  ogTitle: computed(() => `${recipe.value?.title} | Ivy's Recipes`),
  description,
  ogDescription: description,
  ogImage: shareImage,
  ogImageAlt: shareImageAlt,
  ogImageType: shareImageType,
  ogType: 'article',
  ogLocale: 'en_GB',
  ogUrl: pageUrl,
  twitterCard: 'summary_large_image',
  twitterTitle: computed(() => `${recipe.value?.title} | Ivy's Recipes`),
  twitterDescription: description,
  twitterImage: shareImage,
  twitterImageAlt: shareImageAlt,
})

// Recipe scaling — only offered when the recipe lists scaleOptions in its frontmatter.
// Structured data (JSON-LD below) always uses the original quantities.
const scaleOptions = computed(() => {
  const options = recipe.value?.scaleOptions?.map(parseScale) ?? []
  if (options.length && !options.includes(1)) options.push(1)
  return [...new Set(options)].sort((a, b) => a - b)
})
const scale = ref(1)

const scaledIngredients = computed(() =>
  recipe.value?.ingredients?.map(g => ({
    ...g,
    items: g.items.map(item => scaleIngredient(item, scale.value)),
  })) ?? []
)
const scaledSteps = computed(() =>
  recipe.value?.steps?.map(step => scaleStep(step, scale.value)) ?? []
)
const scaledServings = computed(() =>
  recipe.value?.servings ? formatQuantity(recipe.value.servings * scale.value) : undefined
)

const allIngredients = computed(() =>
  recipe.value?.ingredients?.flatMap(g => g.items) ?? []
)

// Parse human-readable durations like "15 mins", "1 hr 30 mins" into minutes
function toMinutes(value: string | undefined): number {
  if (!value) return 0
  const clean = value.toLowerCase().trim()
  const hours = clean.match(/(\d+)\s*h(?:r|our)?s?/)
  const mins = clean.match(/(\d+)\s*m(?:in)?s?/)
  return (hours ? parseInt(hours[1]) * 60 : 0) + (mins ? parseInt(mins[1]) : 0)
}

// Format minutes as an ISO 8601 duration, e.g. 90 → "PT1H30M"
function toISO8601Duration(minutes: number): string | undefined {
  if (!minutes) return undefined
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `PT${h ? `${h}H` : ''}${m ? `${m}M` : ''}`
}

const prepMinutes = computed(() => toMinutes(recipe.value?.prepTime))
const cookMinutes = computed(() => toMinutes(recipe.value?.cookTime))

useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: computed(() => JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
        { '@type': 'ListItem', position: 2, name: 'Recipes', item: absoluteUrl('/recipes/') },
        { '@type': 'ListItem', position: 3, name: recipe.value?.title, item: pageUrl.value },
      ],
    }))
  }, {
    type: 'application/ld+json',
    innerHTML: computed(() => JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Recipe',
      name: recipe.value?.title,
      description: recipe.value?.description,
      image: recipe.value?.image ? [absoluteUrl(recipe.value.image)] : undefined,
      datePublished: recipe.value?.date,
      dateModified: recipe.value?.updated ?? recipe.value?.date,
      author: [{ '@type': 'Person', name: 'Andy Evans', url: runtimeConfig.public.appUrl }],
      recipeCategory: recipe.value?.category,
      recipeCuisine: recipe.value?.recipeCuisine,
      keywords: recipe.value?.keywords?.join(', '),
      prepTime: toISO8601Duration(prepMinutes.value),
      cookTime: toISO8601Duration(cookMinutes.value),
      totalTime: toISO8601Duration(prepMinutes.value + cookMinutes.value),
      recipeYield: recipe.value?.servings ? `${recipe.value.servings} servings` : undefined,
      recipeIngredient: allIngredients.value.length ? allIngredients.value : undefined,
      recipeInstructions: recipe.value?.steps?.length
        ? recipe.value.steps.map((text, i) => ({
            '@type': 'HowToStep',
            position: i + 1,
            name: `Step ${i + 1}`,
            // Strip the **quantity** highlight markers used on the page
            text: text.replace(/\*\*(.+?)\*\*/g, '$1'),
            url: `${pageUrl.value}#step-${i + 1}`,
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
        :servings="scaledServings"
      />

      <!-- Intro paragraph -->
      <p v-if="recipe.intro" class="recipe-intro">{{ recipe.intro }}</p>

      <!-- Ingredients -->
      <section v-if="recipe.ingredients?.length" class="recipe-ingredients">
        <div class="recipe-ingredients-header">
          <h2 class="recipe-section-heading">Ingredients</h2>
          <label v-if="scaleOptions.length > 1" class="recipe-scale">
            <Icon name="fa6-solid:up-right-and-down-left-from-center" class="recipe-scale-icon" />
            <span class="recipe-scale-label">Scale</span>
            <select v-model.number="scale" class="recipe-scale-select">
              <option v-for="option in scaleOptions" :key="option" :value="option">
                {{ formatScale(option) }}
              </option>
            </select>
          </label>
        </div>
        <p v-if="scale !== 1" class="recipe-scale-note">
          Quantities scaled to {{ formatScale(scale) }}. Cooking times and dish size may need adjusting.
        </p>
        <div
          v-for="group in scaledIngredients"
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
      <RecipeMethod v-if="scaledSteps.length" :steps="scaledSteps" />

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

.recipe-ingredients-header {
  @apply flex flex-wrap items-center justify-between gap-3 mb-4;

  & .recipe-section-heading {
    @apply mb-0;
  }
}

.recipe-scale {
  @apply flex items-center gap-2 text-sm;
}

.recipe-scale-icon {
  @apply text-emerald-700 text-base;
}

.recipe-scale-label {
  @apply font-semibold text-stone-600;
}

.recipe-scale-select {
  @apply bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5;
  @apply text-stone-800 font-semibold cursor-pointer;
  @apply focus:outline-none focus:ring-2 focus:ring-emerald-400;
}

.recipe-scale-note {
  @apply text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-4 mt-0;
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
