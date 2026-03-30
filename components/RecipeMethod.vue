<script setup lang="ts">
const props = defineProps<{
  steps: string[]
}>()

// Converts **text** markers into highlighted quantity badges.
// All other text is rendered as-is.
function highlight(text: string): string {
  return text.replace(/\*\*(.+?)\*\*/g, (_, inner) =>
    `<mark class="qty">${inner}</mark>`
  )
}
</script>

<template>
  <section class="recipe-method">
    <h2 class="recipe-section-heading">Method</h2>
    <ol class="method-steps">
      <li
        v-for="(step, i) in steps"
        :key="i"
        class="method-step"
      >
        <span class="method-step-number">{{ i + 1 }}</span>
        <span class="method-step-text" v-html="highlight(step)" />
      </li>
    </ol>
  </section>
</template>

<style scoped>
.recipe-method {
  @apply mb-8;
}

.recipe-section-heading {
  @apply text-xl font-bold text-stone-800 mb-4;
}

.method-steps {
  @apply list-none p-0 m-0 space-y-4;
}

.method-step {
  @apply flex gap-4 items-start;
}

.method-step-number {
  @apply flex-shrink-0 w-7 h-7 rounded-full text-sm font-bold
         flex items-center justify-center
         bg-emerald-700 text-white;
  line-height: 1;
}

.method-step-text {
  @apply text-stone-700 leading-relaxed pt-0.5;
}
</style>

<!-- Global style for qty marks — scoped won't reach v-html content -->
<style>
.qty {
  background: #dcfce7;      /* emerald-100 */
  color: #14532d;           /* emerald-900 */
  border-radius: 4px;
  padding: 1px 5px;
  font-weight: 600;
  font-style: normal;
  text-decoration: none;
}
</style>
