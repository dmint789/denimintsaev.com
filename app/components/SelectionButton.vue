<template>
  <MyButton size="full" grayHover :active="selected" @click="$emit('click')">
    <slot />
  </MyButton>
</template>

<script lang="ts">
  import Vue from 'vue';

  export default Vue.extend({
    name: 'SelectionButton',
    props: {
      selected: {
        type: Boolean,
        default: false,
      },
    },
  });
</script>

<style lang="postcss" scoped></style>
