<template>
  <UPage>
    <UPageHeader :title="title" :description="description" />
    <UPageBody>
      <UIChanges type="NWS" />
      <UIChanges type="NWP" />
      <JsonChanges type="literature" />
      <JsonChanges type="outlines" />
      <JsonChanges type="songs" />
      <JsonChanges type="tips" />
      <UPageCard title="Bestanden">
        <div class="flex flex-wrap gap-2">
          <UButton
            class="w-fit"
            label="Zipbestand met veranderingen"
            @click="exportChangedFiles"
          />
          <UButton
            v-for="file in jsonFiles"
            :key="file.name"
            class="w-fit"
            color="neutral"
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
const jsonStore = useJsonStore();

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
      changed: jsonStore.changedGroups.includes("literature"),
      data: jsonStore.translations.literature,
      name: "Literature",
    },
    {
      changed: jsonStore.changedGroups.includes("outlines"),
      data: jsonStore.translations.outlines,
      name: "Outlines",
    },
    {
      changed: false, // Don't include in zip file
      data: uiStore.translations,
      name: "ProgramUI",
    },
    {
      changed: jsonStore.changedGroups.includes("songs"),
      data: jsonStore.translations.songs,
      name: "Songs",
    },
    {
      changed: jsonStore.changedGroups.includes("tips"),
      data: jsonStore.translations.tips,
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

const exportChangedFiles = async () => {
  try {
    const blob = await $fetch<Blob>("/api/export", {
      body: {
        files: jsonFiles.value
          .filter(({ changed }) => changed)
          .map((file) => ({
            data: file.data,
            name: file.name + ".json",
          })),
      },
      method: "POST",
      responseType: "blob",
    });

    // Create a download link and trigger it
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "translations.zip";
    link.click();

    // Clean up
    URL.revokeObjectURL(url);
    link.remove();
  } catch (e) {
    console.error(e);
    showError({
      description: "Kon zipbestand niet downloaden.",
      id: "export-zip-error",
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
