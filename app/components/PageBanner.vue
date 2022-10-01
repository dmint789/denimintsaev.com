<template>
  <div class="w-full py-4">
    <p class="max-w-4xl mx-auto text-xl text-justify">
      <slot />
    </p>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';

  export default Vue.extend({
    name: 'PageBanner',
    props: {},
  });
</script>

<style lang="postcss" scoped></style>
