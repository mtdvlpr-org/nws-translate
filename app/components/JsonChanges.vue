<template>
  <UPageCard v-if="isDifferent" :title="label">
    <div :id="type" class="scroll-mt-34"></div>
    <template v-if="isDifferent">
      <DiffViewer
        :context="1"
        :new-string="translations"
        :old-string="inputTranslations"
      />
      <UButton
        class="w-fit"
        color="error"
        :label="`Reset ${label.toLowerCase()}`"
        @click="reset"
      />
    </template>
    <p v-else>Geen veranderde {{ label.toLowerCase() }} gevonden.</p>
  </UPageCard>
</template>

<script setup lang="ts">
const props = defineProps<{
  type: JsonKey;
}>();

const emit = defineEmits<{
  (e: "reset"): void;
}>();

const jsonStore = useJsonStore();

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
  return JSON.stringify(jsonStore.input[props.type], null, 2);
});

const translations = computed(() => {
  return JSON.stringify(jsonStore.translations[props.type], null, 2);
});

const isDifferent = computed(() => {
  return inputTranslations.value !== translations.value;
});

const reset = () => {
  jsonStore.setTranslations({ ...jsonStore.input }, props.type);
  emit("reset");
};
</script>
