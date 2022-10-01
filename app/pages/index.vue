<template>
  <div>
    <PageBanner class="bg-yellow-400"
      >This website is currently a work-in-progress. I am rebuilding it from the ground up, due to Wix stopping service
      for users based in Russia. The old website will be available through
      <a href="https://dmintsaev.wixsite.com/website">this link</a>
      until I rebuild most of the old functionality. However, the
      <NuxtLink to="/kanjisorter">Kanji Sorter</NuxtLink> is already available here (and improved), so feel free to use
      it.</PageBanner
    >
    <div class="standard-page-div">
      <MyHeader :size="5">Hello!</MyHeader>
      <p class="text-xl text-justify">
        My name is Deni and I come from Russia. My main activities include language learning, YouTube, speedcubing and
        music.<br /><br />
        Welcome to my personal website, where you can learn about what I do and follow my adventures in this strange
        world.
      </p>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';

  export default Vue.extend({
    name: 'Home',
  });
</script>

<style lang="postcss" scoped>
  a {
    @apply text-mygray-700 hover:text-mygray-500;
  }
</style>
