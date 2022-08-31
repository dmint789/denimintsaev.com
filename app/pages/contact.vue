<template>
  <div class="pb-6 bg-mygray-900">
    <MyHeader text="My Links" white />
    <div class="mt-2 mb-8 flex flex-col items-center gap-4">
      <MyButton text="YouTube" link="https://youtube.com/c/DeniMintsaev" />
      <MyButton text="Patreon" link="https://patreon.com/denimintsaev" />
      <MyButton text="Bandcamp" link="https://makecound.bandcamp.com/" />
      <MyButton text="Odysee" link="https://odysee.com/@denthebro:3" />
      <MyButton
        text="WCA Profile"
        link="https://worldcubeassociation.org/persons/2013MINT01"
      />
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
