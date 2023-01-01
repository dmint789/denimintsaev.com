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
    <Project link="/kanjisorter" image="/projects/kanji_sorter.jpg" title="Kanji Sorter">
      An application that lets you sort and filter Japanese, Chinese or Korean characters in various ways,
      helps find new ones to learn, lets you import various lists of Japanese characters, among other things.
    </Project>
    <Project
      link="https://github.com/dmint789/stat-tracker"
      image="/projects/stat_tracker.jpg"
      title="Stat Tracker"
    >
      A mobile app for tracking various daily statistics and personal bests. You can use it for things like
      work, education, hobbies, health, or whatever it is you can find it useful for in your personal life. It
      shows personal bests for numeric stats, has various customization options for stat types, allows setting
      the date and a comment for each entry and more.
    </Project>
    <Project
      link="https://denthebro.itch.io/red-octagon"
      image="/projects/red_octagon.png"
      title="Red Octagon"
    >
      A platformer game where you play as Red Guy and try your best to beat every level. On your journey you
      find Octagon and together you become strong enough to complete every level and beat the game.
    </Project>
    <Project
      :link="`${config.public.apiBase}/pll_bingo.jpg`"
      image="/projects/pll_bingo.jpg"
      title="PLL Bingo"
    >
      A little project I did back in 2018. It's just a simple game you can play with your friends, where you
      try to get every PLL in the style of the game Bingo. Click the link, download the image, print out one
      copy for each player (in color) and you're good to go!
    </Project>
  </PageSection>
</template>
