<template>
  <UPage class="px-4">
    <UPageHeader :title="title" :description="description" />
    <UPageBody>
      <UPageCard title="Veranderingen">
        <template v-if="isDifferent">
          <DiffViewer
            :new-string="translations"
            :old-string="remoteTranslations"
          />
          <UButton
            class="w-fit"
            color="error"
            label="Reset lokale veranderingen"
            @click="resetTranslations"
          />
        </template>
        <p v-else>Geen veranderde teksten gevonden.</p>
      </UPageCard>
      <UPageCard v-if="isDifferent" title="Veranderde teksten">
        <TranslationForm
          v-for="key in changedKeys"
          :key="key"
          :translation-key="key"
        />
      </UPageCard>
      <UPageCard title="Exporteer">
        <UButton class="w-fit" label="Google Docs" @click="exportGoogleDocs" />
        <UButton
          class="w-fit"
          label="ProgramUI.json"
          @click="exportProgramUI"
        />
      </UPageCard>
    </UPageBody>
  </UPage>
</template>
<script setup lang="ts">
const title = "Exporteren";
const description = "Exporteer op deze pagina de vertaalde teksten.";

useSeoMeta({
  description,
  ogDescription: description,
  ogTitle: title,
  title,
});

const importStore = useImportStore();
const remoteTranslations = computed(() => {
  return JSON.stringify(importStore.remoteTranslations, null, 2);
});

const translations = computed(() => {
  return JSON.stringify(importStore.translations, null, 2);
});

const isDifferent = computed(() => {
  return remoteTranslations.value !== translations.value;
});

const changedKeys = computed(() => {
  return Object.keys(importStore.translations).filter((key) => {
    return (
      importStore.translations[key] !== importStore.remoteTranslations[key]
    );
  });
});

const resetTranslations = () => {
  importStore.translations = parseTranslationFile(
    importStore.translationsString,
  );
};

const { showError, showSuccess } = useFlash();

const exportGoogleDocs = async () => {
  try {
    await navigator.clipboard.writeText(
      serializeTranslationFile(importStore.translations),
    );
    showSuccess({ description: "Tekst gekopieerd naar klembord." });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    showError({ description: "Kon tekst niet kopiëren." });
  }
};

const exportProgramUI = () => {
  const data = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(importStore.translations, null, 2))}`;
  const link = document.createElement("a");
  link.href = data;
  link.download = "ProgramUI.json";
  link.click();
  link.remove();
};
</script>
