<script setup lang="ts">
import ButtonSize from '~/helpers/ButtonSize';

interface Props {
  size?: ButtonSize;
  selected?: boolean;
}

withDefaults(defineProps<Props>(), {
  size: 'full',
  selected: false,
});

defineEmits<{
  (e: 'click'): void;
}>();
</script>

<template>
  <MyButton :size="size" grayHover :active="selected" @click="$emit('click')">
    <slot />
  </MyButton>
</template>
