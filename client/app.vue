<script setup lang="ts">
useHead({
  title: 'denimintsaev.com',
  htmlAttrs: {
    lang: 'en',
  },
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    {
      name: 'description',
      content:
        "My personal website dedicated to Japanese, language learning, speedcubing and my other interests. Here you can find my blog, various projects I've worked on like my Kanji Sorter tool, and other cool stuff.",
    },
    {
      name: 'keywords',
      content:
        'deni, mintsaev, japanese, japan, 日本語, german, germany, deutsch, language, language learning, languages, kanji, kanji sorter, blog, youtube, channel, speedcubing, patreon, javascript, music, books, red octagon, pll bingo, contact, projects, time calculator',
    },
    { name: 'author', content: 'Deni Mintsaev' },
    // { name: 'format-detection', content: 'telephone=no' },
  ],
  link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
});
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
