<script setup lang="ts">
import { useKanjiSorterStore } from '~~/stores/KanjiSorterStore';
import { ImportType } from '~/helpers/enums/importType';

const ksS = useKanjiSorterStore();

const emit = defineEmits<{
  (e: 'close', importList: string): void;
}>();

type JLPTLevel = 'n5' | 'n4' | 'n3' | 'n2' | 'n1';

const selected = ref(ImportType.Newspapers);
const jlptLevel = ref<JLPTLevel>('n5');
const inclusive = ref(false);
const chars = ref<number>(null);
const maxChars = ref(0);
const reversed = ref(false);

const isStaticList = computed(() => selected.value === ImportType.JLPT);

const changeJlptLevel = (newLevel: JLPTLevel) => {
  jlptLevel.value = newLevel;
  updateMaxChars();
};

const changeSel = (newSel: ImportType) => {
  selected.value = newSel;

  updateMaxChars();
};

const changeInclusive = (newInclusive: boolean) => {
  inclusive.value = newInclusive;
  updateMaxChars();
};

const changeReversed = (value: boolean) => {
  reversed.value = value;
};

const updateMaxChars = () => {
  if (selected.value !== ImportType.JLPT) {
    maxChars.value = ksS.kanjiLists[selected.value].length;
  } else {
    if (!inclusive.value) {
      maxChars.value = ksS.kanjiLists.jlpt[jlptLevel.value].length;
    } else {
      let tempMaxChars = 0;
      for (let i = 5; i >= parseInt(jlptLevel.value[1]); i--)
        tempMaxChars += ksS.kanjiLists.jlpt[`n${i}`].length;
      maxChars.value = tempMaxChars;
    }
  }
};

const onImport = () => {
  let importList = '';

  if (isStaticList.value) {
    if (selected.value !== ImportType.JLPT) importList = ksS.kanjiLists[selected.value];
    else if (!inclusive.value) {
      importList = ksS.kanjiLists.jlpt[jlptLevel.value];
    } else {
      for (let i = 5; i >= parseInt(jlptLevel.value[1]); i--)
        importList += ksS.kanjiLists.jlpt[`n${i}`] + '\n\n';
    }
  } else {
    // @ts-ignore
    if (reversed.value) importList = ksS.kanjiLists[selected.value].split('').reverse().join('');
    // @ts-ignore
    else importList = ksS.kanjiLists[selected.value];

    importList = importList.slice(0, chars.value !== null ? chars.value : maxChars.value);
  }

  emit('close', importList);
};

changeSel(selected.value);
</script>

<template>
  <Modal title="Select list to import" size="sm" @close="$emit('close')">
    <div class="flex flex-col items-center">
      <div class="w-full max-w-lg mx-auto px-3 flex flex-col items-center gap-2 md:gap-3">
        <SelectionButton
          @click="changeSel(ImportType.Newspapers)"
          :selected="selected === ImportType.Newspapers"
        >
          Kanji by frequency of use in newspapers
        </SelectionButton>
        <SelectionButton @click="changeSel(ImportType.Novels)" :selected="selected === ImportType.Novels">
          Kanji by frequency of use in novels
        </SelectionButton>
        <SelectionButton
          @click="changeSel(ImportType.StrokeCount)"
          :selected="selected === ImportType.StrokeCount"
        >
          Kanji by stroke count
        </SelectionButton>
        <SelectionButton @click="changeSel(ImportType.JLPT)" :selected="selected === ImportType.JLPT">
          Kanji from JLPT level
        </SelectionButton>
        <div v-if="selected === ImportType.JLPT" class="input-row my-1 md:my-2">
          <select
            name="jlpt_level"
            id="jlpt_level"
            :value="jlptLevel"
            @change="(e: any) => changeJlptLevel(e.target.value)"
            class="w-max px-3"
          >
            <option value="n5">N5</option>
            <option value="n4">N4</option>
            <option value="n3">N3</option>
            <option value="n2">N2</option>
            <option value="n1">N1</option>
          </select>
          <MyCheckbox
            name="inclusive_import"
            text="Inclusive"
            :checked="inclusive"
            :disabled="jlptLevel === 'n5'"
            @change="(val) => changeInclusive(val)"
          />
        </div>
        <SelectionButton @click="changeSel(ImportType.Joyo)" :selected="selected === ImportType.Joyo">
          Jōyō kanji list
        </SelectionButton>
        <SelectionButton
          @click="changeSel(ImportType.FullLibrary)"
          :selected="selected === ImportType.FullLibrary"
        >
          Full kanji library
        </SelectionButton>
        <h4 v-if="isStaticList" class="mt-3"># of characters: {{ maxChars }}</h4>
        <template v-else>
          <div class="input-row my-1 md:my-2">
            <div class="flex flex-col items-center gap-2">
              <h4># of characters:</h4>
              <p class="big-p hidden md:block">Max: {{ maxChars }}</p>
            </div>
            <NumberInput
              name="max_chars"
              placeholder="All"
              v-model="chars"
              :default="maxChars"
              :min="1"
              :max="maxChars"
              class="w-28"
            />
          </div>
          <MyCheckbox
            name="import_reversed"
            text="Reversed"
            :disabled="isStaticList"
            :checked="reversed"
            @change="changeReversed"
          />
        </template>
      </div>

      <MyButton size="md" @click="onImport" class="mt-3 md:mt-6">Import</MyButton>
    </div>
  </Modal>
</template>

<style lang="postcss" scoped>
.input-row {
  @apply w-full flex flex-wrap justify-around items-center gap-3 md:justify-center md:gap-10;
}
</style>
