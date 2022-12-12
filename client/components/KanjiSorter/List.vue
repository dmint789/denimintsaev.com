<script setup lang="ts">
import { useKanjiSorterStore } from '~~/stores/KanjiSorterStore';
import { ListType } from '~/helpers/enums/index';

const ksS = useKanjiSorterStore();

const onLoad = () => {};
const onSave = () => {};
const onDeleteSave = () => {};
const onClear = () => {
  ksS.clearKanjiList();
};
</script>

<template>
  <div class="mt-3 md:mt-6">
    <div class="p-2 flex flex-wrap justify-end items-center md:grid md:grid-cols-3 md:justify-between">
      <MyHeader :size="3" class="md:col-start-2">Kanji list</MyHeader>
      <MyHeader noCenter :size="2" class="text-right"
        >Total kanji: {{ ksS.kanjiList.original.length }}</MyHeader
      >
    </div>
    <KanjiSorterDisplay :listType="ListType.KanjiList" />
    <div class="grid grid-cols-4 gap-2 md:gap-4 justify-around">
      <MyButton @click="onLoad" disabled size="full">Load</MyButton>
      <MyButton @click="onSave" disabled size="full">Save</MyButton>
      <MyButton @click="onDeleteSave" disabled size="full">Delete save</MyButton>
      <MyButton @click="onClear" size="full">Clear</MyButton>
    </div>
  </div>
</template>
