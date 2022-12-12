<script setup lang="ts">
const config = useRuntimeConfig();

useHead({
  title: "Projects | Deni's Site",
  meta: [
    {
      name: 'description',
      content:
        'Projects I have worked on over the years, including my Kanji Sorter tool, my game "Red Octagon" and more.',
    },
  ],
});

definePageMeta({ layout: 'dark' });
</script>

<template>
  <PageSection>
    <MyHeader :size="5" white>Projects</MyHeader>
    <div class="items-column">
      <MyButton white size="md" link="/kanjisorter">Kanji Sorter</MyButton>
      <MyButton white size="md" link="https://denthebro.itch.io/red-octagon" external>Red Octagon</MyButton>
      <MyButton white size="md" :link="`${config.public.apiBase}/pll_bingo.jpg`" external>PLL Bingo</MyButton>
    </div>
  </PageSection>
</template>
