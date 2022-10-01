<template>
  <div class="mt-6 mb-6">
    <div class="p-2 flex justify-end md:grid md:grid-cols-3 md:justify-between items-center">
      <MyHeader nocenter :size="3" class="mx-auto">Kanji list</MyHeader>
      <h2 class="text-2xl">Total kanji: {{ getKanjiInList() }}</h2>
    </div>
    <KanjiSorterDisplay :results="false" />
    <div class="grid grid-cols-4 gap-4 justify-around">
      <MyButton black :onClick="onLoad" disabled class="w-full">Load</MyButton>
      <MyButton black :onClick="onSave" disabled class="w-full">Save</MyButton>
      <MyButton black :onClick="onDeleteSave" disabled class="w-full">Delete save</MyButton>
      <MyButton black :onClick="onClear" class="w-full">Clear</MyButton>
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
