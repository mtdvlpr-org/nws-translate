<template>
  <UPage>
    <UPageHeader
      :title="title"
      headline="Vertalen"
      :description="description"
    />

    <UPageBody>
      <TipForm
        v-for="(tip, i) in translationStore.originals.tips"
        :key="i"
        :index="i"
        :tip="tip"
      />
    </UPageBody>
  </UPage>
</template>
<script setup lang="ts">
const translationStore = useTranslationStore();

const title = "Tips";
const description = "Vertaal op deze pagina de tips.";

useSeoMeta({
  description,
  ogDescription: description,
  ogTitle: title,
  title,
});
</script>
