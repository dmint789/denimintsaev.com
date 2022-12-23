<script setup lang="ts">
import { useKanjiSorterStore } from '~/stores/KanjiSorterStore';
import { Mode } from '~/helpers/enums/index';

const ksS = useKanjiSorterStore();

const inputBox = ref('');
const isInputNew = ref(true);
const lastNewK = ref<boolean>(null);
const isAboutOpen = ref(false);
const isImportListOpen = ref(false);

const onUpdateInput = () => {
  isInputNew.value = true;
};

const handleShortcuts = (e: any) => {
  if ((e.key === 'y' || e.key === ';') && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    onGetKanji(e.key === ';');
  }
};

const onGetKanji = (newK = false) => {
  // Check that the input isn't empty and that we are adding kanji or something has changed since last time
  if (inputBox.value && (ksS.mode === Mode.Add || isInputNew.value || newK !== lastNewK.value)) {
    ksS.sortResults(inputBox.value, newK);

    lastNewK.value = newK;
    if (ksS.mode === Mode.Replace) isInputNew.value = false;
  }
};

const onClear = () => {
  inputBox.value = '';
  isInputNew.value = true;
};

const setIsAboutOpen = (value: boolean) => {
  isAboutOpen.value = value;
};

const onImportList = () => {
  isImportListOpen.value = !isImportListOpen.value;
};

const importList = (list: string) => {
  if (list) {
    inputBox.value = list;
    isInputNew.value = true;
  }

  isImportListOpen.value = false;
};

const onModeChange = (value: Mode) => {
  ksS.mode = value;
};
</script>

<template>
  <div>
    <KanjiSorterAboutModal v-if="isAboutOpen" @close="setIsAboutOpen(false)" />
    <KanjiSorterImportListModal v-if="isImportListOpen" @close="(list) => importList(list)" />

    <div class="mt-3 md:mt-4 flex flex-wrap justify-between items-center gap-3 md:grid md:grid-cols-3">
      <MyHeader :size="3" class="md:col-start-2">Enter Text</MyHeader>
      <div class="h-14 flex justify-end items-center gap-2">
        <MyButton @click="setIsAboutOpen(true)" size="xs">About</MyButton>
        <a href="https://www.patreon.com/denimintsaev" target="_blank" class="flex-shrink-0 h-full">
          <img src="/patreon_logo.png" alt="Patreon Logo" class="h-full" />
        </a>
      </div>
    </div>
    <textarea
      name="input_text"
      placeholder="Enter text here"
      v-model="inputBox"
      @change="onUpdateInput"
      @keydown="handleShortcuts"
      class="big-input-output-box min-h-[8rem] h-52 max-h-96 my-4 text-xl md:text-2xl"
    ></textarea>
    <div class="custom-grid gap-2 md:gap-4">
      <MyButton @click="onGetKanji" size="md" title="Ctrl-y" class="z-10 w-full">Get kanji</MyButton>
      <div class="relative">
        <!-- The 1.75rem is half of the default height of a MyButton -->
        <svg height="80" width="50" class="absolute" style="left: -24px; top: 1.75rem">
          <line x1="0" y1="1" x2="50" y2="1" style="stroke: black; stroke-width: 2" />
          <line x1="25" y1="1" x2="25" y2="80" style="stroke: black; stroke-width: 2" />
        </svg>
      </div>
      <MyButton @click="onGetKanji(true)" size="md" title="Ctrl-;" class="z-10 w-full"
        >Get new kanji</MyButton
      >
      <MyButton @click="onClear" size="md" class="w-full">Clear</MyButton>
      <MyButton @click="onImportList" size="md" class="w-full">Import list</MyButton>
      <div
        class="col-span-3 z-10 mx-auto py-2 px-2 md:px-3 flex justify-center gap-2 md:gap-3 text-lg md:text-xl bg-white border-2 border-black"
      >
        <div class="flex items-center">
          <label for="replace">Replace</label>
          <input
            type="radio"
            name="mode"
            id="replace"
            value="replace"
            @change="(e: any) => onModeChange(e.target.value)"
            :checked="ksS.mode === Mode.Replace"
            class="w-5 h-5 ml-2"
          />
        </div>
        <div class="flex items-center">
          <label for="add">Add</label>
          <input
            type="radio"
            name="mode"
            id="add"
            value="add"
            @change="(e: any) => onModeChange(e.target.value)"
            :checked="ksS.mode === 'add'"
            class="w-5 h-5 ml-2"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.custom-grid {
  display: grid;
  grid-template-columns: 1fr 0 1fr 1fr 1fr;
  justify-content: space-around;
}
</style>
