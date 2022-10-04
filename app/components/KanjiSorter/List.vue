<template>
  <div class="mt-3 md:mt-6">
    <div class="p-2 flex justify-end md:grid md:grid-cols-3 md:justify-between items-center">
      <MyHeader :size="3" class="md:col-start-2">Kanji list</MyHeader>
      <MyHeader nocenter :size="2" class="text-right">Total kanji: {{ getKanjiInList() }}</MyHeader>
    </div>
    <KanjiSorterDisplay :results="false" />
    <div class="grid grid-cols-4 gap-4 justify-around">
      <MyButton :onClick="onLoad" disabled class="w-full">Load</MyButton>
      <MyButton :onClick="onSave" disabled class="w-full">Save</MyButton>
      <MyButton :onClick="onDeleteSave" disabled class="w-full">Delete save</MyButton>
      <MyButton :onClick="onClear" class="w-full">Clear</MyButton>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { mapGetters, mapActions } from 'vuex';

  export default Vue.extend({
    name: 'List',
    computed: {
      ...mapGetters(['getKanjiInList']),
    },
    methods: {
      onLoad() {},
      onSave() {},
      onDeleteSave() {},
      onClear() {
        this.clearKanjiList();
      },

      ...mapActions(['clearKanjiList']),
    },
  });
</script>

<style lang="postcss" scoped></style>
