<template>
  <div class="flex flex-col items-center">
    <MyHeader :size="5">Hello!</MyHeader>
    <p class="w-1/3 text-xl text-justify">
      My name is Deni and I come from Russia. My main activities include
      language learning, YouTube, speedcubing and music.<br /><br />
      Welcome to my personal website, where you can learn about what I do and
      follow my adventures in this strange world.
    </p>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';

  export default Vue.extend({
    name: 'Home',
  });
</script>
