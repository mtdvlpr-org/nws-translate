<template>
  <UPage>
    <UPageHeader :title="title" :description="description" />

    <UAlert
      v-if="!stringValue"
      color="warning"
      variant="subtle"
      title="Geen keys gevonden"
      description="Importeer eerst teksten vanuit Google Docs om te kunnen vertalen."
      :actions="[
        { label: 'Ga naar Importeren', variant: 'link', to: '/import' },
      ]"
    />

    <UPageBody>
      <URadioGroup
        v-model="type"
        :items="['NWS', 'NWP']"
        legend="Welke UI wil je updaten?"
      />
      <UAlert
        v-if="type === 'NWS'"
        color="warning"
        title="Let op!"
        variant="subtle"
        description="Update eerst de originele (Engelse) teksten voordat je de nieuwe teksten inlaadt."
        :actions="[
          { label: 'Ga naar Importeren', variant: 'link', to: '/import' },
        ]"
      />
      <UPageCard title="Nieuwe teksten">
        <TranslationFileForm
          v-model="newTranslationsString"
          required
          :type="type"
          :submit="{
            label: 'Teksten inladen',
            disabled: !stringValue,
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
        <NWSTranslationForm
          v-for="t in changedText"
          :key="t.key"
          :new-value="t.value"
          :translation-key="t.key"
          @save="savedKeys.add(t.key)"
        />
      </UPageCard>
      <UPageCard
        v-if="newTranslationsString"
        title="Update afronden"
        description="Sla de nieuwe teksten op."
      >
        <UButton class="w-fit" label="Update afronden" @click="finishUpdate" />
      </UPageCard>
    </UPageBody>
  </UPage>
</template>
<script setup lang="ts">
const uiStore = useUIStore();
const type = ref<UIType>("NWS");

const stringValue = computed(() => {
  return type.value === "NWS" ? uiStore.translationsString : uiStore.nwpString;
});

const oldTranslations = computed(() => {
  return JSON.stringify(
    type.value === "NWS" ? uiStore.translations : uiStore.nwpTranslations,
    null,
    2,
  );
});

const newTranslationsString = ref("");
const newTranslations = computed(() => {
  return JSON.stringify(
    parseTranslationFile(newTranslationsString.value),
    null,
    2,
  );
});

const isDifferent = computed(() => {
  return newTranslations.value !== oldTranslations.value;
});

const changedText = computed(() => {
  const parsed = JSON.parse(newTranslations.value);

  return Object.keys(parsed)
    .filter((key) => {
      return type.value === "NWS"
        ? parsed[key] !== uiStore.translations[key]
        : parsed[key] !== uiStore.nwpTranslations?.[key];
    })
    .map((key) => ({ key, value: parsed[key] }));
});

const savedKeys = ref<Set<string>>(new Set());

const { showSuccess } = useFlash();

const finishUpdate = () => {
  if (type.value === "NWS") {
    uiStore.translationsString = newTranslationsString.value;
  } else {
    uiStore.nwpString = newTranslationsString.value;
  }

  const newText = changedText.value.filter(
    ({ key }) => !savedKeys.value.has(key),
  );

  uiStore.clearConsistentKeys(
    type.value === "NWS" ? "all" : "ui",
    changedText.value.map((t) => t.key),
  );

  if (type.value === "NWS") {
    newText.forEach((t) => {
      uiStore.translations[t.key] = t.value;
    });
  } else {
    newText.forEach((t) => {
      if (uiStore.nwpTranslations) {
        uiStore.nwpTranslations[t.key] = t.value;
      }
    });
  }

  uiStore.sortKeys(type.value);
  showSuccess({ description: "Update afgerond.", id: "update-finish" });

  newTranslationsString.value = "";
  savedKeys.value.clear();
};

const title = "Update";
const description =
  "Importeer op deze pagina een UI update van een NWS of NWP Google Docs bestand.";

useSeoMeta({
  description,
  ogDescription: description,
  ogTitle: title,
  title,
});
</script>
