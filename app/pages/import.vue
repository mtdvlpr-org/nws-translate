<template>
  <UPage class="px-4">
    <UPageHeader :title="title" :description="description" />
    <UPageBody>
      <UPageCard title="Vertaling">
        <TranslationFileForm v-model="translationsString" required />
      </UPageCard>
      <UPageCard title="Origineel">
        <TranslationFileForm
          v-model="originalsString"
          :field="{
            description: 'Plak tekst uit het referentie Google Docs bestand.',
          }"
        />
      </UPageCard>
    </UPageBody>
  </UPage>
</template>
<script setup lang="ts">
const title = "Importeren";
const description =
  "Importeer op deze pagina de originele en vertaalde teksten.";

useSeoMeta({
  description,
  ogDescription: description,
  ogTitle: title,
  title,
});

const importStore = useImportStore();
const { originalsString, translationsString } = storeToRefs(importStore);

watch(translationsString, (newVal) => {
  importStore.translations = parseTranslationFile(newVal);
});
</script>
