<template>
  <div class="mt-6">
    <div class="grid grid-cols-3 justify-between items-center">
      <h2 class="text-2xl">Unique: {{ getUniqueKanji() }} | Total: {{ getTotalKanji() }}</h2>
      <MyHeader :size="3" class="col-start-2">Result</MyHeader>
      <div class="flex justify-end items-center gap-3">
        <label for="update" class="text-2xl">Update</label>
        <input
          type="checkbox"
          id="update"
          name="update"
          @change="(e) => onChangeUpdate(e.target.checked)"
          :checked="getUpdate()"
          class="w-5 h-5"
        />
      </div>
    </div>
    <KanjiSorterDisplay :results="true" />
    <div class="mb-4 grid grid-cols-2 gap-4">
      <MyButton black :onClick="onAddToList" class="w-full">Add to list</MyButton>
      <MyButton black :onClick="onClear" class="w-full">Clear</MyButton>
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
