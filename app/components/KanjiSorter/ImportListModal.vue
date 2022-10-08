<template>
  <Modal title="Select list to import" size="sm" @close="$emit('close')">
    <div class="flex flex-col items-center">
      <div class="w-4/5 mx-auto">
        <SelectionButton @click="changeSel('newspapers')" :selected="selected === 'newspapers'" class="sb">
          Kanji by frequency of use in newspapers
        </SelectionButton>
        <SelectionButton @click="changeSel('novels')" :selected="selected === 'novels'" class="sb">
          Kanji by frequency of use in novels
        </SelectionButton>
        <SelectionButton @click="changeSel('strokecount')" :selected="selected === 'strokecount'" class="sb">
          Kanji by stroke count
        </SelectionButton>
        <SelectionButton @click="changeSel('jlpt')" :selected="selected === 'jlpt'" class="sb">
          Kanji from JLPT level
        </SelectionButton>
        <SelectionButton @click="changeSel('joyo')" :selected="selected === 'joyo'" class="sb">
          Jōyō kanji list
        </SelectionButton>
        <SelectionButton @click="changeSel('all')" :selected="selected === 'all'" class="sb">
          Full kanji library
        </SelectionButton>
      </div>

      <div class="mb-4 flex items-center">
        <div class="flex flex-col items-center">
          <MyHeader :size="3"># of characters:</MyHeader>
          <p class="text-2xl">Max: {{ maxChars }}</p>
        </div>
      </div>

      <MyButton size="md" @click="onImport">Import</MyButton>
    </div>
  </Modal>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { ImportType } from '~/helpers/enums/importType';

  export default Vue.extend({
    name: 'ImportListModal',
    data() {
      return {
        selected: ImportType.Newspapers,
        chars: 0,
        maxChars: 0,
      };
    },
    methods: {
      changeSel(newSel: ImportType) {
        this.selected = newSel;

        switch (newSel) {
          case ImportType.Newspapers:
            this.maxChars = 2500;
            break;
          case ImportType.Novels:
            this.maxChars = 2500;
            break;
          case ImportType.StrokeCount:
            this.maxChars = 2500;
            break;
          case ImportType.JLPT:
            this.maxChars = 2500;
            break;
          case ImportType.Joyo:
            this.maxChars = 2500;
            break;
          case ImportType.FullLibrary:
            this.maxChars = 2500;
            break;
          default:
            throw 'Trying to import an unknown import type!';
        }
      },
      onImport() {
        this.$emit('close');
      },
    },
  });
</script>

<style lang="postcss" scoped>
  .sb {
    @apply mb-3;
  }
</style>
