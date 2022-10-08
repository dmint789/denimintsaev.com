<template>
  <Modal title="Select list to import" size="sm" @close="$emit('close')">
    <div class="flex flex-col items-center">
      <div class="w-full max-w-lg mx-auto px-3 flex flex-col gap-2 md:gap-3">
        <SelectionButton @click="changeSel('newspapers')" :selected="selected === 'newspapers'">
          Kanji by frequency of use in newspapers
        </SelectionButton>
        <SelectionButton @click="changeSel('novels')" :selected="selected === 'novels'">
          Kanji by frequency of use in novels
        </SelectionButton>
        <SelectionButton @click="changeSel('strokecount')" :selected="selected === 'strokecount'">
          Kanji by stroke count
        </SelectionButton>
        <SelectionButton @click="changeSel('jlpt')" :selected="selected === 'jlpt'">
          Kanji from JLPT level
        </SelectionButton>
        <div v-if="selected === 'jlpt'" class="input-row my-1 md:my-2">
          <select
            name="jlpt_level"
            id="jlpt_level"
            :value="jlptLevel"
            @change="(e) => changeJlptLevel(e.target.value)"
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
            @change="(val) => (inclusive = val)"
          />
        </div>
        <SelectionButton @click="changeSel('joyo')" :selected="selected === 'joyo'"> Jōyō kanji list </SelectionButton>
        <SelectionButton @click="changeSel('all')" :selected="selected === 'all'"> Full kanji library </SelectionButton>
        <div class="input-row mt-2 md:mt-3">
          <div class="flex flex-col items-center gap-2">
            <h4># of characters:</h4>
            <p class="big-p">Max: {{ maxChars }}</p>
          </div>
          <NumberInput
            name="max_chars"
            placeholder="All"
            :value="chars"
            @change="(val) => (chars = val)"
            :default="maxChars"
            :min="1"
            :max="maxChars"
            integer
            :disabled="isStaticList()"
            class="w-28"
          />
        </div>
      </div>

      <MyCheckbox
        name="importreversed"
        text="Reversed"
        :disabled="isStaticList()"
        :checked="reversed"
        @change="(val) => (reversed = val)"
        class="my-4 md:my-6"
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
        // The names of these list variables are all the same as the values of the ImportType enum
        lists: {
          newspapers: '',
          novels: '',
          strokecount: '',
          jlpt: {},
          joyo: '',
          all: '',
        },
        selected: ImportType.Newspapers,
        jlptLevel: 'n5',
        inclusive: false,
        chars: null,
        maxChars: 0,
        reversed: false,
      };
    },
    async created() {
      this.lists.newspapers = await this.$axios.$get('/api/static/newspaper_sort_kanji.txt');
      this.lists.novels = await this.$axios.$get('/api/static/novel_sort_kanji.txt');
      this.lists.strokecount = await this.$axios.$get('/api/static/kanji_by_stroke_count.txt');
      this.lists.jlpt = await this.$axios.$get('/api/static/jlpt_kanji.json');
      this.lists.joyo = await this.$axios.$get('/api/static/joyo_kanji.txt');
      this.lists.all = await this.$axios.$get('/api/static/all_kanji.txt');

      this.changeSel(this.selected);
    },
    methods: {
      isStaticList() {
        return (
          this.selected === ImportType.JLPT ||
          this.selected === ImportType.Joyo ||
          this.selected === ImportType.FullLibrary
        );
      },
      changeJlptLevel(newLevel: 'n5' | 'n4' | 'n3' | 'n2' | 'n1') {
        this.jlptLevel = newLevel;
        this.updateMaxChars();
      },
      changeSel(newSel: ImportType) {
        this.selected = newSel;
        this.updateMaxChars();
        if (!this.isStaticList()) this.chars = this.maxChars;
        else this.chars = null;
      },
      updateMaxChars() {
        switch (this.selected) {
          case ImportType.Newspapers:
            this.maxChars = this.lists.newspapers.length;
            break;
          case ImportType.Novels:
            this.maxChars = this.lists.novels.length;
            break;
          case ImportType.StrokeCount:
            this.maxChars = this.lists.strokecount.length;
            break;
          case ImportType.JLPT:
            this.maxChars = this.lists.jlpt[this.jlptLevel].length;
            break;
          case ImportType.Joyo:
            this.maxChars = this.lists.joyo.length;
            break;
          case ImportType.FullLibrary:
            this.maxChars = this.lists.all.length;
            break;
          default:
            throw 'Trying to import an unknown import type!';
        }
      },
      onImport() {
        let importList = '';

        if (this.isStaticList()) {
          if (this.selected !== ImportType.JLPT) importList = this.lists[this.selected];
          else {
            for (let i = 5; i >= parseInt(this.jlptLevel[1]); i--) {
              importList += this.lists.jlpt[`n${i}`] + '\n\n';
            }
          }
        } else {
          if (this.reversed) importList = this.lists[this.selected].split('').reverse().join('');
          else importList = this.lists[this.selected];

          console.log(this.chars);
          importList = importList.slice(0, this.chars);
        }

        this.$emit('close', importList);
      },
    },
  });
</script>

<style lang="postcss" scoped>
  .input-row {
    @apply flex justify-around items-center md:justify-center md:gap-10;
  }
</style>
