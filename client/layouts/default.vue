<script setup lang="ts">
withDefaults(
  defineProps<{
    dark?: boolean;
  }>(),
  {
    dark: false,
  },
);

const menuOpen = ref(false);
const width = ref(0);

const onResize = () => {
  width.value = window.innerWidth;
};

onMounted(() => {
  window.addEventListener('resize', onResize);
  onResize();
});

onUnmounted(() => {
  window.removeEventListener('resize', onResize);
});

const menuVisible = computed((): boolean => {
  // 640px is sm, 768px is md, 1024px is lg
  return menuOpen.value || width.value >= 768;
});
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <nav class="py-4 bg-black">
      <div class="mx-auto px-3 w-full max-w-screen-lg flex flex-wrap justify-between items-center text-white">
        <NuxtLink to="/" class="flex-shrink-0 text-2xl font-semibold hover:text-gray-300">
          Deni Mintsaev
        </NuxtLink>
        <div class="block md:hidden">
          <!-- This needs to be a hamburger icon -->
          <button
            class="flex items-center px-3 py-2 border rounded text-white border-white hover:text-gray-300 hover:border-gray-300"
            @click="() => (menuOpen = !menuOpen)"
          >
            Menu
          </button>
        </div>
        <div
          class="flex-grow w-full pt-2 md:w-auto md:pt-0 md:flex md:justify-end md:items-center"
          v-if="menuVisible"
        >
          <MyButton noBorder link="/">Home</MyButton>
          <MyButton noBorder link="/projects">Projects</MyButton>
          <MyButton noBorder link="/blog">Blog</MyButton>
          <MyButton noBorder link="/patreon">Patreon</MyButton>
          <MyButton noBorder link="/contact">Contact</MyButton>
        </div>
      </div>
    </nav>

    <div class="flex-1 flex">
      <div class="w-screen" :class="dark ? 'bg-mygray-900' : 'bg-white'">
        <slot />
      </div>
    </div>

    <footer class="py-6 bg-black">
      <h4 class="text-center text-white">Deni Mintsaev 2022</h4>
    </footer>
  </div>
</template>
