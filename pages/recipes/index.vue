<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()
const route = useRoute()

const { data: allRecipes } = await useAsyncData('all-recipes', () =>
  queryCollection('recipes')
    .order('date', 'DESC')
    .all()
)

// Collect all unique tags and cuisines for filtering
const allTags = computed(() => {
  const tags = new Set<string>()
  allRecipes.value?.forEach(r => r.tags?.forEach(t => tags.add(t)))
  return Array.from(tags).sort()
})

const allCuisines = computed(() => {
  const cuisines = new Set<string>()
  allRecipes.value?.forEach(r => { if (r.cuisine) cuisines.add(r.cuisine) })
  return Array.from(cuisines).sort()
})

const selectedTag = ref<string | null>(null)
const selectedCuisine = ref<string | null>(null)

const filteredRecipes = computed(() => {
  return (allRecipes.value ?? []).filter(r => {
    const tagMatch = !selectedTag.value || r.tags?.includes(selectedTag.value)
    const cuisineMatch = !selectedCuisine.value || r.cuisine === selectedCuisine.value
    return tagMatch && cuisineMatch
  })
})

function toggleTag(tag: string) {
  selectedTag.value = selectedTag.value === tag ? null : tag
}

function toggleCuisine(cuisine: string) {
  selectedCuisine.value = selectedCuisine.value === cuisine ? null : cuisine
}

useHead({
  title: 'Recipes',
  titleTemplate: (t) => t ? `${t} | food.andyevans.dev` : 'food.andyevans.dev',
})

useSeoMeta({
  ogTitle: 'Recipes | food.andyevans.dev',
  description: runtimeConfig.public.appDescription,
  ogDescription: runtimeConfig.public.appDescription,
  ogLocale: 'en_GB',
  ogImage: runtimeConfig.public.appImage,
  ogUrl: computed(() => `${runtimeConfig.public.appUrl}${route.path.replace(/\/$/, '')}`),
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <AppTemplate>
    <div class="recipes-page">
      <h1 class="recipes-heading">All Recipes</h1>

      <!-- Filters -->
      <div class="filters" v-if="allCuisines.length || allTags.length">
        <div v-if="allCuisines.length" class="filter-group">
          <span class="filter-label">Cuisine</span>
          <button
            v-for="cuisine in allCuisines"
            :key="cuisine"
            class="filter-chip"
            :class="{ 'filter-chip--active': selectedCuisine === cuisine }"
            @click="toggleCuisine(cuisine)"
          >
            {{ cuisine }}
          </button>
        </div>
        <div v-if="allTags.length" class="filter-group">
          <span class="filter-label">Tags</span>
          <button
            v-for="tag in allTags"
            :key="tag"
            class="filter-chip"
            :class="{ 'filter-chip--active': selectedTag === tag }"
            @click="toggleTag(tag)"
          >
            {{ tag }}
          </button>
        </div>
      </div>

      <RecipeList :recipes="filteredRecipes" />
    </div>
  </AppTemplate>
</template>

<style scoped>
.recipes-page {
  @apply flex flex-col gap-6;
}

.recipes-heading {
  @apply text-3xl font-extrabold text-stone-800 mb-0;
}

.filters {
  @apply flex flex-col gap-3;
  @apply bg-white border border-stone-200 rounded-xl p-5;
}

.filter-group {
  @apply flex flex-wrap gap-2 items-center;
}

.filter-label {
  @apply text-xs font-bold uppercase tracking-wider text-stone-500 mr-1;
}

.filter-chip {
  @apply text-sm bg-stone-100 text-stone-600 border border-stone-200;
  @apply rounded-full px-3 py-1 cursor-pointer;
  @apply hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700;
  @apply transition-colors duration-150;

  &--active {
    @apply bg-amber-100 border-amber-400 text-amber-800 font-semibold;
  }
}
</style>
