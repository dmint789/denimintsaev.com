<script setup lang="ts">
useHead({
  title: "Blog | Deni's Site",
  meta: [
    {
      name: 'description',
      content:
        'My personal blog, where I share my most interesting experiences as well as some educational stuff about language learning and other things.',
    },
  ],
});
</script>

<template>
  <PageSection>
    <MyHeader :size="5">Blog</MyHeader>
  </PageSection>
</template>
