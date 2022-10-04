<template>
  <div class="mt-3 md:mt-6">
    <MyHeader :size="3">Result</MyHeader>
    <div class="p-2 flex justify-between items-center text-2xl">
      <div class="cb-and-label">
        <label for="update">Update</label>
        <input
          type="checkbox"
          id="update"
          name="update"
          @change="(e) => onChangeUpdate(e.target.checked)"
          :checked="getUpdate()"
          class="w-5 h-5"
        />
      </div>
      <MyHeader nocenter :size="2">Unique: {{ getUniqueKanji() }} | Total: {{ getTotalKanji() }}</MyHeader>
    </div>
    <KanjiSorterDisplay :results="true" />
    <div class="grid grid-cols-2 gap-4">
      <MyButton :onClick="onAddToList" class="w-full">Add to list</MyButton>
      <MyButton :onClick="onClear" class="w-full">Clear</MyButton>
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
      onChangeUpdate(value: boolean) {
        this.changeUpdate(value);
      },
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
