<script setup lang="ts">
defineProps<{
  recipe: {
    path: string
    title: string
    description: string
    cuisine?: string
    prepTime?: string
    cookTime?: string
    servings?: number
    tags?: string[]
    image?: string
    imageAlt?: string
  }
}>()
</script>

<template>
  <NuxtLink :to="recipe.path" class="recipe-card">
    <div class="recipe-card-image-wrap">
      <img
        v-if="recipe.image"
        :src="recipe.image"
        :alt="recipe.imageAlt ?? recipe.title"
        class="recipe-card-image"
      />
      <div v-else class="recipe-card-image-placeholder">
        <Icon name="fa6-solid:bowl-food" class="recipe-card-placeholder-icon" />
      </div>
    </div>

    <div class="recipe-card-body">
      <div class="recipe-card-meta-row" v-if="recipe.cuisine">
        <span class="recipe-card-cuisine">{{ recipe.cuisine }}</span>
      </div>

      <h3 class="recipe-card-title">{{ recipe.title }}</h3>
      <p class="recipe-card-description">{{ recipe.description }}</p>

      <div class="recipe-card-stats" v-if="recipe.prepTime || recipe.cookTime || recipe.servings">
        <span v-if="recipe.prepTime" class="recipe-card-stat">
          <Icon name="fa6-regular:clock" class="stat-icon" /> {{ recipe.prepTime }} prep
        </span>
        <span v-if="recipe.cookTime" class="recipe-card-stat">
          <Icon name="fa6-solid:fire-flame-simple" class="stat-icon" /> {{ recipe.cookTime }} cook
        </span>
        <span v-if="recipe.servings" class="recipe-card-stat">
          <Icon name="fa6-solid:users" class="stat-icon" /> Serves {{ recipe.servings }}
        </span>
      </div>

      <div class="recipe-card-tags" v-if="recipe.tags?.length">
        <span v-for="tag in recipe.tags" :key="tag" class="recipe-card-tag">{{ tag }}</span>
      </div>
    </div>
  </NuxtLink>
</template>

<style scoped>
.recipe-card {
  @apply no-underline flex flex-col;
  @apply bg-white rounded-2xl overflow-hidden shadow-sm;
  @apply border border-stone-200;
  @apply transition-all duration-200;
  @apply hover:shadow-md hover:-translate-y-1;
  border-top: 3px solid transparent;

  &:hover {
    border-top-color: #16a34a;
  }
}

.recipe-card-image-wrap {
  @apply w-full overflow-hidden;
  height: 200px;
}

.recipe-card-image {
  @apply w-full h-full object-cover;
  @apply my-0 rounded-none shadow-none;
  max-height: unset;
  transition: transform 0.3s ease;
}

.recipe-card:hover .recipe-card-image {
  transform: scale(1.03);
}

.recipe-card-image-placeholder {
  @apply w-full h-full flex items-center justify-center;
  @apply bg-emerald-50;
}

.recipe-card-placeholder-icon {
  @apply text-emerald-300;
  font-size: 4rem;
}

.recipe-card-body {
  @apply p-5 flex flex-col gap-2 flex-1;
}

.recipe-card-meta-row {
  @apply flex items-center gap-2;
}

.recipe-card-cuisine {
  @apply text-xs font-semibold uppercase tracking-wider;
  @apply text-emerald-700;
}

.recipe-card-title {
  @apply text-lg font-bold text-stone-800;
  @apply mt-0 mb-0;
}

.recipe-card-description {
  @apply text-sm text-stone-500 leading-relaxed mb-0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.recipe-card-stats {
  @apply flex flex-wrap gap-3 mt-1;
}

.recipe-card-stat {
  @apply flex items-center gap-1 text-xs text-stone-500;
}

.stat-icon {
  @apply text-emerald-600;
}

.recipe-card-tags {
  @apply flex flex-wrap gap-1 mt-auto pt-2;
}

.recipe-card-tag {
  @apply text-xs bg-emerald-50 text-emerald-800 border border-emerald-200;
  @apply rounded-full px-2 py-0.5;
}
</style>
