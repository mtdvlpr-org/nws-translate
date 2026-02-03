<template>
  <UPage class="px-4">
    <template #left>
      <UPageAside>
        <template #top>
          <UInput v-model="search" placeholder="Filter..." />
        </template>
        <UPageLinks :links="links" />
      </UPageAside>
    </template>

    <UPageHeader :title="title" :description="description" />

    <UPageBody>
      <NuxtPage />
    </UPageBody>
  </UPage>
</template>
<script setup lang="ts">
import type { PageAnchor } from "@nuxt/ui";

const title = "Vertalen";
const description = "Vertaal op deze pagina de teksten.";

useSeoMeta({
  description,
  ogDescription: description,
  ogTitle: title,
  title,
});

const importStore = useImportStore();

const search = ref("");

const links = computed((): PageAnchor[] =>
  importStore.keys
    .filter((key) => {
      if (!search.value || search.value.trim().length < 3) return true;
      const normalizedKey = key.toLowerCase();
      const normalizedSearch = search.value.toLowerCase();
      return (
        normalizedKey.includes(normalizedSearch) ||
        importStore.translations[key]
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        importStore.references[key]?.toLowerCase().includes(normalizedSearch)
      );
    })
    .map((key) => ({
      label: key,
      to: `/translate/${key}`,
    })),
);
</script>
