<template>
  <PageSection class="bg-mygray-900">
    <MyHeader white :size="5">My Links</MyHeader>
    <div class="items-column">
      <MyButton white link="https://youtube.com/c/DeniMintsaev">YouTube</MyButton>
      <MyButton white link="https://patreon.com/denimintsaev">Patreon</MyButton>
      <MyButton white link="https://makecound.bandcamp.com/">Bandcamp</MyButton>
      <MyButton white link="https://odysee.com/@denthebro:3">Odysee</MyButton>
      <MyButton white link="https://worldcubeassociation.org/persons/2013MINT01">WCA Profile</MyButton>
    </div>
    <p class="par-center mt-8 text-white">Email: cube327@tuta.io</p>
  </PageSection>
</template>

<script lang="ts">
  import Vue from 'vue';

  export default Vue.extend({
    name: 'Contact',
  });
</script>

<style lang="postcss">
  body {
    /* @apply bg-gray-900; */
    /* background-color: #212121; */
    /* min-height: 100%; */
  }
</style>
