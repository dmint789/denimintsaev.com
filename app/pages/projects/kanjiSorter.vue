<template>
  <div>
    <PageSection :py="3" class="bg-red-500">
      <p class="text-justify">
        If you had a kanji list saved on the old website and would like to retrieve it, please contact me at
        cube327@tuta.io
      </p>
    </PageSection>
    <PageSection :py="3" class="bg-yellow-400">
      <p class="text-justify">
        This new version of the Kanji Sorter is still a WIP, but it should be even better than the old one.
        Currently, the only features that don't work are the About section and the saving of kanji lists in
        the cloud. However, your list will be saved in the browser now, as long as you don't clear your site
        data. Another new feature is the "Negative filter" checkbox. The old version can still be accessed
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
  import { IKanjiLists } from '~/helpers/interfaces/kanji';

  export default Vue.extend({
    name: 'KanjiSorter',
    async created() {
      // $get is a shortcut for get().data
      const data = await this.$axios.$get('/api/static/kanji_data.json');
      this.setKanjiData(data);

      // The names of these list variables are all the same as the values of the ImportType enum
      let lists = {} as IKanjiLists;

      lists.newspapers = await this.$axios.$get('/api/static/newspaper_sort_kanji.txt');
      lists.novels = await this.$axios.$get('/api/static/novel_sort_kanji.txt');
      lists.strokecount = await this.$axios.$get('/api/static/kanji_by_stroke_count.txt');
      lists.jlpt = await this.$axios.$get('/api/static/jlpt_kanji.json');
      lists.joyo = await this.$axios.$get('/api/static/joyo_kanji.txt');
      lists.all = await this.$axios.$get('/api/static/all_kanji.txt');

      this.setKanjiLists(lists);

      this.loadKanjiList();
    },
    methods: {
      ...mapMutations(['setKanjiData', 'setKanjiLists']),
      ...mapActions(['loadKanjiList']),
    },
  });
</script>

<style lang="postcss" scoped></style>
