<script setup lang="ts">
/**
 * AdUnit.vue — Reusable Google AdSense ad unit.
 *
 * Props:
 *   slot      — AdSense ad slot ID (from your AdSense dashboard)
 *   format    — 'auto' | 'rectangle' | 'horizontal' | 'vertical' (default: 'auto')
 *   fullWidth — data-full-width-responsive (default: true)
 *
 * Ad units are hidden during development (the AdSense script is not loaded in dev).
 * In production, set the publisher ID in nuxt.config.ts once your site is approved.
 */

const props = withDefaults(defineProps<{
  slot: string
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical'
  fullWidth?: boolean
}>(), {
  format: 'auto',
  fullWidth: true,
})

const runtimeConfig = useRuntimeConfig()
const publisherId = runtimeConfig.public.adsensePublisherId as string
const adsEnabled = runtimeConfig.public.adsEnabled as boolean

// Push the ad slot to the adsbygoogle queue once mounted (client-side only).
onMounted(() => {
  try {
    // @ts-ignore — adsbygoogle is injected globally by the AdSense loader script
    ;(window.adsbygoogle = window.adsbygoogle || []).push({})
  } catch (e) {
    // Silently swallow — can happen when the ad unit slot ID isn't valid yet
  }
})
</script>

<template>
  <div v-if="adsEnabled" class="ad-unit" :data-format="format">
    <ins
      class="adsbygoogle"
      style="display:block; width:100%"
      :data-ad-client="`ca-pub-${publisherId}`"
      :data-ad-slot="slot"
      :data-ad-format="format"
      :data-full-width-responsive="fullWidth ? 'true' : 'false'"
    />
  </div>
</template>

<style scoped>
.ad-unit {
  /* Ensure the ad container doesn't collapse to zero height before the ad loads */
  min-height: 90px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1.5rem 0;
}

/* Horizontal leaderboard style */
.ad-unit[data-format="horizontal"] {
  min-height: 90px;
}

/* Rectangle / large rectangle */
.ad-unit[data-format="rectangle"] {
  min-height: 250px;
  max-width: 336px;
  margin-left: auto;
  margin-right: auto;
}

/* Responsive auto */
.ad-unit[data-format="auto"] {
  min-height: 90px;
}
</style>
