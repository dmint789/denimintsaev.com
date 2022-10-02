<template>
  <div :class="(nocenter ? '' : 'w-full text-center ') + `pb-${size}`">
    <h1 :class="getClasses">
      <slot />
    </h1>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';

  export default Vue.extend({
    name: 'MyHeader',
    props: {
      nocenter: {
        type: Boolean,
        default: false,
      },
      size: {
        type: Number,
        default: 3,
      },
      white: {
        type: Boolean,
        default: false,
      },
    },
    computed: {
      getClasses(): string {
        let classes: string;

        if (this.size === 1) classes = 'text-xl';
        else classes = `text-${this.size}xl`;

        if (this.white) classes += ' text-white';
        else classes += ' text-black';

        return classes;
      },
    },
  });
</script>

<style lang="postcss" scoped></style>
