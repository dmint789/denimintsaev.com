<script setup lang="ts">
useHead({
  title: "Patreon | Deni's Site",
  meta: [
    {
      name: 'description',
      content:
        'The about page for my Patreon with descriptions of the tiers, a list of all my supporters and a link to the Patreon page itself.',
    },
  ],
});
</script>

<template>
  <PageSection>
    <MyHeader :size="5">Patreon</MyHeader>
  </PageSection>
</template>
