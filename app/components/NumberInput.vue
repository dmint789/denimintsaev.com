<template>
  <input
    type="number"
    :id="name"
    :name="name"
    :placeholder="placeholder"
    :min="min"
    :max="max"
    @change="(e) => $emit('change', e.target.value)"
  />
</template>

<script lang="ts">
  import Vue from 'vue';

  export default Vue.extend({
    name: 'NumberInput',
    props: {
      name: {
        type: String,
        required: true,
      },
      placeholder: {
        type: String,
        default: '',
      },
      min: {
        type: Number,
        default: 0,
      },
      max: {
        type: Number,
        required: true,
      },
    },
  });
</script>

<style lang="postcss" scoped>
  input {
    @apply h-16 px-3 border-2 border-black text-xl;
  }
</style>
