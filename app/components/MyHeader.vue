<template>
  <div class="w-full p-6 text-center">
    <h1 class="text-4xl" :class="white ? 'text-white' : 'text-black'">
      {{ text }}
    </h1>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';

  export default Vue.extend({
    name: 'MyHeader',
    props: {
      text: {
        type: String,
        required: true,
      },
      white: {
        type: Boolean,
        default: false,
      },
    },
  });
</script>

<style lang="postcss" scoped></style>
