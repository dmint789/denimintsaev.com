<template>
  <tr v-if="show" class="table-data">
    <td v-if="kanji.index !== undefined">{{ kanji.index !== 0 ? kanji.index : '' }}</td>
    <td>{{ kanji.c }}</td>
    <td v-if="kanji.occurrences">{{ kanji.occurrences }}</td>
    <td>{{ kanji.p ? `#${kanji.p}` : 'N/A' }}</td>
    <td>{{ kanji.v ? `#${kanji.v}` : 'N/A' }}</td>
    <td>{{ kanji.s ? kanji.s + (kanji.a ? ` (${kanji.a})` : '') : 'N/A' }}</td>
    <td>{{ kanji.n ? `N${kanji.n}` : 'N/A' }}</td>
    <td>{{ kanji.y === 1 ? 'Yes' : 'No' }}</td>
  </tr>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { IKanji, IKanjiListEntry } from '~/helpers/interfaces/kanji';

  export default Vue.extend({
    name: 'KanjiRow',
    props: {
      kanji: {
        type: Object as () => IKanji | IKanjiListEntry,
        required: true,
      },
      // Override that tells the component to be shown as long as the kanji passes the filter
      showAll: {
        type: Boolean,
        default: false,
      },
    },
    computed: {
      show() {
        return this.kanji.filtered && (this.kanji.index !== 0 || this.showAll);
      },
    },
  });
</script>

<style lang="postcss" scoped></style>
