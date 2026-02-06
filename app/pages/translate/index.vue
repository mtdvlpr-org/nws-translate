<template>
  <UPage>
    <UPageHeader :title="title" :description="description" />

    <UPageBody>
      <UAlert
        v-if="cards.every((card) => card.description === '0 records.')"
        color="warning"
        variant="subtle"
        title="Geen teksten gevonden"
        :actions="[
          { label: 'Ga naar Importeren', variant: 'link', to: '/import' },
        ]"
        description="Importeer eerst teksten vanuit Google Docs of een .json-bestand om te kunnen vertalen."
      />
      <UPageGrid>
        <UPageCard v-for="(card, index) in cards" :key="index" v-bind="card" />
      </UPageGrid>
      <template v-if="uiStore.uiInconsistencies.length > 0">
        <p>{{ uiStore.uiInconsistencies.length }} UI inconsistentie(s):</p>
        <UAlert
          v-for="term in uiStore.uiInconsistencies"
          :key="term.key"
          color="warning"
          variant="subtle"
          :title="`Inconsistentie in de key: ${term.key}`"
          :description="`NWS: ${term.nws} • NWP: ${term.nwp}`"
          :actions="[
            {
              label: 'Open NWS term',
              variant: 'link',
              to: `/translate/nws/${term.key}`,
            },
            {
              label: 'Open NWP term',
              variant: 'link',
              to: `/translate/nwp/${term.key}`,
            },
          ]"
        />
      </template>
    </UPageBody>
  </UPage>
</template>
<script setup lang="ts">
import type { PageCardProps } from "@nuxt/ui";
const uiStore = useUIStore();
const translationStore = useTranslationStore();

const cards = computed((): PageCardProps[] => {
  return [
    {
      description: `${uiStore.keys.length} records. ${uiStore.inconsistentNWS.length > 0 ? `${uiStore.inconsistentNWS.length} mogelijke inconsistentie(s).` : ""}`,
      icon: "i-lucide:monitor",
      title: "NWS UI",
      to: "/translate/nws",
    },
    {
      description: `${uiStore.nwpKeys.length} records.`,
      icon: "i-lucide:smartphone",
      title: "NWP UI",
      to: "/translate/nwp",
    },
    {
      description: `${translationStore.originals.literature?.length ?? 0} records.`,
      icon: "i-lucide:book-open",
      title: "Lectuur",
      to: "/translate/literature",
    },
    {
      description: `${translationStore.originals.outlines?.length ?? 0} records.`,
      icon: "i-lucide:file-text",
      title: "Lezingen",
      to: "/translate/outlines",
    },
    {
      description: `${translationStore.originals.songs?.length ?? 0} records.`,
      icon: "i-lucide:music",
      title: "Liederen",
      to: "/translate/songs",
    },
    {
      description: `${translationStore.originals.tips?.length ?? 0} records. ${translationStore.inconsistentTips.length > 0 ? `${translationStore.inconsistentTips.length} inconsistentie(s).` : ""}`,
      icon: "i-lucide:lightbulb",
      title: "Tips",
      to: "/translate/tips",
    },
  ];
});

const title = "Vertalen";
const description = "Kies een groep records om te vertalen.";

useSeoMeta({
  description,
  ogDescription: description,
  ogTitle: title,
  title,
});
</script>
