<template>
  <UPage>
    <UPageHeader :title="title" :description="description" />
    <UPageBody>
      <UPageCard title="Vertaling">
        <TranslationFileForm v-model="translationsString" required />
      </UPageCard>
      <UPageCard title="Origineel">
        <div class="flex gap-4">
          <UButton
            loading-auto
            class="w-fit"
            color="neutral"
            label="Vul automatisch in"
            @click="autoFillOriginals"
          />
          <UButton
            class="w-fit"
            color="error"
            label="Reset"
            @click="originalsString = undefined"
          />
        </div>
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

const { showError } = useFlash();
const loadingOriginals = ref(false);

const autoFillOriginals = async () => {
  loadingOriginals.value = true;
  try {
    const strings = await $fetch<string>(
      "https://docs.google.com/feeds/download/documents/export/Export?exportFormat=txt&id=1KOm9MTLrWv_lll6f1YvnlWlq3srXYVKMSo2a9KZ39a8",
      { responseType: "text" },
    );
    originalsString.value = strings.trim().replaceAll("\r", "");
  } catch {
    showError({
      description:
        "Er is een fout opgetreden bij het ophalen van de originele teksten.",
    });
  }
  loadingOriginals.value = false;
};
</script>
