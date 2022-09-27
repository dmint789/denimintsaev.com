<template>
  <div class="mt-6 mb-12">
    <div class="grid grid-cols-3 justify-between items-center">
      <h2 class="text-2xl">Total kanji: {{ getKanjiInList() }}</h2>
      <MyHeader :size="3" class="col-start-2">Kanji list</MyHeader>
    </div>
    <KanjiSorterDisplay :results="false" />
    <div class="grid grid-cols-4 gap-4 justify-around">
      <MyButton black :onClick="onLoad" class="w-full">Load</MyButton>
      <MyButton black :onClick="onSave" class="w-full">Save</MyButton>
      <MyButton black :onClick="onDeleteSave" class="w-full">Delete save</MyButton>
      <MyButton black :onClick="onClear" class="w-full">Clear</MyButton>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { mapGetters } from 'vuex';

  export default Vue.extend({
    name: 'List',
    computed: {
      ...mapGetters(['getKanjiInList']),
    },
    methods: {
      onLoad() {},
      onSave() {},
      onDeleteSave() {},
      onClear() {},
    },
  });
</script>

<style lang="postcss" scoped></style>
