<script setup lang="ts">
import { useKanjiSorterStore } from '~~/stores/KanjiSorterStore';
import { IKanjiDB, IKanjiLists } from '~/helpers/interfaces/kanji';
import myFetch from '~/composables/myFetch';
import '~/assets/css/kanjiSorter.pcss';

useHead({
  title: 'Kanji Sorter',
  meta: [
    {
      name: 'description',
      content:
        'Best tool for people learning Japanese characters with support for Chinese and Korean too. Sort and filter kanji in various ways, find new ones to learn, find interesting statistics about them and import various lists of kanji with this helpful tool!',
    },
  ],
});

const ksS = useKanjiSorterStore();

if (process.client) {
  ksS.kanjiData = (await myFetch('/kanji_data.json')) as IKanjiDB[];
  ksS.kanjiLists = (await myFetch('/kanji_lists.json')) as IKanjiLists;

  const tempKanjiList = JSON.parse(localStorage.getItem('kanji-list') || '{}');

  if (Object.keys(tempKanjiList).length > 0) {
    ksS.kanjiList = tempKanjiList;
  }
}
</script>

<template>
  <div>
    <PageSection :py="3" class="bg-yellow-400">
      <p class="text-justify">
        This new version of the Kanji Sorter is still a WIP, but it should be even better than the old one.
        Currently, the only features that don't work are the filtering of results using the kanji in the input
        and the saving of kanji lists in the cloud. However, your list will be saved in the browser now, as
        long as you don't clear your site data. The old version can still be accessed
        <NuxtLink to="https://dmintsaev.wixsite.com/website/kanjisorter">here</NuxtLink>. If you had a kanji
        list saved on the old website, you can still access it there.
      </p>
    </PageSection>
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
