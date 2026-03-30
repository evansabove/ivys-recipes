<script setup lang="ts">
defineProps<{
  recipes: Array<{
    path: string
    title: string
    description: string
    category?: string
    draft?: boolean
    prepTime?: string
    cookTime?: string
    servings?: number
    tags?: string[]
    image?: string
    imageAlt?: string
  }>
  heading?: string
}>()
</script>

<template>
  <section class="recipe-list">
    <h2 v-if="heading" class="recipe-list-heading">{{ heading }}</h2>
    <div v-if="recipes.length" class="recipe-list-grid">
      <RecipeCard v-for="recipe in recipes" :key="recipe.path" :recipe="recipe" />
    </div>
    <p v-else class="recipe-list-empty">No recipes found.</p>
  </section>
</template>

<style scoped>
.recipe-list-heading {
  @apply text-2xl font-bold text-stone-800 mb-6 mt-0;
}

.recipe-list-grid {
  @apply grid gap-6;
  @apply grid-cols-1 sm:grid-cols-2 lg:grid-cols-3;
}

.recipe-list-empty {
  @apply text-stone-500 text-center py-12;
}
</style>
