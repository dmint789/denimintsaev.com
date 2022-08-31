<template>
  <div>
    <div class="mt-12 grid grid-cols-3 justify-between">
      <h2 class="col-start-2 text-3xl text-center">Result</h2>
      <div class="flex justify-end items-center gap-3">
        <label for="update" class="text-2xl">Update</label>
        <input
          type="checkbox"
          id="update"
          name="update"
          value="update"
          checked
          class="w-5 h-5"
        />
      </div>
    </div>
    <textarea
      name="inputtext"
      placeholder="Enter text here"
      class="w-full h-80 max-h-80 my-4 px-3 py-2 text-2xl items-start border-2 border-black hover:bg-mygray-50"
    ></textarea>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';

  export default Vue.extend({
    name: 'KanjiSorterOutput',
  });
</script>

<style lang="postcss" scoped></style>
