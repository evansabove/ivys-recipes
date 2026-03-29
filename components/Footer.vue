<template>
  <footer class="footer text-white py-4" style="background: linear-gradient(135deg, #14532d, #166534);">
    <div class="footer-content">
      <p>&copy; {{ new Date().getFullYear() }} {{ config.public.appName }}</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
</script>

<style scoped>
.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  font-size: 0.85rem;
}
</style>
