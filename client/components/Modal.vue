<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string;
    size?: 'sm' | 'md' | 'lg';
  }>(),
  {
    title: '',
    size: 'md',
  },
);

defineEmits<{
  (e: 'close'): void;
}>();
</script>

<template>
  <!-- Background -->
  <div
    class="fixed inset-0 z-50 h-full w-full p-4 flex justify-center items-center bg-opacity-50 bg-mygray-600"
  >
    <!-- Modal -->
    <div
      class="relative overflow-auto max-h-screen w-full pt-1 md:pt-2 pb-4 md:pb-6 px-6 border shadow-lg rounded-lg bg-white"
      :class="`max-w-screen-${size}`"
    >
      <!-- Heading with X button -->
      <div v-if="title" class="pb-2 flex justify-between items-center">
        <MyHeader :size="3">{{ title }}</MyHeader>
        <button
          type="button"
          class="xmark-button border-none text-black hover:text-mygray-600 active:text-gray-400"
          @click="$emit('close')"
        >
          <font-awesome-icon icon="fa-solid fa-xmark" />
        </button>
      </div>
      <div class="pt-1 md:pt-2">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.fa-xmark,
.xmark-button {
  @apply w-6 h-6 md:w-8 md:h-8;
}
</style>
