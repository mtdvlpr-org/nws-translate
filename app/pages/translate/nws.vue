<template>
  <UPage>
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
        <UPageAnchors :links="links" />
      </UPageAside>
    </template>

    <UPageHeader
      :title="title"
      headline="Vertalen"
      :description="description"
    />

    <UPageBody>
      <template v-if="menuItems.length">
        <UInputMenu
          v-if="menuItems.length"
          virtualize
          :items="menuItems"
          placeholder="Zoeken..."
          :filter-fields="['value', 'text', 'reference']"
        />
        <NuxtPage />
      </template>
      <UAlert
        v-else
        color="warning"
        variant="subtle"
        title="Geen keys gevonden"
        description="Importeer eerst teksten vanuit Google Docs om te kunnen vertalen."
        :actions="[
          { label: 'Ga naar Importeren', variant: 'link', to: '/import' },
        ]"
      />
    </UPageBody>
  </UPage>
</template>
<script setup lang="ts">
import type { InputMenuItem } from "@nuxt/ui";

const uiStore = useUIStore();

const search = ref("");

const links = computed((): PageLink[] =>
  uiStore.keys
    .filter((key) => {
      if (!search.value || search.value.trim().length < 3) return true;
      const normalizedKey = key.toLowerCase();
      const normalizedSearch = search.value.toLowerCase();
      return (
        normalizedKey.includes(normalizedSearch) ||
        uiStore.translations[key]?.toLowerCase().includes(normalizedSearch) ||
        uiStore.references[key]?.toLowerCase().includes(normalizedSearch)
      );
    })
    .map((key) => ({
      label: key,
      to: `/translate/nws/${key}`,
    })),
);

const menuItems = computed((): InputMenuItem[] =>
  links.value.map((link) => ({
    label: link.label,
    onSelect: () => {
      navigateTo(link.to);
    },
    reference: uiStore.references[link.label],
    text: uiStore.translations[link.label],
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

const title = "NWS UI";
const description = "Vertaal op deze pagina de NWS UI.";

useSeoMeta({
  description,
  ogDescription: description,
  ogTitle: title,
  title,
});
</script>
