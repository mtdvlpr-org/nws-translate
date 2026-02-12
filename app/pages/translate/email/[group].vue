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
          :filter-fields="['value', 'text']"
        />
        <NuxtPage />
      </template>
      <UAlert
        v-else
        color="warning"
        variant="subtle"
        title="Geen e-mailtemplates gevonden"
        description="Importeer eerst teksten vanuit lokale .txt-bestanden om te kunnen vertalen."
        :actions="[
          { label: 'Ga naar Importeren', variant: 'link', to: '/import' },
        ]"
      />
    </UPageBody>
  </UPage>
</template>
<script setup lang="ts">
import type { InputMenuItem } from "@nuxt/ui";

const groupKey = useRouteParams<EmailKey>("group");

const group = computed(() =>
  emailGroups.find((group) => group.key === groupKey.value),
);

onMounted(() => {
  if (!group.value) {
    navigateTo("/translate");
  }
});

const search = ref("");
const emailStore = useEmailStore();

const links = computed((): PageLink[] =>
  Object.entries(emailStore[groupKey.value] ?? {})
    .filter(([, g]) => {
      if (!g) return false;
      if (!search.value || search.value.trim().length < 3) return true;
      const normalizedSearch = search.value.toLowerCase();
      return (
        g.input?.title?.toLowerCase().includes(normalizedSearch) ||
        g.input?.text?.toLowerCase().includes(normalizedSearch) ||
        g.originals?.title?.toLowerCase().includes(normalizedSearch) ||
        g.originals?.text?.toLowerCase().includes(normalizedSearch) ||
        g.translations?.title?.toLowerCase().includes(normalizedSearch) ||
        g.translations?.text?.toLowerCase().includes(normalizedSearch) ||
        false
      );
    })
    .map(([nr, g]) => ({
      label:
        g?.translations?.title ??
        g?.input?.text ??
        g?.originals?.title ??
        `E-mail #${nr}`,
      to: `/translate/email/${groupKey.value}/${nr}`,
    })),
);

const menuItems = computed((): InputMenuItem[] =>
  links.value.map((link) => ({
    label: link.label,
    onSelect: () => {
      navigateTo(link.to);
    },
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

const title = `${group.value?.label} (e-mailtemplates)`;
const description = `Vertaal op deze pagina de e-mailtemplates van de groep ${group.value?.label}.`;

useSeoMeta({
  description,
  ogDescription: description,
  ogTitle: title,
  title,
});
</script>
