<template>
  <div>
    <div class="mt-4 grid grid-cols-3 items-center">
      <MyHeader :size="3" class="col-start-2">Enter Text</MyHeader>
      <div class="h-14 flex justify-end items-center gap-2">
        <MyButton black :onClick="onClickAbout">About</MyButton>
        <NuxtLink to="/patreon" class="h-full">
          <img src="../../static/patreon_logo.png" alt="Patreon Logo" class="h-full" />
        </NuxtLink>
      </div>
    </div>
    <textarea
      name="inputtext"
      placeholder="Enter text here"
      v-model="inputBox"
      @change="onUpdateInput"
      class="w-full h-80 max-h-80 my-4 px-3 py-2 text-2xl items-start border-2 border-black hover:bg-mygray-50"
    ></textarea>
    <div class="grid grid-cols-4 gap-4 justify-around">
      <div class="flex">
        <MyButton black :onClick="onGetKanji" class="w-full">Get kanji</MyButton>
        <div class="relative">
          <svg height="80" width="50" class="absolute" style="left: -17px; top: 25px; z-index: -1">
            <line x1="0" y1="1" x2="50" y2="1" style="stroke: black; stroke-width: 2" />
            <line x1="25" y1="1" x2="25" y2="80" style="stroke: black; stroke-width: 2" />
          </svg>
        </div>
      </div>
      <MyButton black :onClick="onGetNewKanji" class="w-full">Get new kanji</MyButton>
      <MyButton black :onClick="onClear" class="w-full">Clear</MyButton>
      <MyButton black :onClick="onAddToList" class="w-full">Add to list</MyButton>
      <div
        class="col-span-2 w-3/5 min-w-min p-1 mx-auto flex justify-center items-center text-xl bg-white border-2 border-black"
      >
        <div class="mr-4 flex items-center">
          <label for="replace">Replace</label>
          <input
            type="radio"
            name="mode"
            id="replace"
            value="replace"
            @change="(e) => setValue({ field: 'mode', value: e.target.value })"
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
            @change="(e) => setValue({ field: 'mode', value: e.target.value })"
            :checked="getMode() === 'add'"
            class="w-5 h-5 ml-2"
          />
        </div>
      </div>
      <MyButton black :onClick="onImportList" class="col-start-4 w-full">Import list</MyButton>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { mapGetters, mapMutations, mapActions } from 'vuex';

  export default Vue.extend({
    name: 'KanjiSorterTextInput',
    data() {
      return {
        inputBox: '',
        isInputNew: true,
      };
    },
    computed: {
      ...mapGetters(['getMode']),
    },
    methods: {
      onUpdateInput() {
        this.isInputNew = true;
      },
      onClickAbout() {
        console.log('About');
      },
      onGetKanji() {
        if (this.inputBox && (this.getMode === 'add' || this.isInputNew)) {
          this.enterInput(this.inputBox);

          if (this.getMode === 'replace') this.isInputNew = false;
        }
      },
      onGetNewKanji() {},
      onClear() {
        this.inputBox = '';
        this.isInputNew = true;
      },
      onAddToList() {},
      onImportList() {},

      ...mapMutations(['setValue']),
      ...mapActions(['enterInput']),
    },
  });
</script>

<style lang="postcss" scoped></style>
