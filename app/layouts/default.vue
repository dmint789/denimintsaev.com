<template>
  <div>
    <nav
      class="flex items-center justify-between flex-wrap bg-black px-32 py-6"
    >
      <div class="flex items-center flex-shrink-0 text-white mr-8">
        <span class="text-2xl font-semibold">Deni Mintsaev</span>
      </div>
      <div class="block lg:hidden">
        <!-- This needs to be a hamburger icon -->
        <button
          class="flex items-center px-3 py-2 border rounded text-white border-white hover:text-gray-300 hover:border-gray-300"
          @click="() => (menuOpen = !menuOpen)"
        >
          Menu
        </button>
      </div>
      <div
        class="w-full block flex-grow justify-end lg:flex lg:items-center lg:w-auto"
        v-if="menuVisible"
      >
        <div class="text-lg">
          <a
            href="/"
            class="mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-300 mr-6"
            >Home</a
          >
          <a
            href="/projects"
            class="mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-300 mr-6"
            >Projects</a
          >
          <a
            href="/blog"
            class="mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-300 mr-6"
            >Blog</a
          >
          <a
            href="/patreon"
            class="mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-300 mr-6"
            >Patreon</a
          >
          <a
            href="/contact"
            class="mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-300"
            >Contact</a
          >
        </div>
      </div>
    </nav>
    <Nuxt />
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
        return this.menuOpen || this.width >= 1024;
      },
    },
    methods: {
      onResize() {
        this.width = window.innerWidth;
      },
    },
  });
</script>

<style lang="postcss" scoped></style>
