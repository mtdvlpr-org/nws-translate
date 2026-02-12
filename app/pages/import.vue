<template>
  <UPage>
    <UPageHeader :title="title" :description="description" />
    <UPageBody>
      <UPageCard id="originals" title="Originele teksten (Engels)">
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
        />
        <ImportForm v-model="originals" no-nwp />
      </UPageCard>
      <UPageCard id="translations" title="Vertalingen (Nederlands)">
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
        />
        <ImportForm v-model="translations" />
      </UPageCard>
      <UPageCard id="original-emails" title="Originele e-mailtemplates">
        <EmailImportForm v-model="originalEmails" locale="Engels" />
      </UPageCard>
      <UPageCard id="translated-emails" title="Vertaalde e-mailtemplates">
        <EmailImportForm v-model="inputEmails" locale="Nederlands" />
      </UPageCard>
      <UPageCard id="backup" title="Back-up">
        <UFileUpload
          v-model="backupFile"
          :file-delete="false"
          class="w-full min-h-48"
          accept="application/json"
          label="Importeer NWS Translate back-up"
          @update:model-value="loadBackup"
        />
      </UPageCard>
    </UPageBody>
  </UPage>
</template>
<script setup lang="ts">
import type { Output as EmailOutput } from "~/components/EmailImportForm.vue";
import type { Output } from "~/components/ImportForm.vue";

const uiStore = useUIStore();
const { nwpString, originalsString, translationsString } = storeToRefs(uiStore);

const jsonStore = useJsonStore();

const originals = ref<Output>({
  nwp: nwpString.value,
  ui: originalsString.value,
  ...jsonStore.originals,
});

const translations = ref<Output>({
  nwp: nwpString.value,
  ui: translationsString.value,
  ...jsonStore.input,
});

const emailStore = useEmailStore();

const originalEmails = ref<Partial<EmailOutput>>({
  ...emailStore.originals,
});

const inputEmails = ref<Partial<EmailOutput>>({
  ...emailStore.inputs,
});

const { showSuccess } = useFlash();

watch(originalsString, (ui) => {
  originals.value = { ...originals.value, ui };
});

watch(translationsString, (ui) => {
  translations.value = { ...translations.value, ui };
  uiStore.clearConsistentKeys();
});

watch(nwpString, (nwp) => {
  translations.value = { ...translations.value, nwp };
  uiStore.clearConsistentKeys();
});

watch(originals, (val) => {
  originalsString.value = val.ui;
  jsonStore.setOriginals(val);
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
  jsonStore.setInput(val);
  jsonStore.setTranslations(val);

  showSuccess({
    description: "Vertalingen zijn opgeslagen.",
    id: "translations-import",
  });
});

watch(originalEmails, (val) => {
  emailStore.setOriginals(val);

  showSuccess({
    description: "Originele e-mailtemplates zijn opgeslagen.",
    id: "original-emails-import",
  });
});

watch(inputEmails, (val) => {
  emailStore.setInputs(val);
  emailStore.setTranslations(val);

  showSuccess({
    description: "Vertaalde e-mailtemplates zijn opgeslagen.",
    id: "input-emails-import",
  });
});

const { showError } = useFlash();

const originalFiles = ref<File[]>([]);
const translationFiles = ref<File[]>([]);

const supportedJsonFiles = [
  "Literature.json",
  "Outlines.json",
  "Songs.json",
  "Tips.json",
];

const loadJsonFile = async (file: File, type: "original" | "translation") => {
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
        throw createError({
          message: `Unsupported file: ${file.name}`,
          status: 400,
        });
    }
  } catch (e) {
    console.error(e);
  }
};

watch(originalFiles, (files) => {
  loadJsonFiles(files, "original");
});

watch(translationFiles, (files) => {
  loadJsonFiles(files, "translation");
});

const loadJsonFiles = async (
  files: File[] | null | undefined,
  type: "original" | "translation",
) => {
  if (!files || files.length === 0) return;
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

  if (files.some((file) => !supportedJsonFiles.includes(file.name))) {
    if (type === "original") {
      originalFiles.value = originalFiles.value.filter((file) =>
        supportedJsonFiles.includes(file.name),
      );
    } else {
      translationFiles.value = translationFiles.value.filter((file) =>
        supportedJsonFiles.includes(file.name),
      );
    }
    return;
  }

  for (const file of files) {
    await loadJsonFile(file, type);
  }

  originalFiles.value = [];
  translationFiles.value = [];
};

const backupFile = ref<File | null>(null);

const loadBackup = async (file: File | null | undefined) => {
  try {
    if (!file) return;

    const backup = JSON.parse(await file.text()) as BackupFile;
    if (backup.id !== "nws-translate-backup") {
      showError({
        description: "Kon back-up niet laden.",
        id: "backup-load-error",
      });
      return;
    }

    uiStore.$patch(backup.ui);
    jsonStore.$patch(backup.json);
    emailStore.$patch(backup.email);
    showSuccess({
      description: "Backup is geladen.",
      id: "backup-loaded",
    });
    window.location.reload();
  } catch (e) {
    console.error(e);
    showError({
      description: "Kon back-up niet laden.",
      id: "backup-load-error",
    });
  } finally {
    backupFile.value = null;
  }
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
