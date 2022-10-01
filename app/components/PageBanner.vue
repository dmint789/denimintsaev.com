<template>
  <div class="py-4">
    <div class="standard-page-div">
      <p class="text-xl text-justify">
        <slot />
      </p>
    </div>
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
