<template>
  <UPage>
    <UPageHeader :title="title" :description="description" />

    <UPageBody>
      <UPageGrid>
        <UPageCard v-for="(card, index) in cards" :key="index" v-bind="card" />
      </UPageGrid>
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
      description: `${uiStore.keys.length} records.`,
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
      description: `${translationStore.originals.literature?.length} records.`,
      icon: "i-lucide:book-open",
      title: "Lectuur",
      to: "/translate/literature",
    },
    {
      description: `${translationStore.originals.outlines?.length} records.`,
      icon: "i-lucide:file-text",
      title: "Lezingen",
      to: "/translate/outlines",
    },
    {
      description: `${translationStore.originals.songs?.length} records.`,
      icon: "i-lucide:music",
      title: "Liederen",
      to: "/translate/songs",
    },
    {
      description: `${translationStore.originals.tips?.length} records.`,
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
