<template>
  <section class="hero">
    <div class="hero-content">
      <h1 class="hero-title">
        <span class="hero-title-accent">Ivy's</span> Recipes
      </h1>
      <p class="hero-subtitle">
        Simple, delicious recipes for every occasion — from weeknight dinners to weekend feasts to yummy puddings....
      </p>
      <NuxtLink to="/recipes" class="hero-cta">
        Browse Recipes
        <Icon name="fa6-solid:arrow-right" class="hero-cta-icon" />
      </NuxtLink>
    </div>
    <div class="hero-decoration" aria-hidden="true">
      <Icon name="fa6-solid:leaf" class="hero-icon" />
    </div>
  </section>
</template>

<style scoped>
.hero {
  @apply flex items-center justify-between;
  background: linear-gradient(135deg, #14532d 0%, #166534 50%, #15803d 100%);
  @apply text-white rounded-2xl p-10 mb-10;
  @apply gap-8;
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 80% 50%, rgba(134, 239, 172, 0.08) 0%, transparent 70%);
  pointer-events: none;
}

.hero-content {
  @apply flex flex-col gap-5 max-w-xl;
  position: relative;
  z-index: 1;
}

.hero-title {
  @apply text-4xl md:text-5xl font-extrabold leading-tight;
  @apply mb-0;
}

.hero-title-accent {
  @apply text-emerald-300;
}

.hero-subtitle {
  @apply text-lg mb-0;
  @apply leading-relaxed;
  color: rgba(255,255,255,0.82);
}

.hero-cta {
  @apply no-underline inline-flex items-center gap-2;
  @apply bg-white font-bold;
  color: #14532d;
  @apply px-6 py-3 rounded-xl;
  @apply transition-all duration-200;
  @apply self-start;
  box-shadow: 0 4px 14px rgba(0,0,0,0.15);

  &:hover {
    background: #f0fdf4;
    box-shadow: 0 6px 20px rgba(0,0,0,0.2);
    transform: translateY(-1px);
  }
}

.hero-cta-icon {
  @apply text-sm;
}

.hero-decoration {
  @apply hidden md:flex;
  opacity: 0.12;
  position: relative;
  z-index: 1;
}

.hero-icon {
  font-size: 10rem;
}
</style>
