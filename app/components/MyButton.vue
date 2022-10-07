<template>
  <NuxtLink v-if="link" :to="link" class="button flex justify-center items-center" :class="getClasses">
    <slot />
  </NuxtLink>
  <button v-else @click="$emit('click')" :disabled="disabled" class="button" :class="getClasses">
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
      grayHover: {
        type: Boolean,
        default: false,
      },
      noborder: {
        type: Boolean,
        default: false,
      },
      size: {
        type: String as () => 'sm' | 'md' | 'lg' | 'full' | 'any',
        default: 'any',
      },
      link: {
        type: String,
      },
    },
    computed: {
      getClasses() {
        let classes = '';

        // For now the only use for noborder is in the nav bar, which needs to have smaller buttons
        if (this.noborder) classes += 'h-12 px-2 ';
        else {
          switch (this.size) {
            case 'sm':
              classes += 'w-32 ';
              break;
            case 'md':
              classes += 'w-40 ';
              break;
            case 'lg':
              classes += 'w-52 ';
              break;
            case 'full':
              classes += 'w-full ';
              break;
            default:
              classes += 'px-3 ';
              break;
          }

          classes += 'h-14 border ';
        }

        if (this.disabled) classes += 'disabled ';
        else {
          if (this.white) {
            classes += 'white ';
            if (this.grayHover) classes += 'gray-hover ';
            else classes += 'white-hover ';
          } else {
            classes += 'black ';
            if (this.grayHover) classes += 'gray-hover ';
            else classes += 'black-hover ';
          }
        }

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
    @apply text-black bg-white border-black;
  }
  .white-hover {
    @apply hover:text-white hover:bg-black hover:border-white;
  }
  .black {
    @apply text-white bg-black border-white;
  }
  .black-hover {
    @apply hover:text-black hover:bg-white hover:border-black;
  }
  .gray-hover {
    @apply hover:text-black hover:bg-mygray-400 hover:border-black;
  }
  .disabled {
    @apply text-white bg-mygray-500 border border-white;
  }
</style>
