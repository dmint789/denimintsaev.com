<template>
  <tr v-if="show" class="table-data">
    <td>{{ kanji.index !== 0 ? kanji.index : '' }}</td>
    <td>{{ kanji.c }}</td>
    <td>{{ kanji.occurrences }}</td>
    <td>{{ kanji.p ? `#${kanji.p}` : 'N/A' }}</td>
    <td>{{ kanji.v ? `#${kanji.v}` : 'N/A' }}</td>
    <td>{{ kanji.s ? kanji.s + (kanji.a ? ` (${kanji.a})` : '') : 'N/A' }}</td>
    <td>{{ kanji.n ? `N${kanji.n}` : 'N/A' }}</td>
    <td>{{ kanji.y === 1 ? 'Yes' : 'No' }}</td>
  </tr>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { IKanjiExt } from '~/helpers/interfaces/kanji';

  export default Vue.extend({
    name: 'KanjiRow',
    props: {
      kanji: {
        type: Object as () => IKanjiExt,
        required: true,
      },
      repeats: {
        type: Boolean,
        default: false,
      },
    },
    computed: {
      show() {
        return this.kanji.filtered && (this.kanji.index !== 0 || this.repeats);
      },
    },
  });
</script>

<style lang="postcss" scoped></style>
