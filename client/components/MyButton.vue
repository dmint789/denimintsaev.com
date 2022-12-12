<script setup lang="ts">
import ButtonSize from '~/helpers/ButtonSize';

const props = withDefaults(
  defineProps<{
    size?: ButtonSize;
    white?: boolean;
    // Used for the selection button component
    grayHover?: boolean;
    // For now the only use for noBorder is in the nav bar, which needs to have smaller buttons.
    // This is not compatible with size 'any'.
    noBorder?: boolean;
    external?: boolean;
    disabled?: boolean;
    active?: boolean;
    link?: string;
  }>(),
  {
    size: 'any',
    white: false,
    grayHover: false,
    noBorder: false,
    external: false,
    disabled: false,
    active: false,
  },
);

defineEmits<{
  (e: 'click'): void;
}>();

const classForSize = computed((): string => {
  switch (props.size) {
    case 'xs':
      return 'w-24';
    case 'sm':
      return 'w-32';
    case 'md':
      return 'w-40';
    case 'lg':
      return 'w-52';
    case 'full':
      return 'w-full';
    default:
      return 'px-3';
  }
});
</script>

<template>
  <NuxtLink
    :href="link"
    :target="link && link[0] !== '/' ? '_blank' : '_self'"
    :disabled="disabled"
    class="button flex justify-center items-center"
    :class="[
      noBorder ? 'h-12' : 'h-14',
      noBorder ? 'px-2' : 'border',
      classForSize,
      (white && !active) || (!white && active) ? 'white' : 'black',
      active ? '' : grayHover ? 'gray-hover' : 'hover',
      disabled ? 'disabled' : '',
    ]"
    @click="$emit('click')"
  >
    <slot />
  </NuxtLink>
</template>

<style lang="postcss" scoped>
.button {
  @apply box-content focus:outline-none text-center text-xl md:text-2xl transition-all cursor-pointer;
}

.white {
  @apply text-black bg-white border-black;

  &.hover {
    @apply hover:text-white hover:bg-black hover:border-white;
  }
}

.black {
  @apply text-white bg-black border-white;

  &.hover {
    @apply hover:text-black hover:bg-white hover:border-black;
  }
}

.gray-hover {
  @apply hover:text-black hover:bg-mygray-200 hover:border-black;
}

.disabled {
  @apply text-white bg-mygray-500 border border-white;
}
</style>
