<template>
  <PageSection class="bg-mygray-900">
    <MyHeader :size="5" white>Projects</MyHeader>
    <div class="items-column">
      <MyButton white link="/kanjisorter">Kanji Sorter</MyButton>
      <MyButton white link="https://denthebro.itch.io/red-octagon">Red Octagon</MyButton>
      <MyButton white link="/api/static/pll_bingo.jpg">PLL Bingo</MyButton>
    </div>
  </PageSection>
</template>

<script lang="ts">
  import Vue from 'vue';

  export default Vue.extend({
    name: 'Projects',
  });
</script>

<style lang="postcss" scoped></style>
