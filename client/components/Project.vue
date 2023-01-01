<script setup lang="ts">
defineProps<{
  link: string;
  image: string;
  title: string;
}>();
</script>

<template>
  <div
    class="flex flex-col md:grid md:grid-cols-[auto_1fr] items-center gap-4 md:gap-8 max-w-screen-lg my-5 p-3 md:p-5 bg-white"
  >
    <NuxtLink :href="link" :target="link && link[0] !== '/' ? '_blank' : '_self'" class="max-w-[85vw]">
      <img :src="image" class="md:h-[300px] aspect-square border-2 border-black p-2" />
    </NuxtLink>
    <div class="flex flex-col h-full justify-between items-center gap-6" style="height: 100%">
      <div class="flex flex-col items-center gap-4">
        <MyHeader>{{ title }}</MyHeader>
        <p class="text-justify">
          <slot />
        </p>
      </div>
      <MyButton :link="link">More</MyButton>
    </div>
  </div>
</template>
