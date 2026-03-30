<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()
const route = useRoute()

const { data: allRecipes } = await useAsyncData('all-recipes', () => {
  const query = queryCollection('recipes').order('date', 'DESC')
  if (!import.meta.dev) query.where('draft', '<>', true)
  return query.all()
})

// Collect all unique tags and categories for filtering
const allTags = computed(() => {
  const tags = new Set<string>()
  allRecipes.value?.forEach(r => r.tags?.forEach(t => tags.add(t)))
  return Array.from(tags).sort()
})

const allCategories = computed(() => {
  const categories = new Set<string>()
  allRecipes.value?.forEach(r => { if (r.category) categories.add(r.category) })
  return Array.from(categories).sort()
})

const selectedTag = ref<string | null>(null)
const selectedCategory = ref<string | null>(null)

const filteredRecipes = computed(() => {
  return (allRecipes.value ?? []).filter(r => {
    const tagMatch = !selectedTag.value || r.tags?.includes(selectedTag.value)
    const categoryMatch = !selectedCategory.value || r.category === selectedCategory.value
    return tagMatch && categoryMatch
  })
})

function toggleTag(tag: string) {
  selectedTag.value = selectedTag.value === tag ? null : tag
}

function toggleCategory(category: string) {
  selectedCategory.value = selectedCategory.value === category ? null : category
}

useHead({
  title: 'Recipes',
  titleTemplate: (t) => t ? `${t} | ivys-recipes.andyevans.dev` : 'ivys-recipes.andyevans.dev',
})

useSeoMeta({
  ogTitle: 'Recipes | ivys-recipes.andyevans.dev',
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
      <div class="filters" v-if="allCategories.length || allTags.length">
        <div v-if="allCategories.length" class="filter-group">
          <span class="filter-label">Category</span>
          <button
            v-for="category in allCategories"
            :key="category"
            class="filter-chip"
            :class="{ 'filter-chip--active': selectedCategory === category }"
            @click="toggleCategory(category)"
          >
            {{ category }}
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
