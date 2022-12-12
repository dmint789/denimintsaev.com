<script setup lang="ts">
withDefaults(
  defineProps<{
    name: string;
    text?: string;
    labelLeft?: boolean;
    checked?: boolean;
    disabled?: boolean;
  }>(),
  {
    text: '',
    labelLeft: false,
    checked: false,
    disabled: false,
  },
);

defineEmits<{
  (e: 'change', value: boolean | null): void;
}>();
</script>

<template>
  <div class="cb-container">
    <label v-if="labelLeft && text" :for="name" :class="disabled ? 'text-mygray-600' : 'text-black'">{{
      text
    }}</label>
    <input
      type="checkbox"
      :id="name"
      :name="name"
      @change="(e: any) => $emit('change', e.target.checked)"
      :checked="checked"
      :disabled="disabled"
      class="w-5 h-5"
    />
    <label v-if="!labelLeft && text" :for="name" :class="disabled ? 'text-mygray-600' : 'text-black'">{{
      text
    }}</label>
  </div>
</template>

<style lang="postcss" scoped>
.cb-container {
  @apply flex items-center gap-3;

  input {
    @apply flex-shrink-0;
  }
}
</style>
