<template>
  <UPage>
    <UPageHeader :title="title" :description="description" />

    <UAlert
      v-if="!importStore.translationsString"
      color="warning"
      variant="subtle"
      title="Geen keys gevonden"
      description="Importeer eerst teksten vanuit Google Docs om te kunnen vertalen."
      :actions="[
        { label: 'Ga naar Importeren', variant: 'link', to: '/import' },
      ]"
    />

    <UPageBody>
      <UPageCard title="Nieuwe teksten">
        <TranslationFileForm
          v-model="newTranslationsString"
          no-toast
          required
          :submit="{
            label: 'Teksten inladen',
            disabled: !importStore.translationsString,
          }"
        />
      </UPageCard>
      <UPageCard v-if="newTranslationsString" title="Veranderingen">
        <template v-if="isDifferent">
          <DiffViewer
            :new-string="newTranslations"
            :old-string="oldTranslations"
          />
        </template>
        <p v-else>Geen veranderde teksten gevonden.</p>
      </UPageCard>
      <UPageCard
        v-if="newTranslationsString && isDifferent"
        title="Vertaal de veranderde teksten"
      >
        <TranslationForm
          v-for="t in changedText"
          :key="t.key"
          :new-value="t.value"
          :translation-key="t.key"
          @save="savedKeys.add(t.key)"
        />
      </UPageCard>
      <UPageCard
        v-if="newTranslationsString && isDifferent"
        title="Update afronden"
        description="Sla de nieuwe teksten op."
      >
        <UButton class="w-fit" label="Update afronden" @click="finishUpdate" />
      </UPageCard>
    </UPageBody>
  </UPage>
</template>
<script setup lang="ts">
const title = "Update";
const description =
  "Importeer op deze pagina een update van het Google Docs bestand.";

useSeoMeta({
  description,
  ogDescription: description,
  ogTitle: title,
  title,
});

const isDifferent = computed(() => {
  return newTranslations.value !== oldTranslations.value;
});

const importStore = useImportStore();
const oldTranslations = computed(() => {
  return JSON.stringify(importStore.translations, null, 2);
});

const newTranslationsString = ref("");
const newTranslations = computed(() => {
  return JSON.stringify(
    parseTranslationFile(newTranslationsString.value),
    null,
    2,
  );
});

const changedText = computed(() => {
  const parsed = JSON.parse(newTranslations.value);

  return Object.keys(parsed)
    .filter((key) => {
      return parsed[key] !== importStore.translations[key];
    })
    .map((key) => ({ key, value: parsed[key] }));
});

const savedKeys = ref<Set<string>>(new Set());

const { showSuccess } = useFlash();

const finishUpdate = () => {
  importStore.translationsString = newTranslationsString.value;
  const parsed = JSON.parse(newTranslations.value);
  const newKeys = Object.keys(parsed).filter(
    (key) => !savedKeys.value.has(key),
  );

  newKeys.forEach((key) => {
    importStore.translations[key] = parsed[key];
  });

  showSuccess({ description: "Update afgerond." });

  newTranslationsString.value = "";
  savedKeys.value.clear();
};
</script>
