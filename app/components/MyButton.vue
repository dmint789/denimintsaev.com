<template>
  <button
    class="w-40 h-14 box-content text-xl transition-all"
    :class="black ? 'black' : 'white'"
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
      black: {
        type: Boolean,
        default: false,
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
          if (this.link.includes('https://')) window.location.href = this.link;
          else this.$router.push(this.link);
        } else {
          this.onClick();
        }
      },
    },
  });
</script>

<style lang="postcss" scoped>
  .white {
    @apply text-black bg-white border border-black hover:text-white hover:bg-black hover:border-white;
  }
  .black {
    @apply text-white bg-black border border-white hover:text-black hover:bg-white hover:border-black;
  }
</style>
