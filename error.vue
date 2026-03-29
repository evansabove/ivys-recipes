<script setup lang="ts">
const error = useError()
</script>

<template>
  <div class="error-page">
    <div class="error-content">
      <Icon name="fa6-solid:triangle-exclamation" class="error-icon" />
      <h1 class="error-code">{{ error?.statusCode ?? 404 }}</h1>
      <p class="error-message">{{ error?.statusMessage ?? 'Page not found' }}</p>
      <NuxtLink to="/" class="error-home-link">
        <Icon name="fa6-solid:arrow-left" /> Back to Home
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.error-page {
  @apply min-h-screen flex items-center justify-center;
  @apply bg-stone-100;
}

.error-content {
  @apply text-center flex flex-col items-center gap-4;
  @apply bg-white rounded-2xl p-12 shadow-sm border border-stone-200;
}

.error-icon {
  @apply text-amber-400;
  font-size: 3rem;
}

.error-code {
  @apply text-6xl font-extrabold text-stone-800 mb-0;
}

.error-message {
  @apply text-lg text-stone-500 mb-0;
}

.error-home-link {
  @apply no-underline inline-flex items-center gap-2;
  @apply bg-amber-600 text-white font-semibold;
  @apply px-6 py-3 rounded-xl;
  @apply hover:bg-amber-700 transition-colors;
}
</style>
