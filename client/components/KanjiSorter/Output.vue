<script setup lang="ts">
import { useKanjiSorterStore } from '~~/stores/KanjiSorterStore';
import { ListType } from '~/helpers/enums/index';

const ksS = useKanjiSorterStore();

const onAddToList = () => {
  ksS.sortKanjiList(true);
};

const onClear = () => {
  ksS.resetOutput();
};

const onChangeUpdate = (value) => {
  ksS.update = value;
};
</script>

<template>
  <div class="mt-3 md:mt-6">
    <MyHeader :size="3" noPadd>Result</MyHeader>
    <div class="p-2 flex flex-wrap justify-between items-center text-2xl">
      <MyCheckbox name="update" text="Update" :checked="ksS.update" @change="onChangeUpdate" />
      <MyHeader noCenter :size="2">Unique: {{ ksS.uniqueKanji }} | Total: {{ ksS.totalKanji }}</MyHeader>
    </div>
    <KanjiSorterDisplay :listType="ListType.Results" />
    <div class="grid grid-cols-2 gap-2 md:gap-4">
      <MyButton @click="onAddToList" size="full">Add to list</MyButton>
      <MyButton @click="onClear" size="full">Clear</MyButton>
    </div>
  </div>
</template>
