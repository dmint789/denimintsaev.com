<template>
  <div class="mt-3 md:mt-6">
    <MyHeader :size="3">Result</MyHeader>
    <div class="p-2 flex justify-between items-center text-2xl">
      <MyCheckbox name="update" text="Update" labelLeft :checked="getUpdate()" @change="(val) => changeUpdate(val)" />
      <MyHeader nocenter :size="2">Unique: {{ getUniqueKanji() }} | Total: {{ getTotalKanji() }}</MyHeader>
    </div>
    <KanjiSorterDisplay :results="true" />
    <div class="grid grid-cols-2 gap-4">
      <MyButton @click="onAddToList" size="full">Add to list</MyButton>
      <MyButton @click="onClear" size="full">Clear</MyButton>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { mapGetters, mapActions } from 'vuex';

  export default Vue.extend({
    name: 'Output',
    computed: {
      ...mapGetters(['getUniqueKanji', 'getTotalKanji', 'getUpdate']),
    },
    methods: {
      onAddToList() {
        this.addToList();
      },
      onClear() {
        this.reset();
      },

      ...mapActions(['changeUpdate', 'addToList', 'reset']),
    },
  });
</script>

<style lang="postcss" scoped></style>
