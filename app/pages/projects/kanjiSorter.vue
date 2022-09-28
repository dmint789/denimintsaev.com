<template>
  <div>
    <MyHeader :size="5">Kanji Sorter</MyHeader>
    <div class="mx-auto w-full max-w-4xl">
      <KanjiSorterTextInput />
      <KanjiSorterOutput />
      <KanjiSorterList />
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { mapMutations, mapActions } from 'vuex';

  export default Vue.extend({
    name: 'KanjiSorter',
    async created() {
      const data = await this.$axios.$get('http://localhost:3000/kanjiData.json');
      this.setKanjiData(data);
      this.loadKanjiList();
    },
    methods: {
      ...mapMutations(['setKanjiData']),
      ...mapActions(['loadKanjiList']),
    },
  });
</script>

<style lang="postcss" scoped></style>
