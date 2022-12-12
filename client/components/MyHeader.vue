<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    noCenter?: boolean;
    size?: number;
    noPadd?: boolean;
    white?: boolean;
  }>(),
  {
    noCenter: false,
    size: 3,
    noPadd: false,
    white: false,
  },
);
</script>

<template>
  <div
    :class="[
      noCenter ? '' : 'mx-auto',
      !noPadd && size > 1 ? `py-${size - 1}` : 'py-1',
      !noPadd ? `md:py-${size}` : '',
    ]"
  >
    <h1
      :class="[
        noCenter ? '' : 'text-center',
        `text-${size > 2 ? size - 1 : ''}xl`,
        `md:text-${Math.max(size, 2)}xl`,
        white ? 'text-white' : 'text-black',
      ]"
    >
      <slot />
    </h1>
  </div>
</template>
