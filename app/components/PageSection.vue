<template>
  <div class="w-full">
    <div
      class="mx-auto px-3 w-full max-w-screen-lg"
      :class="`py-${py > 4 ? py - 2 : py > 2 ? py - 1 : py} md:py-${py}`"
    >
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';

  export default Vue.extend({
    name: 'PageSection',
    props: {
      py: {
        type: Number,
        default: 6,
      },
    },
  });
</script>

<style lang="postcss" scoped></style>
