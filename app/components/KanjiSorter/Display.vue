<template>
  <div>
    <div class="w-full h-80 mt-4 px-2 py-1 text-xl border-2 border-black">
      <div v-if="getView(results) === 'default'" class="w-full h-full pr-2 overflow-auto">
        <table class="relative w-full table-auto">
          <thead class="sticky box-border top-0 py-4 border-b-2 border-mygray-500 bg-white">
            <tr class="table-headings py-4 bg-white">
              <th>#</th>
              <th>Kanji</th>
              <th v-if="results">Occurrences</th>
              <th>Newspaper Rank</th>
              <th>Novel Rank</th>
              <th>Strokes</th>
              <th>JLPT</th>
              <th>Jōyō</th>
            </tr>
          </thead>
          <tbody>
            <KanjiRow v-for="(k, index) in getSorted(results)" :key="index + 1" :kanji="k" :showAll="getRepeats()" />
            <tr v-if="getUnsorted(results).length > 0">
              <th colspan="8" class="py-2 border-t-2 border-b-2">Unsorted</th>
            </tr>
            <KanjiRow v-for="(k, index) in getUnsorted(results)" :key="-index - 1" :kanji="k" />
          </tbody>
        </table>
      </div>
      <textarea
        v-else
        name="resulttext"
        placeholder="Result"
        :value="getKanjiOnly(results)"
        disabled
        class="w-full h-full max-h-80 px-3 py-2 text-2xl items-start hover:bg-mygray-50"
      >
      </textarea>
    </div>
    <div class="mb-4 grid grid-cols-5">
      <div class="text-xl">
        <MyHeader :size="2">View</MyHeader>
        <div class="mx-auto mt-2 w-max">
          <div class="flex items-center mb-2">
            <input
              type="radio"
              :name="prefix('view')"
              :id="prefix('default')"
              value="default"
              @change="(e) => changeView({ results, value: e.target.value })"
              :checked="getView(results) === 'default'"
              class="w-5 h-5 mr-2"
            />
            <label :for="prefix('default')">Default</label>
          </div>
          <div class="flex items-center">
            <input
              type="radio"
              :name="prefix('view')"
              :id="prefix('kanjionly')"
              value="kanjionly"
              @change="(e) => changeView({ results, value: e.target.value })"
              :checked="getView(results) === 'kanjionly'"
              class="w-5 h-5 mr-2"
            />
            <label :for="prefix('kanjionly')">Kanji only</label>
          </div>
        </div>
      </div>
      <div class="col-span-2 px-4">
        <MyHeader :size="2">Sort type</MyHeader>
        <select
          :name="prefix('sorttype')"
          :id="prefix('sorttype')"
          :value="getSortType(results)"
          @change="(e) => changeSortType({ results, value: e.target.value })"
          class="mt-4 w-full h-12 px-1 border-2 border-black text-xl"
        >
          <option v-if="results" value="textorder">Text order</option>
          <option v-if="results" value="occurrences"># of occurrences in the text</option>
          <option value="newspapers">Freq. of use in newspapers</option>
          <option value="novels">Freq. of use in novels</option>
          <option value="strokecount">Stroke count</option>
          <option value="jlpt">JLPT</option>
        </select>
      </div>
      <div class="col-span-2">
        <MyHeader :size="2">Filter</MyHeader>
        <select
          :name="prefix('filter')"
          :id="prefix('filter')"
          :value="getFilterType(results)"
          @change="(e) => changeFilterType({ results, value: e.target.value })"
          class="mt-4 w-full h-12 px-1 border-2 border-black text-xl"
        >
          <option value="none">None</option>
          <option value="joyo">Jōyō kanji</option>
          <option value="n5">JLPT N5</option>
          <option value="n4">JLPT N4</option>
          <option value="n3">JLPT N3</option>
          <option value="n2">JLPT N2</option>
          <option value="n1">JLPT N1</option>
          <option v-if="results" value="list">Kanji list</option>
        </select>
      </div>
    </div>
    <div class="mb-6 grid gap-4" :class="results ? 'grid-cols-3' : 'grid-cols-2'">
      <div v-if="results" class="flex items-center gap-3">
        <input
          type="checkbox"
          :id="prefix('repeats')"
          :name="prefix('repeats')"
          @change="(e) => changeRepeats(e.target.checked)"
          :checked="getRepeats()"
          :disabled="getSortType(true) !== 'textorder'"
          class="w-5 h-5"
        />
        <label
          :for="prefix('repeats')"
          class="text-2xl"
          :class="getSortType(results) === 'textorder' ? 'text-black' : 'text-mygray-600'"
          >Show repeats</label
        >
      </div>
      <div class="ml-4 flex items-center gap-3">
        <input
          type="checkbox"
          :id="prefix('reversed')"
          :name="prefix('reversed')"
          @change="(e) => changeReversed({ results, value: e.target.checked })"
          :checked="getReversed(results)"
          class="w-5 h-5"
        />
        <label :for="prefix('reversed')" class="text-2xl">Reversed</label>
      </div>
      <div class="ml-4 flex items-center gap-3">
        <input
          type="checkbox"
          :id="prefix('negativefilter')"
          :name="prefix('negativefilter')"
          @change="(e) => changeNegativeFilter({ results, value: e.target.checked })"
          :checked="getNegativeFilter(results)"
          class="w-5 h-5"
        />
        <label :for="prefix('negativefilter')" class="text-2xl">Negative Filter</label>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { mapGetters, mapActions } from 'vuex';

  export default Vue.extend({
    name: 'Display',
    props: {
      // Whether or not this is a display for the results (as opposed to the kanji list)
      results: {
        type: Boolean,
        required: true,
      },
    },
    computed: {
      ...mapGetters([
        'getView',
        'getSorted',
        'getUnsorted',
        'getKanjiOnly',
        'getSortType',
        'getRepeats',
        'getReversed',
        'getNegativeFilter',
        'getFilterType',
      ]),
    },
    methods: {
      prefix(input: string): string {
        return (this.results ? 'results' : 'list') + input;
      },

      ...mapActions([
        'changeView',
        'changeRepeats',
        'changeReversed',
        'changeSortType',
        'changeFilterType',
        'changeNegativeFilter',
      ]),
    },
  });
</script>

<style lang="postcss" scoped></style>
