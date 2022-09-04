<template>
  <div class="w-full text-center" :class="`p-${size}`">
    <h1 :class="[textSize, white ? 'text-white' : 'text-black']">
      <slot />
    </h1>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';

  export default Vue.extend({
    name: 'MyHeader',
    props: {
      white: {
        type: Boolean,
        default: false,
      },
      size: {
        type: Number,
        default: 3,
      },
    },
    computed: {
      textSize(): String {
        switch (this.size) {
          case 1:
            return 'text-xl';
          default:
            return `text-${this.size}xl`;
        }
      },
    },
  });
</script>

<style lang="postcss" scoped></style>
