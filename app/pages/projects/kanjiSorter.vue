<template>
  <div>
    <MyHeader text="Kanji Sorter" />
    <div class="mx-auto w-1/2">
      <KanjiSorterTextInput />
      <KanjiSorterOutput />
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';

  export default Vue.extend({
    name: 'KanjiSorter',
  });
</script>

<style lang="postcss" scoped></style>
