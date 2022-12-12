<script setup lang="ts">
defineEmits<{
  (e: 'close'): void;
}>();

const openTab = ref(0);
</script>

<template>
  <Modal size="md" @close="$emit('close')">
    <div class="max-h-full flex flex-col items-center gap-2 md:gap-4">
      <div class="selection-buttons">
        <SelectionButton :selected="openTab === 0" @click="openTab = 0">About</SelectionButton>
        <SelectionButton :selected="openTab === 1" @click="openTab = 1">Instructions</SelectionButton>
        <SelectionButton :selected="openTab === 2" @click="openTab = 2">Credits</SelectionButton>
      </div>

      <div v-if="openTab === 0" class="big-input-output-box about-text-box">
        <p>
          This is an application that lets you sort Japanese, Chinese or Korean characters in various ways,
          helps you find new ones to learn if you import the list of characters you have studied, lets you
          import various lists of Japanese characters: Jōyō, JLPT, frequency of use, stroke count, Unicode;
          lets you filter your list of characters in various ways, among other things. The creators of all
          kanji resources used in this application are credited on the "Credits" page.
        </p>
        <p>
          Please keep in mind that some of the features of this tool can be somewhat resource intensive, when
          working with large pieces of text.
        </p>
        <p>
          This tool is open source completely free and there will likely never be any ads here, but if you
          would like to support this project, feel free to become a
          <NuxtLink to="https://patreon.com/denimintsaev" target="_blank">Patreon</NuxtLink> supporter.
        </p>
        <p>
          If you would like to report a bug or suggest a new feature, please send all relevant information to
          cube327@tuta.io
        </p>
        <p>Version: 2.0</p>
      </div>

      <div v-if="openTab === 1" class="big-input-output-box about-text-box">
        <p>
          1. To input a list of characters paste any text that contains Japanese, Chinese or Korean characters
          (later "kanji") into the input box (titled "Enter text") and click "Get kanji" to get only the kanji
          from that text or "Get new kanji" to get only the kanji that you don't have in your kanji list. If
          you have "Replace" selected, this will replace the kanji in your results list. If you have "Add"
          selected, this will add the input to the kanji already present in the results list. You can use this
          feature to import an export of your digital flash card deck that contains the kanji you have
          studied. The export can be in any text format.
        </p>
        <p>
          2. To add kanji in the results list to your kanji list, click "Add to list". Duplicates are always
          removed when this is done, so don't worry about having multiple copies of the same character in your
          kanji list.
        </p>
        <p>
          3. Use "Load", "Save" and "Delete save" to control the save of your kanji list. This only works if
          you sign up and log in. THESE FEATURES ARE CURRENTLY UNAVAILABLE.
        </p>
        <p>
          4. Use "View", "Sort type", "Filter", "Show repeats", "Reversed" AND "Negative filter" to control
          how your kanji output is displayed in the results list. The frequency list and stroke count sort
          types only work with Japanese characters. If a kanji has something like "12 (12/11)" in the stroke
          count column, that means there are multiple ways of writing the character; the first number is the
          most common stroke count and the numbers in parentheses show all possible stroke counts. If you
          select the "Kanji list" filter, the results list will only display the kanji that you have in your
          kanji list. If you select the "Kanji from input" filter, the results list will only display the
          kanji found in the input. This feature allows you to use a custom filter. THIS LAST FEATURE IS
          CURRENTLY UNAVAILABLE.
        </p>
        <p>5. Use the "Clear" buttons to clear the corresponding boxes.</p>
        <p>
          6. The "Import list" button lets you import a few different kanji lists: JLPT kanji lists, the Jōyō
          kanji list, a kanji frequency list based on newspapers or novels, a list of kanji sorted by stroke
          count or the entire library of 27,576 characters. All of these lists are for Japanese characters
          except for the entire library import, which includes all Japanese, Chinese and Korean characters. If
          you select JLPT, you can choose to import an inclusive or an exclusive list. Inclusive means include
          the kanji from lower levels too (e.g. if you select N3, this will also include N4 and N5 lists). If
          you are importing a frequency list or the stroke count list, you can enter a number of characters
          that you want to import from the top of the list (or bottom of the list if "Reversed" is enabled).
          The default setting is to import all characters from the selected list.
        </p>
      </div>

      <div v-else-if="openTab === 2" class="big-input-output-box about-text-box">
        <p>
          Full library of characters taken from
          <NuxtLink to="http://rikai.com/library/kanjitables/kanji_codes.unicode.shtml" target="_blank">
            Rikai Kanji Tables
          </NuxtLink>
        </p>
        <p>
          Lists of kanji based on JLPT level, stroke count and frequency of use in newspapers taken from the
          <NuxtLink to="https://edrdg.org/wiki/index.php/KANJIDIC_Project" target="_blank"
            >KANJIDIC project</NuxtLink
          >
        </p>
        <p>
          List of kanji sorted by frequency of use in novels taken from
          <NuxtLink to="http://vtrm.net/japanese/kanji-frequency/en" target="_blank">vtrm.net</NuxtLink>
        </p>
        <p>
          Jōyō kanji list taken from
          <NuxtLink to="https://en.wikipedia.org/wiki/List_of_j%C5%8Dy%C5%8D_kanji" target="_blank"
            >Wikipedia</NuxtLink
          >
        </p>
      </div>

      <MyButton size="lg" @click="$emit('close')">Close</MyButton>
    </div>
  </Modal>
</template>

<style lang="postcss" scoped>
p {
  display: block;
  margin-bottom: 1.3rem;
}

.selection-buttons {
  @apply w-full max-w-lg mt-2 sm:mt-4 mx-auto flex flex-col sm:flex-row justify-center items-center gap-1 md:gap-2;
}

.about-text-box {
  @apply overflow-auto max-h-72 md:max-h-96 text-lg md:text-xl;
}
</style>
