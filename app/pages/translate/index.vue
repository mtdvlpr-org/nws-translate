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
        <UPageCard
          v-for="(card, index) in cards"
          :key="index"
          v-bind="card"
          :highlight="card.inconsistent > 0 || card.missing > 0"
          :highlight-color="card.missing > 0 ? 'error' : 'warning'"
          :description="`${card.count} records.${card.missing > 0 ? ` ${card.missing} ontbrekende vertaling(en).` : ''}${card.inconsistent > 0 ? ` ${card.inconsistent} mogelijke inconsistentie(s).` : ''}`"
        />
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
            {
              label: 'Markeer als consistent',
              color: 'neutral',
              onClick: () => uiStore.markUIConsistent(term.key),
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
const jsonStore = useJsonStore();

const cards = computed(
  (): (PageCardProps & {
    count: number;
    inconsistent: number;
    missing: number;
  })[] => {
    return [
      {
        count: uiStore.keys.length,
        icon: "i-lucide:monitor",
        inconsistent: uiStore.inconsistentNWS.length,
        missing: uiStore.missingNWS.length,
        title: "NWS UI",
        to: "/translate/nws",
      },
      {
        count: uiStore.nwpKeys.length,
        icon: "i-lucide:smartphone",
        inconsistent: 0,
        missing: uiStore.missingNWP.length,
        title: "NWP UI",
        to: "/translate/nwp",
      },
      {
        count: jsonStore.originals.literature?.length ?? 0,
        icon: "i-lucide:book-open",
        inconsistent: 0,
        missing: jsonStore.missingLiterature.length,
        title: "Lectuur",
        to: "/translate/literature",
      },
      {
        count: jsonStore.originals.outlines?.length ?? 0,
        icon: "i-lucide:file-text",
        inconsistent: 0,
        missing: jsonStore.missingOutlines.length,
        title: "Lezingen",
        to: "/translate/outlines",
      },
      {
        count: jsonStore.originals.songs?.length ?? 0,
        icon: "i-lucide:music",
        inconsistent: 0,
        missing: jsonStore.missingSongs.length,
        title: "Liederen",
        to: `/translate/songs`,
      },
      {
        count: jsonStore.originals.tips?.length ?? 0,
        icon: "i-lucide:lightbulb",
        inconsistent: jsonStore.inconsistentTips.length,
        missing: jsonStore.missingTips.length,
        title: "Tips",
        to: "/translate/tips",
      },
    ];
  },
);

const title = "Vertalen";
const description = "Kies een groep records om te vertalen.";

useSeoMeta({
  description,
  ogDescription: description,
  ogTitle: title,
  title,
});
</script>
