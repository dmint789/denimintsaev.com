<template>
  <div>
    <PageBanner class="bg-yellow-400">
      This new version of the Kanji Sorter is still a WIP, but I think it should be even better than the old one.
      Currently, the only features that don't work are the About section, the Import List button, and the saving of
      kanji lists in the cloud. However, your list will be saved in the browser now, as long as you don't clear your
      cookies or site data. Another new feature is the "Negative Filter" checkbox.
    </PageBanner>
    <!-- You can still access the old version through <a href="">this link</a> -->
    <div class="standard-page-div">
      <MyHeader :size="5">Kanji Sorter</MyHeader>
      <div>
        <KanjiSorterTextInput />
        <KanjiSorterOutput />
        <KanjiSorterList />
      </div>
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
