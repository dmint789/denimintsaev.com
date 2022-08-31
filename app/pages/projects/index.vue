<template>
  <div class="flex flex-col items-center">
    <MyHeader text="Projects" />
    <div class="flex flex-col items-center gap-4">
      <MyButton text="Kanji Sorter" link="/kanjisorter" />
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';

  export default Vue.extend({
    name: 'Projects',
  });
</script>

<style lang="postcss" scoped></style>
