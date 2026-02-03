<template>
  <UPage class="px-4">
    <template #left>
      <UPageAside>
        <template #top>
          <UInput v-model="search" placeholder="Filter...">
            <template v-if="search?.length" #trailing>
              <UButton
                size="sm"
                variant="link"
                color="neutral"
                icon="i-lucide-circle-x"
                aria-label="Verwijder filter"
                @click="search = ''"
              />
            </template>
          </UInput>
        </template>
        <UPageLinks :links="links" />
      </UPageAside>
    </template>

    <UPageHeader :title="title" :description="description" />

    <UPageBody>
      <UInputMenu
        virtualize
        :items="menuItems"
        placeholder="Zoeken..."
        :filter-fields="['value', 'text', 'reference']"
      />
      <NuxtPage />
    </UPageBody>
  </UPage>
</template>
<script setup lang="ts">
import type { InputMenuItem } from "@nuxt/ui";

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

const links = computed((): PageLink[] =>
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

const menuItems = computed((): InputMenuItem[] =>
  links.value.map((link) => ({
    label: link.label,
    onSelect: () => {
      navigateTo(link.to);
    },
    reference: importStore.references[link.label],
    text: importStore.translations[link.label],
    value: link.label,
  })),
);

const pageStore = usePageStore();

watchImmediate(links, (links) => {
  pageStore.pageLinks = links;
});

onBeforeUnmount(() => {
  pageStore.pageLinks = [];
});
</script>
