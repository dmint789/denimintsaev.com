<script setup lang="ts">
useHead({
  title: "Contact | Deni's Site",
  meta: [
    {
      name: 'description',
      content: 'My contact information and links to my YouTube, Bandcamp, Odysee and WCA profile.',
    },
  ],
});

definePageMeta({ layout: 'dark' });
</script>

<template>
  <PageSection class="bg-mygray-900">
    <MyHeader white :size="5">My Links</MyHeader>
    <div class="items-column">
      <MyButton white link="https://youtube.com/c/DeniMintsaev" size="lg">YouTube</MyButton>
      <MyButton white link="https://patreon.com/denimintsaev" size="lg">Patreon</MyButton>
      <MyButton white link="https://makecound.bandcamp.com/" size="lg">Bandcamp</MyButton>
      <MyButton white link="https://odysee.com/@denthebro:3" size="lg">Odysee</MyButton>
      <MyButton white link="https://worldcubeassociation.org/persons/2013MINT01" size="lg">
        WCA Profile
      </MyButton>
    </div>
    <p class="mt-8 text-center text-white">Email: cube327@tuta.io</p>
  </PageSection>
</template>
