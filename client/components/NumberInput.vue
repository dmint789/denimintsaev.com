<script setup lang="ts">
// THIS COMPONENT ONLY WORKS WITH POSITIVE NUMBERS FOR NOW

const props = withDefaults(
  defineProps<{
    name: string;
    placeholder?: string;
    modelValue?: number;
    default?: number;
    min?: number;
    max: number;
    disabled?: boolean;
  }>(),
  {
    placeholder: '',
    modelValue: 0,
    default: 0,
    min: 0,
    disabled: false,
  },
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | null);
}>();

const input = ref(null);

const onInput = (newValue: string) => {
  let output: number | null;

  // If value is empty, return null
  if (newValue === '') {
    output = null;
  }
  // If value contains a character, just ignore it and use the old value
  else if (/[^0-9]/.test(newValue)) {
    output = props.modelValue;
  }
  // If we don't have a 0 in the beginning of a multidigit number, convert the input
  // to a number and clamp it between the minimum and the maximum values
  else if (newValue[0] !== '0' || newValue.length > 1) {
    output = Math.min(Math.max(Number(newValue), props.min), props.max);
  }
  // If invalid, reset it to the default value
  else {
    output = props.default;
  }

  // Emit and update input value, so that it doesn't update itself
  emit('update:modelValue', output);
  input.value.value = output === null ? '' : output.toString();
};
</script>

<template>
  <input
    type="text"
    ref="input"
    :id="name"
    :name="name"
    :placeholder="placeholder"
    :value="modelValue"
    @input="(e: any) => onInput(e.target.value)"
    :disabled="disabled"
    :class="{ disabled }"
  />
</template>

<style lang="postcss" scoped>
input {
  @apply h-12 px-3 border-2 border-black focus:outline-none text-xl;

  &.disabled {
    @apply border-mygray-800 bg-mygray-100 text-mygray-700;
  }
}
</style>
