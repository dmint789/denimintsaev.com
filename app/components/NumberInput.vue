<template>
  <input
    type="number"
    :id="name"
    :name="name"
    :placeholder="placeholder"
    :value="value === null ? '' : value"
    :min="min"
    :max="max"
    @change="(e) => onInput(e, true)"
    @input="(e) => onInput(e)"
    :disabled="disabled"
    :class="disabled ? 'disabled' : ''"
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
      value: {
        type: Number,
        default: 0,
      },
      default: {
        type: Number,
        default: 0,
      },
      min: {
        type: Number,
        default: 0,
      },
      max: {
        type: Number,
        required: true,
      },
      integer: {
        type: Boolean,
        default: false,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
    },
    methods: {
      onInput(e: any, change = false) {
        e.preventDefault();
        let val = e.target.value as string;
        let output: number;

        if (val !== '' || change) {
          if (isNaN(+val) || val === '') {
            output = this.default;
          } else {
            if (this.integer) output = parseInt(val);
            else output = Number(val);

            // Clamp the number between the minimum and the maximum values
            output = Math.min(Math.max(output, this.min), this.max);
          }
        } else {
          output = null;
        }

        this.$emit('change', output);
      },
    },
  });
</script>

<style lang="postcss" scoped>
  input {
    @apply h-12 px-3 border-2 border-black focus:outline-none text-xl;
  }

  input.disabled {
    @apply border-mygray-800 bg-mygray-100 text-mygray-700;
  }
</style>
