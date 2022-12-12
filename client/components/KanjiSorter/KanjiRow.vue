<script setup lang="ts">
import { IKanji, IKanjiListEntry } from '~/helpers/interfaces/kanji';

const props = withDefaults(
  defineProps<{
    kanji: IKanji | IKanjiListEntry;
    showAll?: boolean;
  }>(),
  {
    showAll: false,
  },
);

const show = computed(() => {
  // index = 0 means it's a repeat kanji, -1 means it's an unsorted kanji
  return props.kanji.index !== 0 || props.showAll;
});
</script>

<template>
  <tr v-if="show" class="table-data">
    <td>{{ kanji.index > 0 ? kanji.index : '' }}</td>
    <td>
      <a :href="`https://jisho.org/search/${kanji.c}%20%23kanji`" target="_blank" class="kanji">{{
        kanji.c
      }}</a>
    </td>
    <td v-if="kanji.occurrences">{{ kanji.occurrences }}</td>
    <td>{{ kanji.p ? `#${kanji.p}` : 'N/A' }}</td>
    <td>{{ kanji.v ? `#${kanji.v}` : 'N/A' }}</td>
    <td>{{ kanji.s ? kanji.s + (kanji.a ? ` (${kanji.a})` : '') : 'N/A' }}</td>
    <td>{{ kanji.n ? `N${kanji.n}` : 'N/A' }}</td>
    <td>{{ kanji.y === 1 ? 'Yes' : 'No' }}</td>
  </tr>
</template>

<style scoped lang="postcss">
.kanji {
  color: rgb(13, 94, 255);

  &:hover {
    color: rgb(119, 155, 255);
  }

  &:active {
    color: rgb(181, 201, 255);
  }
}
</style>
