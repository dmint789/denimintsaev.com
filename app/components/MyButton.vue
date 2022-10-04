<template>
  <NuxtLink v-if="link" :to="link" class="button flex justify-center items-center" :class="getClasses">
    <slot />
  </NuxtLink>
  <button v-else @click="onClick" :disabled="disabled" class="button" :class="getClasses">
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
      noborder: {
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

        // For now the only use for noborder is in the nav bar, which needs to have smaller buttons
        if (this.noborder) classes = 'px-2 h-12 ';
        else classes = (this.small ? 'w-32' : 'w-40') + ' h-14 border ';

        classes += this.disabled ? 'disabled' : this.white ? 'white' : 'black';

        return classes;
      },
    },
  });
</script>

<style lang="postcss" scoped>
  .button {
    @apply box-content text-xl md:text-2xl transition-all;
  }

  .white {
    @apply text-black bg-white border-black hover:text-white hover:bg-black hover:border-white;
  }
  .black {
    @apply text-white bg-black border-white hover:text-black hover:bg-white hover:border-black;
  }
  .disabled {
    @apply text-white bg-mygray-500 border border-white;
  }
</style>
