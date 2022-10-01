<template>
  <div class="min-h-screen flex flex-col">
    <nav class="p-6 bg-black">
      <div class="w-full max-w-5xl mx-auto flex flex-wrap justify-between items-center text-white">
        <span class="flex-shrink-0 text-2xl font-semibold">Deni Mintsaev</span>
        <div class="block lg:hidden">
          <!-- This needs to be a hamburger icon -->
          <button
            class="flex items-center px-3 py-2 border rounded text-white border-white hover:text-gray-300 hover:border-gray-300"
            @click="() => (menuOpen = !menuOpen)"
          >
            Menu
          </button>
        </div>
        <div class="block w-full flex-grow justify-end lg:flex lg:items-center lg:w-auto" v-if="menuVisible">
          <div class="text-lg">
            <a href="/">Home</a>
            <a href="/projects">Projects</a>
            <a href="/blog">Blog</a>
            <a href="/patreon">Patreon</a>
            <a href="/contact">Contact</a>
          </div>
        </div>
      </div>
    </nav>
    <div class="flex-1 flex">
      <Nuxt class="w-screen" />
    </div>
    <footer class="py-6 bg-black">
      <h4 class="text-center text-white">Deni Mintsaev 2022</h4>
    </footer>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';

  export default Vue.extend({
    name: 'Navbar',
    data() {
      return {
        menuOpen: false,
        width: 0,
      };
    },
    mounted() {
      window.addEventListener('resize', this.onResize);
      this.onResize();
    },
    destroyed() {
      window.removeEventListener('resize', this.onResize);
    },
    computed: {
      menuVisible(): boolean {
        return this.menuOpen || this.width >= 1024; // 1024px is lg
      },
    },
    methods: {
      onResize() {
        this.width = window.innerWidth;
      },
    },
  });
</script>

<style lang="postcss" scoped>
  a {
    @apply mt-4 lg:inline-block lg:mt-0 hover:text-gray-300;
  }
  a:not(:last-child) {
    @apply mr-6;
  }
</style>
