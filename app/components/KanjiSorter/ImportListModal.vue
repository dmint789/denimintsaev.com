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

      <div class="my-6 flex items-center gap-8">
        <div class="flex flex-col items-center gap-3">
          <h3 class="text-3xl"># of characters:</h3>
          <p class="text-2xl">Max: {{ maxChars }}</p>
        </div>
        <NumberInput name="maxchars" placeholder="All characters" :min="1" :max="maxChars" class="w-48" />
      </div>

      <MyCheckbox
        name="importreversed"
        text="Reversed"
        :disabled="getReversedDisabled()"
        :checked="reversed"
        @change="(val) => (reversed = val)"
        class="mb-6"
      />
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
        lists: {
          newspapers: '',
          novels: '',
          strokecount: '',
          jlpt: {},
          joyo: '',
          fullLibrary: '',
        },
        selected: ImportType.Newspapers,
        chars: 0,
        maxChars: 0,
        reversed: false,
      };
    },
    async created() {
      this.newspapers = await this.$axios.$get('/api/static/newspaper_sort_kanji.txt');
      this.novels = await this.$axios.$get('/api/static/novel_sort_kanji.txt');
      this.strokecount = await this.$axios.$get('/api/static/kanji_by_stroke_count.txt');
      this.jlpt = await this.$axios.$get('/api/static/jlpt_kanji.json');
      this.joyo = await this.$axios.$get('/api/static/joyo_kanji.txt');
      this.fullLibrary = await this.$axios.$get('/api/static/all_kanji.txt');

      this.changeSel(this.selected);
    },
    methods: {
      getReversedDisabled() {
        return (
          this.selected === ImportType.JLPT ||
          this.selected === ImportType.Joyo ||
          this.selected === ImportType.FullLibrary
        );
      },
      changeSel(newSel: ImportType) {
        this.selected = newSel;

        switch (newSel) {
          case ImportType.Newspapers:
            this.maxChars = this.newspapers.length;
            break;
          case ImportType.Novels:
            this.maxChars = this.novels.length;
            break;
          case ImportType.StrokeCount:
            this.maxChars = this.strokecount.length;
            break;
          case ImportType.JLPT:
            this.maxChars = 0;
            break;
          case ImportType.Joyo:
            this.maxChars = this.joyo.length;
            break;
          case ImportType.FullLibrary:
            this.maxChars = this.fullLibrary.length;
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
