<script setup lang="ts">
useHead({
  title: "Patreon | Deni's Site",
  meta: [
    {
      name: 'description',
      content:
        'The about page for my Patreon with descriptions of the tiers, a list of all my supporters and a link to the Patreon page itself.',
    },
  ],
});

const tier2Names = ['Willian', 'Minecraft Underground'];

const tier1Names = [];
</script>

<template>
  <PageSection>
    <MyHeader :size="5">Patreon</MyHeader>
    <div class="mt-4 md:mt-8 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-12">
      <img src="/patreon_logo.png" alt="Patreon Logo" class="mx-16 md:mx-0 w-96 max-w-full aspect-square" />
      <div class="h-full flex flex-col justify-between items-center">
        <p class="text-justify md:text-2xl pb-8">
          If you would like to support my online activities, including my YouTube channel, my music, my
          website and all of the projects I publish here, feel free to support me on Patreon. Whichever tier
          you end up choosing, you have my gratitude for being such a generous supporter of what I do. Huge
          thanks to everyone who has ever made a pledge!
        </p>
        <MyButton size="lg" link="https://www.patreon.com/denimintsaev">Support</MyButton>
      </div>
    </div>
    <MyHeader :size="4" class="my-8">Supporters</MyHeader>
    <div class="flex flex-col items-center gap-4 min-w-xxl py-4 md:py-8 border-2 border-black">
      <MyHeader :size="3" class="mb-2 md:mb-5"><b>Wonderful&nbsp;Supporter</b> (tier&nbsp;2)</MyHeader>
      <template v-if="tier2Names.length > 0">
        <span v-for="name in tier2Names" class="text-2xl md:text-3xl">{{ name }}</span>
      </template>
      <span v-else class="text-xl md:text-2xl">(this could be you)</span>
    </div>
    <div
      class="flex flex-col items-center gap-4 max-w-xxl mb-8 md:mb-10 py-4 md:py-8 border-x-2 border-b-2 border-black"
    >
      <MyHeader :size="3" class="mb-2 md:mb-5"><b>Lovely&nbsp;Supporter</b> (tier&nbsp;1)</MyHeader>
      <template v-if="tier1Names.length > 0">
        <span v-for="name in tier1Names" class="text-xl md:text-2xl">{{ name }}</span>
      </template>
      <span v-else class="text-xl md:text-2xl">(this could be you)</span>
    </div>
  </PageSection>
</template>
