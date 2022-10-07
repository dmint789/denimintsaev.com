<template>
  <Modal title="Select list to import" size="sm" @close="$emit('close')">
    <div class="w-4/5 mx-auto">
      <SelectionButton @click="selected = 'newspapers'" :selected="selected === 'newspapers'" class="sb">
        Kanji by frequency of use in newspapers
      </SelectionButton>
      <SelectionButton @click="selected = 'novels'" :selected="selected === 'novels'" class="sb">
        Kanji by frequency of use in novels
      </SelectionButton>
      <SelectionButton @click="selected = 'strokecount'" :selected="selected === 'strokecount'" class="sb">
        Kanji by stroke count
      </SelectionButton>
      <SelectionButton @click="selected = 'jlpt'" :selected="selected === 'jlpt'" class="sb">
        Kanji from JLPT level
      </SelectionButton>
      <SelectionButton @click="selected = 'joyo'" :selected="selected === 'joyo'" class="sb">
        Jōyō kanji list
      </SelectionButton>
      <SelectionButton @click="selected = 'all'" :selected="selected === 'all'" class="sb">
        Full kanji library
      </SelectionButton>
    </div>
  </Modal>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { SortType } from '~/helpers/enums/sortType';

  export default Vue.extend({
    name: 'ImportListModal',
    data() {
      return {
        selected: SortType.Newspapers,
      };
    },
  });
</script>

<style lang="postcss" scoped>
  .sb {
    @apply mb-3;
  }
</style>
