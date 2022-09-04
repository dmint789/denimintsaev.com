<template>
  <div class="pb-6 bg-mygray-900">
    <MyHeader white :size="5">My Links</MyHeader>
    <div class="mt-2 mb-8 flex flex-col items-center gap-4">
      <MyButton link="https://youtube.com/c/DeniMintsaev">YouTube</MyButton>
      <MyButton link="https://patreon.com/denimintsaev">Patreon</MyButton>
      <MyButton link="https://makecound.bandcamp.com/">Bandcamp</MyButton>
      <MyButton link="https://odysee.com/@denthebro:3">Odysee</MyButton>
      <MyButton link="https://worldcubeassociation.org/persons/2013MINT01"
        >WCA Profile</MyButton
      >
    </div>
    <p class="text-xl text-center text-white">Email: cube327@tuta.io</p>
  </div>
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
