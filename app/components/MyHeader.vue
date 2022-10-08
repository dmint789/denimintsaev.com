<template>
  <div :class="getDivClasses">
    <h1 :class="getH1Classes">
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
      getDivClasses(): string {
        let classes = this.nocenter ? '' : 'mx-auto ';

        if (this.size > 1) classes += `py-${this.size - 1} `;
        else classes += 'py-1 ';

        classes += `md:py-${this.size}`;
        return classes;
      },
      getH1Classes(): string {
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
