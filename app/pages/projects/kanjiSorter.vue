<template>
  <div>
    <MyHeader text="Kanji Sorter" />
    <div class="mx-auto w-1/2 grid grid-cols-3">
      <h2 class="col-start-2 text-3xl text-center">Enter Text</h2>
      <div class="h-12 flex justify-end items-center gap-2">
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
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';

  export default Vue.extend({
    name: 'KanjiSorter',
    methods: {
      onClickAbout() {
        console.log('About');
      },
    },
  });
</script>

<style lang="postcss" scoped></style>
