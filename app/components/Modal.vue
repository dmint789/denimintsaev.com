<template>
  <!-- Background -->
  <div class="fixed inset-0 h-full w-full flex justify-center items-center bg-opacity-50 bg-mygray-600">
    <!-- Modal -->
    <div
      class="relative w-full m-4 pt-2 pb-6 px-6 border shadow-lg rounded-lg bg-white"
      :class="`max-w-screen-${size}`"
    >
      <!-- Heading with X button -->
      <div class="flex justify-between items-center">
        <MyHeader :size="3">{{ title }}</MyHeader>
        <button
          type="button"
          class="border-none text-black hover:text-mygray-700 active:text-gray-500"
          @click="$emit('close')"
        >
          <!-- <font-awesome-icon icon="xmark" class="w-6 h-6" /> -->
          <i class="fa-solid fa-xmark w-8 h-8 md:w-10 md:h-10"></i>
        </button>
      </div>
      <div class="pt-4 pb-2">
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';

  export default Vue.extend({
    name: 'Modal',
    props: {
      title: {
        type: String,
        required: true,
      },
      size: {
        type: String as () => 'sm' | 'md' | 'lg',
        default: 'md',
      },
    },
  });
</script>
