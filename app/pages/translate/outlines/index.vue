<template>
  <UPage>
    <UPageHeader
      :title="title"
      headline="Vertalen"
      :description="description"
    />

    <UPageBody>
      <DevOnly>
        <UFileUpload
          v-model="jwpubFile"
          :file-delete="false"
          accept=".jwpub,.JWPUB"
          class="w-full min-h-48"
          :disabled="!!jwpubFile"
          label="Importeer vanuit S-34 formulier."
          @change="importOutlines"
        />
      </DevOnly>
      <template v-if="loading">
        <UPageGrid>
          <div v-for="i in 12" :key="i" class="grid gap-2">
            <USkeleton class="h-4 w-3xs" />
            <USkeleton class="h-4 w-20" />
            <USkeleton class="h-4 w-full" />
          </div>
        </UPageGrid>
      </template>
      <template v-else>
        <UPageCard
          v-if="jsonStore.missingOutlines.length > 0"
          highlight
          highlight-color="error"
          :title="`${jsonStore.missingOutlines.length} ontbrekende vertaling(en) gevonden:`"
        >
          <UPageGrid>
            <OutlineForm
              v-for="outline in jsonStore.missingOutlines"
              :key="outline.number"
              :outline="outline"
            />
          </UPageGrid>
        </UPageCard>
        <UPageGrid>
          <OutlineForm
            v-for="outline in jsonStore.originals.outlines"
            :id="`outline-${outline.number}`"
            :key="outline.number"
            :outline="outline"
          />
        </UPageGrid>
      </template>
    </UPageBody>
  </UPage>
</template>
<script setup lang="ts">
const jsonStore = useJsonStore();

const loading = ref(false);
const jwpubFile = ref<File | null>(null);

const { showError } = useFlash();

const importOutlines = async () => {
  if (!jwpubFile.value) return;

  loading.value = true;
  try {
    const body = new FormData();
    body.append("file", jwpubFile.value);
    const parsedOutlines = await $fetch<Outline[]>("/api/outlines/stream", {
      body,
      method: "POST",
    });

    const outlines =
      jsonStore.outlines.translations?.map((outline) => ({
        ...outline,
        ...(parsedOutlines.find((o) => o.number === outline.number) ?? {}),
      })) ?? [];

    jsonStore.setTranslations({ outlines }, "outlines");
  } catch {
    showError({
      description:
        "Er is een fout opgetreden bij het importeren van de lezingen.",
      id: "import-outlines-error",
    });
  }
  loading.value = false;
  jwpubFile.value = null;
};

const title = "Lezingen";
const description = "Vertaal op deze pagina de lezingen.";

useSeoMeta({
  description,
  ogDescription: description,
  ogTitle: title,
  title,
});
</script>
