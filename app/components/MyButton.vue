<template>
  <button
    class="w-32 py-2 text-lg bg-white border border-black hover:text-white hover:bg-black hover:border-white transition-all"
    @click="handleClick"
  >
    {{ text }}
  </button>
</template>

<script lang="ts">
  import Vue from 'vue';

  export default Vue.extend({
    name: 'MyButton',
    props: {
      text: {
        type: String,
        default: 'Button',
      },
      link: {
        type: String,
      },
      onClick: {
        type: Function,
      },
    },
    methods: {
      handleClick() {
        if (this.link) {
          window.location.href = this.link;
        } else {
          this.onClick();
        }
      },
    },
  });
</script>

<style lang="postcss" scoped></style>
