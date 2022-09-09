<template>
  <div class="mt-6 mb-12">
    <div class="grid grid-cols-3 justify-between items-center">
      <h2 class="text-2xl">Unique: {{ getUniqueKanji() }} | Total: {{ getTotalKanji() }}</h2>
      <MyHeader :size="3" class="col-start-2">Result</MyHeader>
      <div class="flex justify-end items-center gap-3">
        <label for="update" class="text-2xl">Update</label>
        <input
          type="checkbox"
          id="update"
          name="update"
          @change="(e) => setValue({ field: 'update', value: e.target.checked })"
          :checked="getUpdate()"
          class="w-5 h-5"
        />
      </div>
    </div>
    <div class="w-full h-80 mt-4 px-2 py-1 text-xl border-2 border-black">
      <div v-if="getView() === 'default'" class="w-full h-full pr-2 overflow-auto">
        <table class="w-full table-auto">
          <tr>
            <th>#</th>
            <th>Kanji</th>
            <th>Occurrences</th>
            <th>Newspaper Rank</th>
            <th>Novel Rank</th>
            <th>Strokes</th>
            <th>JLPT</th>
            <th>Jōyō</th>
          </tr>
          <KanjiRow v-for="(k, index) in getSorted()" :key="index" :kanji="k" />
        </table>
      </div>
      <textarea
        v-if="getView() === 'kanjionly'"
        name="inputtext"
        placeholder="Result"
        :value="getKanjiOnly()"
        class="w-full h-full max-h-80 px-3 py-2 text-2xl items-start hover:bg-mygray-50"
      >
      </textarea>
    </div>
    <div class="mb-8 grid grid-cols-5">
      <div class="text-xl">
        <MyHeader :size="2">View</MyHeader>
        <div class="mx-auto mt-2 w-max">
          <div class="flex items-center mb-2">
            <input
              type="radio"
              name="view"
              id="default"
              value="default"
              @change="(e) => changeView(e.target.value)"
              :checked="getView() === 'default'"
              class="w-5 h-5 mr-2"
            />
            <label for="default">Default</label>
          </div>
          <div class="flex items-center">
            <input
              type="radio"
              name="view"
              id="kanjionly"
              value="kanjionly"
              @change="(e) => changeView(e.target.value)"
              :checked="getView() === 'kanjionly'"
              class="w-5 h-5 mr-2"
            />
            <label for="kanjionly">Kanji only</label>
          </div>
        </div>
      </div>
      <div class="col-span-2 px-4">
        <MyHeader :size="2">Sort type</MyHeader>
        <select
          name="sorttype"
          id="sorttype"
          :value="getSortType()"
          @change="(e) => changeSortType(e.target.value)"
          class="mt-4 w-full h-12 px-1 border-2 border-black text-xl"
        >
          <option value="textorder">Text order</option>
          <option value="occurrences"># of occurrences in the text</option>
          <option value="newspapers">Freq. of use in newspapers</option>
          <option value="novels">Freq. of use in novels</option>
          <option value="strokecount">Stroke count</option>
          <option value="jlpt">JLPT</option>
        </select>
      </div>
      <div class="col-span-2">
        <MyHeader :size="2">Filter</MyHeader>
        <select
          name="filter"
          id="filter"
          :value="getFilterType()"
          @change="(e) => changeFilterType(e.target.value)"
          class="mt-4 w-full h-12 px-1 border-2 border-black text-xl"
        >
          <option value="none">None</option>
          <option value="joyo">Jōyō kanji</option>
          <option value="n5">JLPT N5</option>
          <option value="n4">JLPT N4</option>
          <option value="n3">JLPT N3</option>
          <option value="n2">JLPT N2</option>
          <option value="n1">JLPT N1</option>
          <option value="list">Kanji list</option>
          <option value="input">Kanji from input</option>
        </select>
      </div>
    </div>
    <div class="mb-4 grid grid-cols-4 gap-4">
      <div class="flex items-center gap-3">
        <input
          type="checkbox"
          id="repeats"
          name="repeats"
          @change="(e) => changeRepeats(e.target.checked)"
          :checked="getRepeats()"
          :disabled="getSortType() !== 'textorder'"
          class="w-5 h-5"
        />
        <label
          for="repeats"
          class="text-2xl"
          :class="getSortType() === 'textorder' ? 'text-black' : 'text-mygray-600'"
          >Show repeats</label
        >
      </div>
      <div class="ml-4 flex items-center gap-3">
        <input
          type="checkbox"
          id="reversed"
          name="reversed"
          @change="(e) => changeReversed(e.target.checked)"
          :checked="getReversed()"
          class="w-5 h-5"
        />
        <label for="reversed" class="text-2xl">Reversed</label>
      </div>
      <MyButton black :onClick="onAddToList" class="w-full">Add to list</MyButton>
      <MyButton black :onClick="onClear" class="w-full">Clear</MyButton>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { mapGetters, mapMutations, mapActions } from 'vuex';

  export default Vue.extend({
    name: 'KanjiSorterOutput',
    computed: {
      ...mapGetters([
        'getSorted',
        'getUniqueKanji',
        'getTotalKanji',
        'getView',
        'getSortType',
        'getFilterType',
        'getRepeats',
        'getReversed',
        'getUpdate',
        'getKanjiOnly',
      ]),
    },
    methods: {
      onAddToList() {},
      onClear() {
        this.reset();
      },

      ...mapMutations(['setValue']),
      ...mapActions([
        'changeView',
        'changeSortType',
        'changeFilterType',
        'changeRepeats',
        'changeReversed',
        'reset',
      ]),
    },
  });
</script>

<style lang="postcss" scoped></style>
