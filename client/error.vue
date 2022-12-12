<script setup lang="ts">
defineProps<{
  error: any;
}>();

onUnmounted(() => {
  clearError();
});
</script>

<template>
  <NuxtLayout>
    <div>
      <div class="mt-20 mb-10 text-center text-6xl font-bold">{{ error.statusCode }}</div>
      <p class="mb-8 text-center text-3xl">Oops...</p>
      <div class="text-center text-xl">{{ error.message }}</div>
    </div>
  </NuxtLayout>
</template>
