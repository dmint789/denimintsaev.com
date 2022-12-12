<script setup lang="ts">
import myFetch from '~/composables/myFetch';

useHead({ title: "Home | Deni's Site" });

const buttonClicks = ref(0);
const buttonDisabled = ref(true);

if (process.client) {
  myFetch('/get_collective_clicks').then((res: any) => {
    buttonClicks.value = res.clicks;
    buttonDisabled.value = false;
  });
}

const onButtonClick = async () => {
  if (!buttonDisabled.value) {
    buttonDisabled.value = true;

    setTimeout(() => {
      myFetch('/increment_counter', {
        method: 'POST',
      }).then((res: any) => {
        buttonClicks.value = res.clicks;
        buttonDisabled.value = false;
      });
    }, 200);
  }
};
</script>

<template>
  <div>
    <PageSection :py="3" class="bg-yellow-400">
      <p class="text-justify">
        This website is currently a work-in-progress. I am rebuilding it from the ground up, due to Wix
        stopping service for users based in Russia. The old website will be available through
        <NuxtLink to="https://dmintsaev.wixsite.com/website">this link</NuxtLink>
        until I rebuild most of the old functionality. However, the
        <NuxtLink to="/kanjisorter">Kanji Sorter</NuxtLink> is already available here (and improved), so feel
        free to use it.
      </p>
    </PageSection>
    <PageSection class="bg-mygray-900">
      <MyHeader :size="5" white>Hello!</MyHeader>
      <p class="text-justify text-white">
        My name is Deni and I come from Russia. My main activities include language learning, YouTube,
        speedcubing and music.<br /><br />
        Welcome to my personal website, where you can learn about what I do and follow my adventures in this
        strange world.
      </p>
      <div class="mt-8 flex justify-center gap-4">
        <MyButton white size="sm" link="/projects">Projects</MyButton>
        <MyButton white size="sm" link="/blog">Blog</MyButton>
        <MyButton white size="sm" link="/contact">Links</MyButton>
      </div>
    </PageSection>
    <PageSection>
      <div class="flex flex-col md:flex-row items-center md:items-start gap-6">
        <img src="/patreon_logo.png" alt="Patreon Logo" class="mx-16 md:mx-0 w-96 max-w-full aspect-square" />
        <div class="flex flex-col items-center">
          <MyHeader :size="4">Patreon</MyHeader>
          <p class="text-justify pb-8">
            If you like what I do and would like to support my activities online, including my YouTube
            channel, my website and my music, feel free to become a Patreon supporter. Huge thanks to
            everyone, who has made a pledge, your contributions are greatly appreciated!
          </p>
          <MyButton size="lg" link="https://patreon.com/denimintsaev" external>Support</MyButton>
        </div>
      </div>
    </PageSection>
    <PageSection class="bg-mygray-900">
      <div class="flex flex-col items-center">
        <MyHeader :size="4" white>Collective Counting</MyHeader>
        <button :disabled="buttonDisabled" @click="onButtonClick" class="counting-button"></button>
        <p class="big-p text-white">This button has been clicked {{ buttonClicks || 0 }} times</p>
      </div>
    </PageSection>
  </div>
</template>

<style lang="postcss" scoped>
.counting-button {
  @apply w-40 h-40 mt-4 mb-6 md:mt-7 md:mb-10 rounded-full outline-none bg-white hover:bg-mygray-100;

  box-shadow: 5px 5px 5px 5px rgba(0, 0, 0, 0.4);
}
/* For some reason it's not letting me use the active: modifier */
.counting-button:active {
  @apply bg-mygray-200;

  box-shadow: none;
}
.counting-button:disabled {
  @apply bg-mygray-400;

  box-shadow: none;
}
</style>
