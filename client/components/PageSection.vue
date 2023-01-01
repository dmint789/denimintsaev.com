<script setup lang="ts">
withDefaults(
  defineProps<{
    py?: number;
  }>(),
  {
    py: 6,
  },
);
</script>

<template>
  <div class="w-full">
    <div class="page-section" :class="[`py-${py > 4 ? py - 2 : py > 2 ? py - 1 : py}`, `md:py-${py}`]">
      <slot />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.page-section {
  @apply mx-auto px-3 w-full max-w-screen-lg;
}

.page-section > p {
  @apply text-base md:text-lg;
}
</style>
