<template>
  <PageSection>
    <MyHeader :size="5">Projects</MyHeader>
    <div class="mt-2 w-full flex flex-col items-center gap-4">
      <MyButton link="/kanjisorter">Kanji Sorter</MyButton>
      <MyButton link="https://denthebro.itch.io/red-octagon">Red Octagon</MyButton>
      <!-- <MyButton link="/pll_bingo.png">PLL Bingo</MyButton> -->
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
