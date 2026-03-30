<script setup lang="ts">
defineProps<{
  category?: string
  prepTime?: string
  cookTime?: string
  servings?: number
  tags?: string[]
}>()
</script>

<template>
  <div class="recipe-meta">
    <div v-if="category" class="recipe-meta-item">
      <Icon name="fa6-solid:tag" class="recipe-meta-icon" />
      <span class="recipe-meta-label">Category</span>
      <span class="recipe-meta-value">{{ category }}</span>
    </div>
    <div v-if="prepTime" class="recipe-meta-item">
      <Icon name="fa6-regular:clock" class="recipe-meta-icon" />
      <span class="recipe-meta-label">Prep</span>
      <span class="recipe-meta-value">{{ prepTime }}</span>
    </div>
    <div v-if="cookTime" class="recipe-meta-item">
      <Icon name="fa6-solid:fire-flame-simple" class="recipe-meta-icon" />
      <span class="recipe-meta-label">Cook</span>
      <span class="recipe-meta-value">{{ cookTime }}</span>
    </div>
    <div v-if="servings" class="recipe-meta-item">
      <Icon name="fa6-solid:users" class="recipe-meta-icon" />
      <span class="recipe-meta-label">Serves</span>
      <span class="recipe-meta-value">{{ servings }}</span>
    </div>
  </div>
</template>

<style scoped>
.recipe-meta {
  @apply flex flex-wrap gap-4 mb-8;
  @apply bg-emerald-50 border border-emerald-200 rounded-xl p-5;
}

.recipe-meta-item {
  @apply flex items-center gap-2 text-sm;
}

.recipe-meta-icon {
  @apply text-emerald-700 text-base;
}

.recipe-meta-label {
  @apply font-semibold text-stone-600;
}

.recipe-meta-value {
  @apply text-stone-800;
}
</style>
