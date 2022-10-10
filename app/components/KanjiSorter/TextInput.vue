<template>
  <div>
    <KanjiSorterAboutModal v-if="isAboutOpen" @close="isAboutOpen = false" />
    <KanjiSorterImportListModal v-if="isImportListOpen" @close="(list) => importList(list)" />

    <div class="mt-3 md:mt-4 flex flex-wrap justify-between items-center gap-3 md:grid md:grid-cols-3">
      <MyHeader :size="3" class="md:col-start-2">Enter Text</MyHeader>
      <div class="h-14 flex justify-end items-center gap-2">
        <MyButton @click="isAboutOpen = true" size="xs">About</MyButton>
        <a href="https://www.patreon.com/denimintsaev" target="_blank" class="flex-shrink-0 h-full">
          <img src="~/static/patreon_logo.png" alt="Patreon Logo" class="h-full" />
        </a>
      </div>
    </div>
    <textarea
      name="input_text"
      placeholder="Enter text here"
      v-model="inputBox"
      @change="onUpdateInput"
      class="big-input-output-box h-80 my-4 text-xl md:text-2xl"
    ></textarea>
    <div class="custom-grid gap-2 md:gap-4">
      <MyButton @click="onGetKanji" size="md" class="w-full">Get kanji</MyButton>
      <div class="relative">
        <!-- The 1.75rem is half of the default height of a MyButton -->
        <svg height="80" width="50" class="absolute" style="left: -24px; top: 1.75rem; z-index: -1">
          <line x1="0" y1="1" x2="50" y2="1" style="stroke: black; stroke-width: 2" />
          <line x1="25" y1="1" x2="25" y2="80" style="stroke: black; stroke-width: 2" />
        </svg>
      </div>
      <MyButton @click="() => onGetKanji(true)" size="md" class="w-full">Get new kanji</MyButton>
      <MyButton @click="onClear" size="md" class="w-full">Clear</MyButton>
      <MyButton @click="onImportList" size="md" class="w-full">Import list</MyButton>
      <div
        class="col-span-3 mx-auto py-2 px-2 md:px-3 flex justify-center gap-2 md:gap-3 text-lg md:text-xl bg-white border-2 border-black"
      >
        <div class="flex items-center">
          <label for="replace">Replace</label>
          <input
            type="radio"
            name="mode"
            id="replace"
            value="replace"
            @change="(e) => setMode(e.target.value)"
            :checked="getMode() === 'replace'"
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
            @change="(e) => setMode(e.target.value)"
            :checked="getMode() === 'add'"
            class="w-5 h-5 ml-2"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { mapGetters, mapMutations, mapActions } from 'vuex';

  export default Vue.extend({
    name: 'TextInput',
    data() {
      return {
        inputBox: '',
        isInputNew: true,
        isAboutOpen: false,
        isImportListOpen: false,
      };
    },
    computed: {
      ...mapGetters(['getMode']),
    },
    methods: {
      onUpdateInput() {
        this.isInputNew = true;
      },
      onGetKanji(newK = false) {
        if (this.inputBox && (this.getMode === 'add' || this.isInputNew)) {
          this.getKanji({ input: this.inputBox, newK });

          if (this.getMode === 'replace') this.isInputNew = false;
        }
      },
      onClear() {
        this.inputBox = '';
        this.isInputNew = true;
      },
      onImportList() {
        this.isImportListOpen = !this.isImportListOpen;
      },
      importList(list: string) {
        if (list) {
          this.inputBox = list;
          this.isInputNew = true;
        }

        this.isImportListOpen = false;
      },

      ...mapMutations(['setMode']),
      ...mapActions(['getKanji']),
    },
  });
</script>

<style lang="postcss" scoped>
  .custom-grid {
    display: grid;
    grid-template-columns: 1fr 0 1fr 1fr 1fr;
    justify-content: space-around;
  }
</style>
