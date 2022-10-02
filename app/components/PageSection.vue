<template>
  <div class="w-full">
    <div class="mx-auto px-3 w-full max-w-4xl" :class="`py-${py}`">
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
        default: 8,
      },
    },
  });
</script>

<style lang="postcss" scoped></style>
