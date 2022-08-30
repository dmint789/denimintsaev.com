<template>
  <div class="p-12 flex flex-col items-center gap-8">
    <h1 class="text-5xl">My Links</h1>
    <div class="flex flex-col items-center gap-4">
      <MyButton text="YouTube" link="https://youtube.com/c/DeniMintsaev" />
      <MyButton text="Patreon" link="https://patreon.com/denimintsaev" />
      <MyButton text="Bandcamp" link="https://makecound.bandcamp.com/" />
      <MyButton text="Odysee" link="https://odysee.com/@denthebro:3" />
      <MyButton
        text="WCA Profile"
        link="https://worldcubeassociation.org/persons/2013MINT01"
      />
    </div>
    <p class="text-xl">Email: cube327@tuta.io</p>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';

  export default Vue.extend({
    name: 'Contact',
  });
</script>

<style lang="postcss" scoped></style>
