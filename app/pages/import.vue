<template>
  <UPage>
    <UPageHeader :title="title" :description="description" />
    <UPageBody>
      <UPageCard title="Originele teksten (Engels)">
        <UButton
          loading-auto
          class="w-fit"
          color="neutral"
          label="Vul NWS UI automatisch in"
          @click="autoFillOriginalUI"
        />
        <UFileUpload
          v-model="originalFiles"
          multiple
          layout="list"
          position="inside"
          :file-delete="false"
          class="w-full min-h-48"
          accept="application/json"
          :disabled="originalFiles.length > 0"
          label="Importeer vanuit lokale bestanden"
          @change="loadFiles(originalFiles, 'original')"
        />
        <ImportForm v-model="originals" no-nwp />
      </UPageCard>
      <UPageCard title="Vertalingen (Nederlands)">
        <UFileUpload
          v-model="translationFiles"
          multiple
          layout="list"
          position="inside"
          :file-delete="false"
          class="w-full min-h-48"
          accept="application/json"
          :disabled="translationFiles.length > 0"
          label="Importeer vanuit lokale bestanden"
          @change="loadFiles(translationFiles, 'translation')"
        />
        <ImportForm v-model="translations" />
      </UPageCard>
    </UPageBody>
  </UPage>
</template>
<script setup lang="ts">
import type { Output } from "~/components/ImportForm.vue";

const uiStore = useUIStore();
const { nwpString, originalsString, translationsString } = storeToRefs(uiStore);

const translationStore = useTranslationStore();

const originals = ref<Output>({
  nwp: nwpString.value,
  ui: originalsString.value,
  ...translationStore.originals,
});
const translations = ref<Output>({
  nwp: nwpString.value,
  ui: translationsString.value,
  ...translationStore.translations,
});

const { showSuccess } = useFlash();

watch(originalsString, (ui) => {
  originals.value = { ...originals.value, ui };
});

watch(translationsString, (ui) => {
  translations.value = { ...translations.value, ui };
});

watch(nwpString, (nwp) => {
  translations.value = { ...translations.value, nwp };
});

watch(originals, (val) => {
  originalsString.value = val.ui;
  translationStore.setOriginals(val);
  showSuccess({
    description: "Originele teksten zijn opgeslagen.",
    id: "originals-import",
  });
});

watch(translations, (val) => {
  // NWS
  translationsString.value = val.ui;
  uiStore.translations = parseTranslationFile(val.ui);

  // NWP
  nwpString.value = val.nwp;
  uiStore.nwpTranslations = val.nwp ? parseTranslationFile(val.nwp) : undefined;

  // JSON
  translationStore.setTranslations(val);

  showSuccess({
    description: "Vertalingen zijn opgeslagen.",
    id: "translations-import",
  });
});

const { showError } = useFlash();

const originalFiles = ref<File[]>([]);
const translationFiles = ref<File[]>([]);

const supportedFiles = [
  "Literature.json",
  "Outlines.json",
  "Songs.json",
  "Tips.json",
];

const loadFile = async (file: File, type: "original" | "translation") => {
  try {
    const text = JSON.parse(await file.text());

    switch (file.name) {
      case "Literature.json":
        if (type === "original") {
          originals.value = {
            ...originals.value,
            literature: literatureSchema.parse(text),
          };
        } else {
          translations.value = {
            ...translations.value,
            literature: literatureSchema.parse(text),
          };
        }
        break;
      case "Outlines.json":
        if (type === "original") {
          originals.value = {
            ...originals.value,
            outlines: outlinesSchema.parse(text),
          };
        } else {
          translations.value = {
            ...translations.value,
            outlines: outlinesSchema.parse(text),
          };
        }
        break;
      case "Songs.json":
        if (type === "original") {
          originals.value = {
            ...originals.value,
            songs: songsSchema.parse(text),
          };
        } else {
          translations.value = {
            ...translations.value,
            songs: songsSchema.parse(text),
          };
        }
        break;
      case "Tips.json":
        if (type === "original") {
          originals.value = {
            ...originals.value,
            tips: tipsSchema.parse(text),
          };
        } else {
          translations.value = {
            ...translations.value,
            tips: tipsSchema.parse(text),
          };
        }
        break;
      default:
        throw new Error(`Unsupported file: ${file.name}`);
    }
  } catch (e) {
    console.error(e);
  }
};

const loadFiles = async (files: File[], type: "original" | "translation") => {
  if (files.length === 0) return;
  if (files.some((file) => file.type !== "application/json")) {
    if (type === "original") {
      originalFiles.value = originalFiles.value.filter(
        (file) => file.type === "application/json",
      );
    } else {
      translationFiles.value = translationFiles.value.filter(
        (file) => file.type === "application/json",
      );
    }
    return;
  }

  if (files.some((file) => !supportedFiles.includes(file.name))) {
    if (type === "original") {
      originalFiles.value = originalFiles.value.filter((file) =>
        supportedFiles.includes(file.name),
      );
    } else {
      translationFiles.value = translationFiles.value.filter((file) =>
        supportedFiles.includes(file.name),
      );
    }
    return;
  }

  for (const file of files) {
    await loadFile(file, type);
  }

  originalFiles.value = [];
  translationFiles.value = [];
};

const autoFillOriginalUI = async () => {
  try {
    const strings = await $fetch<string>(
      "https://docs.google.com/feeds/download/documents/export/Export?exportFormat=txt&id=1KOm9MTLrWv_lll6f1YvnlWlq3srXYVKMSo2a9KZ39a8",
      { responseType: "text" },
    );
    originalsString.value = strings.trim().replaceAll("\r", "");
    originals.value = { ...originals.value, ui: originalsString.value };
  } catch {
    showError({
      description:
        "Er is een fout opgetreden bij het ophalen van de originele UI teksten.",
      id: "auto-fill-originals-error",
    });
  }
};

const title = "Importeren";
const description =
  "Importeer op deze pagina de originele (Engelse) en vertaalde (Nederlandse) teksten.";

useSeoMeta({
  description,
  ogDescription: description,
  ogTitle: title,
  title,
});
</script>
