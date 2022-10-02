<template>
  <div>
    <PageSection :py="2" class="bg-yellow-400">
      <p class="paragraph">
        This website is currently a work-in-progress. I am rebuilding it from the ground up, due to Wix stopping service
        for users based in Russia. The old website will be available through
        <a href="https://dmintsaev.wixsite.com/website">this link</a>
        until I rebuild most of the old functionality. However, the
        <NuxtLink to="/kanjisorter">Kanji Sorter</NuxtLink> is already available here (and improved), so feel free to
        use it.
      </p>
    </PageSection>
    <PageSection class="bg-mygray-900">
      <MyHeader :size="5" white>Hello!</MyHeader>
      <p class="paragraph text-white">
        My name is Deni and I come from Russia. My main activities include language learning, YouTube, speedcubing and
        music.<br /><br />
        Welcome to my personal website, where you can learn about what I do and follow my adventures in this strange
        world.
      </p>
      <div class="mt-8 flex justify-center gap-4">
        <MyButton white small link="/projects">Projects</MyButton>
        <MyButton white small link="/blog">Blog</MyButton>
        <MyButton white small link="/contact">Links</MyButton>
      </div>
    </PageSection>
    <PageSection>
      <div class="flex flex-col md:flex-row items-center md:items-start gap-6">
        <img
          src="~/static/patreon_logo.png"
          alt="Patreon Logo"
          class="mx-16 md:mx-0 max-w-xs flex-shrink-0 aspect-square"
        />
        <div class="flex flex-col items-center">
          <MyHeader :size="4">Patreon</MyHeader>
          <p class="paragraph pb-8">
            If you like what I do and would like to support my activities online, including my YouTube channel, my
            website and my music, feel free to become a Patreon supporter. Huge thanks to everyone, who has made a
            pledge, your contributions are greatly appreciated!
          </p>
          <MyButton link="https://www.patreon.com/denimintsaev">Support</MyButton>
        </div>
      </div>
    </PageSection>
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
