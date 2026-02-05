<template>
  <UPage>
    <UPageHeader :title="title" :description="description" />
    <UPageBody>
      <UIChanges type="NWS" />
      <UIChanges type="NWP" />
      <UPageCard title="Bestanden">
        <div class="flex flex-wrap gap-2">
          <UButton
            v-for="file in jsonFiles"
            :key="file.name"
            class="w-fit"
            :label="`${file.name}.json`"
            @click="exportJSON(file.name, file.data)"
          />
        </div>
      </UPageCard>
    </UPageBody>
  </UPage>
</template>
<script setup lang="ts">
const uiStore = useUIStore();
const translationStore = useTranslationStore();

const { showError } = useFlash();

// const exportGoogleDocs = async () => {
//   try {
//     await navigator.clipboard.writeText(
//       serializeTranslationFile(uiStore.translations),
//     );
//     showSuccess({
//       description: "Tekst gekopieerd naar klembord.",
//       id: "export-docs",
//     });
//   } catch (e) {
//     console.error(e);
//     showError({
//       description: "Kon tekst niet kopiëren.",
//       id: "export-docs-error",
//     });
//   }
// };

const jsonFiles = computed(() => {
  return [
    {
      data: translationStore.translations.literature,
      name: "Literature",
    },
    {
      data: translationStore.translations.outlines,
      name: "Outlines",
    },
    {
      data: uiStore.translations,
      name: "ProgramUI",
    },
    {
      data: translationStore.translations.songs,
      name: "Songs",
    },
    {
      data: translationStore.translations.tips,
      name: "Tips",
    },
  ];
});

const exportJSON = <T,>(name: string, data: T) => {
  try {
    const href = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
    const link = document.createElement("a");
    link.href = href;
    link.download = `${name}.json`;
    link.click();
    link.remove();
  } catch (e) {
    console.error(e);
    showError({
      description: "Kon bestand niet downloaden.",
      id: "export-file-error",
    });
  }
};

const title = "Exporteren";
const description = "Exporteer op deze pagina de vertaalde teksten.";

useSeoMeta({
  description,
  ogDescription: description,
  ogTitle: title,
  title,
});
</script>
