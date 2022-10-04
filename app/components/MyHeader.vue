<template>
  <div :class="nocenter ? '' : 'mx-auto ' + `py-${this.size > 1 ? this.size - 1 : 1} md:py-${size}`">
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
        let classes = this.nocenter ? '' : 'text-center ';

        if (this.size === 1 || this.size === 2) classes += 'text-xl ' + (this.size === 2 ? 'md:text-2xl ' : '');
        else classes += `text-${this.size - 1}xl md:text-${this.size}xl `;

        if (this.white) classes += 'text-white';
        else classes += 'text-black';

        return classes;
      },
    },
  });
</script>

<style lang="postcss" scoped></style>
