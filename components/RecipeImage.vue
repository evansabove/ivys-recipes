<script setup lang="ts">
// Responsive <picture> for images under /images/recipes, using the AVIF/WebP
// variants and dimensions from scripts/optimise-images.mjs.
// Falls back to a plain <img> for anything not in the manifest.
import manifest from '~/assets/image-manifest.json'

// class etc. go on the <img>, not the <picture> wrapper
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  src: string
  alt: string
  sizes: string
  // Above-the-fold images should be eager with high priority
  priority?: boolean
}>(), {
  priority: false,
})

const image = computed(() => (manifest as Record<string, {
  width: number
  height: number
  sources: Record<'avif' | 'webp', string>
}>)[props.src])
</script>

<template>
  <picture v-if="image" class="recipe-image">
    <source type="image/avif" :srcset="image.sources.avif" :sizes="sizes" />
    <source type="image/webp" :srcset="image.sources.webp" :sizes="sizes" />
    <img
      v-bind="$attrs"
      :src="src"
      :alt="alt"
      :width="image.width"
      :height="image.height"
      :loading="priority ? 'eager' : 'lazy'"
      :fetchpriority="priority ? 'high' : 'auto'"
      decoding="async"
    />
  </picture>
  <img
    v-else
    v-bind="$attrs"
    :src="src"
    :alt="alt"
    :loading="priority ? 'eager' : 'lazy'"
    decoding="async"
  />
</template>

<style scoped>
.recipe-image {
  display: contents;
}
</style>
