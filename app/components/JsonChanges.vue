<template>
  <UPageCard v-if="isDifferent" :title="label">
    <template v-if="isDifferent">
      <DiffViewer :new-string="translations" :old-string="inputTranslations" />
      <UButton
        class="w-fit"
        color="error"
        :label="`Reset ${label.toLowerCase()}`"
        @click="resetUI"
      />
    </template>
    <p v-else>Geen veranderde {{ label.toLowerCase() }} gevonden.</p>
  </UPageCard>
</template>

<script setup lang="ts">
const props = defineProps<{
  type: "literature" | "outlines" | "songs" | "tips";
}>();

const translationStore = useTranslationStore();

const label = computed(() => {
  switch (props.type) {
    case "literature":
      return "Lectuur";
    case "outlines":
      return "Lezingen";
    case "songs":
      return "Liederen";
    case "tips":
      return "Tips";
    default:
      return "Onbekend";
  }
});

const inputTranslations = computed(() => {
  return JSON.stringify(translationStore.input[props.type], null, 2);
});

const translations = computed(() => {
  return JSON.stringify(translationStore.translations[props.type], null, 2);
});

const isDifferent = computed(() => {
  return inputTranslations.value !== translations.value;
});

const resetUI = () => {
  translationStore.setTranslations({ ...translationStore.input });
};
</script>
