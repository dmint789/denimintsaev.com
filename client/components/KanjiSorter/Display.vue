<script setup lang="ts">
import { useKanjiSorterStore } from '~~/stores/KanjiSorterStore';
import { ListType, ViewType } from '~/helpers/enums/index';

const ksS = useKanjiSorterStore();

const props = defineProps<{
  listType: ListType;
}>();

const isResults = props.listType === 'results';

const onChangeView = (value: ViewType) => {
  ksS[`${props.listType}Settings`].view = value;
};
</script>

<template>
  <div>
    <div class="w-full h-80 mt-2 text-xl">
      <div
        v-if="ksS[`${listType}Settings`].view === 'default'"
        class="overflow-auto w-full h-full border-2 border-black"
      >
        <table class="w-full table-auto">
          <thead class="box-border border-b-2 border-mygray-500">
            <tr class="table-headings bg-white">
              <th>#</th>
              <th>Kanji</th>
              <th v-if="isResults">Occurrences</th>
              <th>Newspaper Rank</th>
              <th>Novel Rank</th>
              <th>Strokes</th>
              <th>JLPT</th>
              <th>Jōyō</th>
            </tr>
          </thead>
          <tbody>
            <KanjiRow
              v-for="(kanji, i) in ksS[listType].sorted"
              :key="i + 1"
              :kanji="kanji"
              :showAll="ksS.resultsSettings.repeats"
            />
            <tr v-if="ksS[listType].unsorted.length > 0">
              <th colspan="8" class="py-2 border-t-2 border-b-2">Unsorted</th>
            </tr>
            <KanjiRow v-for="(kanji, i) in ksS[listType].unsorted" :key="-i - 1" :kanji="kanji" />
          </tbody>
        </table>
      </div>
      <textarea
        v-else
        name="result_text"
        placeholder="Result"
        :value="ksS.getKanjiOnly(listType)"
        disabled
        class="big-input-output-box h-full resize-none text-xl md:text-2xl"
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
              :name="`${listType}_view`"
              :id="`${listType}_default`"
              value="default"
              @change="(e: any) => onChangeView(e.target.value)"
              :checked="ksS[`${listType}Settings`].view === 'default'"
              class="w-5 h-5 mr-2"
            />
            <label :for="`${listType}_default`">Default</label>
          </div>
          <div class="flex items-center">
            <input
              type="radio"
              :name="`${listType}_view`"
              :id="`${listType}_kanjionly`"
              value="kanjionly"
              @change="(e: any) => onChangeView(e.target.value)"
              :checked="ksS[`${listType}Settings`].view === 'kanjionly'"
              class="w-5 h-5 mr-2"
            />
            <label :for="`${listType}_kanjionly`">Kanji only</label>
          </div>
        </div>
      </div>
      <div class="dropdown-container">
        <MyHeader :size="2">Sort type</MyHeader>
        <select
          :name="`${listType}_sort_type`"
          :id="`${listType}_sort_type`"
          :value="ksS[`${listType}Settings`].sortType"
          @change="(e: any) => ksS.changeSortType(listType, e.target.value)"
          class="mt-4 w-full h-12 px-1 border-2 border-black text-xl"
        >
          <option v-if="isResults" value="textorder">Text order</option>
          <option v-if="isResults" value="occurrences"># of occurrences in the text</option>
          <option value="newspapers">Freq. of use in newspapers</option>
          <option value="novels">Freq. of use in novels</option>
          <option value="strokecount">Stroke count</option>
          <option value="jlpt">JLPT</option>
        </select>
      </div>
      <div class="dropdown-container">
        <MyHeader :size="2">Filter</MyHeader>
        <select
          :name="`${listType}_filter`"
          :id="`${listType}_filter`"
          :value="ksS[`${listType}Settings`].filterType"
          @change="(e: any) => ksS.changeFilterType(listType, e.target.value)"
          class="mt-4 w-full h-12 px-1 border-2 border-black text-xl"
        >
          <option value="none">None</option>
          <option value="joyo">Jōyō kanji</option>
          <option value="n5">JLPT N5</option>
          <option value="n4">JLPT N4</option>
          <option value="n3">JLPT N3</option>
          <option value="n2">JLPT N2</option>
          <option value="n1">JLPT N1</option>
          <option v-if="isResults" value="list">Kanji list</option>
        </select>
      </div>
    </div>
    <div class="mb-6 flex flex-wrap justify-around items-center gap-4">
      <MyCheckbox
        v-if="isResults"
        :name="`${listType}_repeats`"
        text="Show repeats"
        :checked="ksS.resultsSettings.repeats"
        :disabled="ksS.resultsSettings.sortType !== 'textorder'"
        @change="(val) => ksS.changeRepeats(val)"
      />
      <MyCheckbox
        :name="`${listType}_reversed`"
        text="Reversed"
        :checked="ksS[`${listType}Settings`].reversed"
        @change="(val) => ksS.changeReversed(listType, val)"
      />
      <MyCheckbox
        :name="`${listType}_negative_filter`"
        text="Negative filter"
        :checked="ksS[`${listType}Settings`].negativeFilter"
        @change="(val) => ksS.changeNegativeFilter(listType, val)"
      />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.dropdown-container {
  @apply pl-3;

  flex: 2;
}
</style>
