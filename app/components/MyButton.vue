<template>
  <button class="h-14 box-content text-xl transition-all" :class="getClasses" @click="handleClick" :disabled="disabled">
    <slot />
  </button>
</template>

<script lang="ts">
  import Vue from 'vue';

  export default Vue.extend({
    name: 'MyButton',
    props: {
      disabled: {
        type: Boolean,
        default: false,
      },
      white: {
        type: Boolean,
        default: false,
      },
      small: {
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
    computed: {
      getClasses() {
        let classes: string;
        classes = this.disabled ? 'disabled' : this.white ? 'white' : 'black';
        classes += this.small ? ' w-32' : ' w-40';
        return classes;
      },
    },
    methods: {
      handleClick() {
        if (this.link) {
          if (this.link.includes('http')) window.location.href = this.link;
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
  .disabled {
    @apply text-white bg-mygray-500 border border-white;
  }
</style>
