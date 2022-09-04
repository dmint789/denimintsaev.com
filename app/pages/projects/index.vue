<template>
  <div class="flex flex-col items-center">
    <MyHeader :size="5">Projects</MyHeader>
    <div class="flex flex-col items-center gap-4">
      <MyButton link="/kanjisorter">Kanji Sorter</MyButton>
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
