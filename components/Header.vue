<template>
  <header class="header">
    <NuxtLink to="/" class="header-brand">
      <img src="/favicon.png" alt="Ivy leaf logo" class="header-brand-icon" />
      {{ config.public.appName }}
    </NuxtLink>

    <!-- Desktop nav -->
    <nav class="header-nav">
      <NuxtLink to="/" class="header-link" active-class="header-link--active" exact>Home</NuxtLink>
      <NuxtLink to="/recipes" class="header-link" active-class="header-link--active">Recipes</NuxtLink>
    </nav>

    <!-- Mobile hamburger -->
    <button class="header-hamburger" aria-label="Open menu" @click="open = true">
      <Icon name="fa6-solid:bars" />
    </button>

    <!-- Mobile menu -->
    <Transition name="slide">
      <div v-if="open" class="header-mobile-menu">
        <button class="header-close" aria-label="Close menu" @click="open = false">
          <Icon name="fa6-solid:xmark" />
        </button>
        <NuxtLink to="/" class="header-link" active-class="header-link--active" exact @click="open = false">Home</NuxtLink>
        <NuxtLink to="/recipes" class="header-link" active-class="header-link--active" @click="open = false">Recipes</NuxtLink>
      </div>
    </Transition>

    <!-- Backdrop -->
    <Transition name="fade">
      <div v-if="open" class="header-backdrop" @click="open = false" />
    </Transition>
  </header>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const open = ref(false)
</script>

<style scoped>
.header {
  @apply flex items-center justify-start;
  background: #0e4d2a;
  @apply text-white;
  @apply px-6 py-4 gap-8;
  @apply sticky top-0 z-50;
  box-shadow: 0 2px 12px rgba(20, 83, 45, 0.4);
}

.header-brand {
  @apply no-underline font-bold text-xl flex items-center gap-2;
  letter-spacing: -0.01em;
}

.header-brand-icon {
  width: 28px;
  height: 28px;
  object-fit: contain;
}

.header-nav {
  @apply hidden md:flex gap-6;
}

.header-link {
  @apply no-underline text-white opacity-70 text-base;
  @apply border-b-2 border-transparent pb-0.5;
  @apply transition-all duration-150;

  &:hover { @apply opacity-100; }
  &--active { @apply opacity-100 border-emerald-300; }
}

/* Hamburger — mobile only */
.header-hamburger {
  @apply flex md:hidden ml-auto;
  @apply bg-transparent border-0 text-white text-2xl cursor-pointer;
}

/* Slide-in mobile menu */
.header-mobile-menu {
  @apply fixed top-0 right-0 h-full w-64 z-50;
  background: #0e4d2a;
  @apply flex flex-col gap-6 p-6;
  @apply shadow-xl md:hidden;
}

.header-close {
  @apply self-end bg-transparent border-0 text-white text-2xl cursor-pointer mb-2;
}

/* Backdrop */
.header-backdrop {
  @apply fixed inset-0 z-40;
  background: rgba(0, 0, 0, 0.4);
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-enter-active, .slide-leave-active { transition: transform 0.25s ease; }
.slide-enter-from, .slide-leave-to { transform: translateX(100%); }
</style>
