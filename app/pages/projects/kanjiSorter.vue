<template>
  <div>
    <PageSection :py="2" class="bg-red-500">
      <p class="paragraph">
        If you had a kanji list saved on the old website and would like to retrieve it, please contact me at
        cube327@tuta.io
      </p>
    </PageSection>
    <PageSection :py="2" class="bg-yellow-400">
      <p class="paragraph">
        This new version of the Kanji Sorter is still a WIP, but it should be even better than the old one. Currently,
        the only features that don't work are the About section, the Import List button, and the saving of kanji lists
        in the cloud. However, your list will be saved in the browser now, as long as you don't clear your site data.
        Another new feature is the "Negative Filter" checkbox. The old version can still be accessed
        <a href="https://dmintsaev.wixsite.com/website/kanjisorter">here</a>.
      </p>
    </PageSection>
    <!-- You can still access the old version through <a href="">this link</a> -->
    <PageSection>
      <MyHeader :size="5">Kanji Sorter</MyHeader>
      <div>
        <KanjiSorterTextInput />
        <KanjiSorterOutput />
        <KanjiSorterList />
      </div>
    </PageSection>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { mapMutations, mapActions } from 'vuex';

  export default Vue.extend({
    name: 'KanjiSorter',
    async created() {
      const data = await this.$axios.$get('/kanjiData.json');
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
