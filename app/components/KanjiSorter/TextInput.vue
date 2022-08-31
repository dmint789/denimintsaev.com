<template>
  <div>
    <div class="grid grid-cols-3">
      <h2 class="col-start-2 text-3xl text-center">Enter Text</h2>
      <div class="h-14 flex justify-end items-center gap-2">
        <MyButton text="About" black :onClick="onClickAbout" />
        <NuxtLink to="/patreon" class="h-full">
          <img
            src="../../static/patreon_logo.png"
            alt="Patreon Logo"
            class="h-full"
          />
        </NuxtLink>
      </div>
    </div>
    <textarea
      name="inputtext"
      placeholder="Enter text here"
      class="w-full h-80 max-h-80 my-4 px-3 py-2 text-2xl items-start border-2 border-black hover:bg-mygray-50"
    ></textarea>
    <div class="grid grid-cols-4 gap-4 justify-around">
      <MyButton text="Get kanji" black :onClick="onGetKanji" class="w-full" />
      <MyButton
        text="Get new kanji"
        black
        :onClick="onGetKanji"
        class="w-full"
      />
      <MyButton text="Clear" black :onClick="onGetKanji" class="w-full" />
      <MyButton text="Add to list" black :onClick="onGetKanji" class="w-full" />
      <div
        class="col-span-2 w-3/5 min-w-min p-1 mx-auto flex justify-center items-center text-xl border-2 border-black"
      >
        <div class="mr-4 flex items-center">
          <label for="replace">Replace</label>
          <input
            type="radio"
            name="mode"
            id="replace"
            value="replace"
            checked
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
            class="w-5 h-5 ml-2"
          />
        </div>
      </div>
      <MyButton
        text="Import list"
        black
        :onClick="onGetKanji"
        class="col-start-4 w-full"
      />
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';

  export default Vue.extend({
    name: 'KanjiSorterTextInput',
    methods: {
      onClickAbout() {
        console.log('About');
      },
      onGetKanji() {},
      onGetNewKanji() {},
      onClear() {},
      onAddToList() {},
      onImportList() {},
    },
  });
</script>

<style lang="postcss" scoped></style>
