<template>
  <div class="w-full text-center" :class="`p-${size}`">
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
      black: {
        type: Boolean,
        default: true,
      },
      size: {
        type: Number,
        default: 3,
      },
    },
    computed: {
      getClasses(): string {
        let classes: string;

        if (this.size === 1) classes = 'text-xl';
        else classes = `text-${this.size}xl`;

        if (this.black) classes += ' text-black';
        else classes += ' text-white';

        return classes;
      },
    },
  });
</script>

<style lang="postcss" scoped></style>
