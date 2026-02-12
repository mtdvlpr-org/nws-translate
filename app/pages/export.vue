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
            v-if="jsonFiles.some(({ changed }) => changed)"
            class="w-fit"
            label="Zip-bestand met JSON-veranderingen"
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
          <UButton
            class="w-fit"
            label="Zip-bestand met e-mailtemplates"
            @click="exportEmails"
          />
        </div>
      </UPageCard>
      <UPageCard title="Back-up">
        <div class="flex flex-wrap gap-2">
          <UButton
            class="w-fit"
            label="NWS Translate back-up"
            @click="exportNWSBackup"
          />
        </div>
      </UPageCard>
    </UPageBody>
  </UPage>
</template>
<script setup lang="ts">
const uiStore = useUIStore();
const jsonStore = useJsonStore();
const emailStore = useEmailStore();

const { showError } = useFlash();

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
    const blob = await $fetch<Blob>("/api/export/json", {
      body: {
        files: jsonFiles.value.filter(({ changed }) => changed),
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
      description: "Kon zip-bestand niet downloaden.",
      id: "export-json-zip-error",
    });
  }
};

const exportEmails = async () => {
  try {
    const files = Object.entries(emailStore.translations ?? {}).flatMap(
      ([group, emails]) =>
        Object.entries(emails ?? {}).map(([nr, email]) => ({
          group,
          nr,
          ...email,
        })),
    );

    if (files.some((f) => !f.title || !f.text)) {
      showError({
        description: "Een of meer e-mailtemplates hebben geen titel of tekst.",
        id: "export-email-error",
      });
      return;
    }

    const countsPerGroup = files.reduce(
      (acc, file) => {
        acc[file.group] = (acc[file.group] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    try {
      emailGroups.forEach((group) => {
        const counted = countsPerGroup[group.key];
        if (!counted || counted !== group.count) {
          showError({
            description: `De groep ${group.label} heeft ${group.count} e-mailtemplates, maar er zijn ${counted} e-mailtemplates gevonden.`,
            id: "export-email-error",
          });
          throw new Error("Invalid email count");
        }
      });
    } catch {
      return;
    }

    const blob = await $fetch<Blob>("/api/export/emails", {
      body: { files },
      method: "POST",
      responseType: "blob",
    });

    // Create a download link and trigger it
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "DefaultEmailTemplates.zip";
    link.click();

    // Clean up
    URL.revokeObjectURL(url);
    link.remove();
  } catch (e) {
    console.error(e);
    showError({
      description: "Kon zip-bestand niet downloaden.",
      id: "export-email-zip-error",
    });
  }
};

const exportNWSBackup = async () => {
  try {
    const backup: BackupFile = {
      date: new Date().toISOString().split("T")[0]!,
      email: emailStore.$state,
      id: "nws-translate-backup",
      json: jsonStore.$state,
      ui: uiStore.$state,
      version: 1,
    };

    exportJSON(`NWS-Translate_backup_${backup.date}`, backup);
  } catch (e) {
    console.error(e);
    showError({
      description: "Kon NWS Translate back-up niet downloaden.",
      id: "export-backup-error",
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
