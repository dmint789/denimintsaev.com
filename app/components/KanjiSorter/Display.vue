<template>
  <div>
    <div class="w-full h-80 mt-2 text-xl">
      <div v-if="getView(results) === 'default'" class="overflow-auto w-full h-full border-2 border-black">
        <table class="w-full table-auto">
          <thead class="box-border border-b-2 border-mygray-500">
            <tr class="table-headings bg-white">
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
            <KanjiRow
              v-for="(k, index) in getSorted(results)"
              :key="index + 1"
              :kanji="k"
              :showAll="getRepeats()"
            />
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
        class="big-input-output-box h-full resize-none"
      >
      </textarea>
    </div>
    <div class="my-4 flex items-start">
      <div class="mr-1 flex-1 text-xl">
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
      <div class="dropdown-container">
        <MyHeader :size="2">Sort type</MyHeader>
        <select
          :name="prefix('sort_type')"
          :id="prefix('sort_type')"
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
      <div class="dropdown-container">
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
    <div class="mb-6 flex flex-wrap justify-around items-center gap-4">
      <MyCheckbox
        v-if="results"
        :name="prefix('repeats')"
        text="Show repeats"
        :checked="getRepeats()"
        :disabled="getSortType(true) !== 'textorder'"
        @change="(val) => changeRepeats(val)"
      />
      <MyCheckbox
        :name="prefix('reversed')"
        text="Reversed"
        :checked="getReversed(results)"
        @change="(value) => changeReversed({ results, value })"
      />
      <MyCheckbox
        :name="prefix('negative_filter')"
        text="Negative filter"
        :checked="getNegativeFilter(results)"
        @change="(value) => changeNegativeFilter({ results, value })"
      />
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
        return `${this.results ? 'results' : 'list'}_${input}`;
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

<style lang="postcss" scoped>
  .dropdown-container {
    @apply pl-3;

    flex: 2;
  }
</style>
