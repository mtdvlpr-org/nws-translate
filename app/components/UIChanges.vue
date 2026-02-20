<template>
  <UPageCard v-if="isDifferent" :title="`${type} UI veranderingen`">
    <div :id="type.toLowerCase()" class="scroll-mt-34"></div>
    <template v-if="isDifferent">
      <DiffViewer :new-string="translations" :old-string="remoteTranslations" />
      <UButton
        class="w-fit"
        color="error"
        :label="`Reset ${type} UI veranderingen`"
        @click="reset"
      />
    </template>
    <p v-else>Geen veranderde {{ type }} UI teksten gevonden.</p>
  </UPageCard>
  <UPageCard v-if="isDifferent" :title="`Veranderde ${type} UI teksten`">
    <template v-if="type === 'NWS'">
      <NWSTranslationForm
        v-for="key in changedKeys"
        :key="key"
        :translation-key="key"
      />
    </template>
    <template v-else>
      <NWPTranslationForm
        v-for="key in changedKeys"
        :key="key"
        :translation-key="key"
      />
    </template>
  </UPageCard>
</template>

<script setup lang="ts">
const props = defineProps<{
  type: UIType;
}>();

const emit = defineEmits<{
  (e: "reset"): void;
}>();

const uiStore = useUIStore();

const remoteTranslations = computed(() => {
  return JSON.stringify(
    props.type === "NWS" ? uiStore.remoteTranslations : uiStore.remoteNWP,
    null,
    2,
  );
});

const translations = computed(() => {
  return JSON.stringify(
    props.type === "NWS"
      ? uiStore.translations
      : (uiStore.nwpTranslations ?? {}),
    null,
    2,
  );
});

const isDifferent = computed(() => {
  return remoteTranslations.value !== translations.value;
});

const changedKeys = computed(() => {
  return props.type === "NWS"
    ? Object.keys(uiStore.translations).filter((key) => {
        return uiStore.translations[key] !== uiStore.remoteTranslations[key];
      })
    : Object.keys(uiStore.nwpTranslations ?? {}).filter((key) => {
        return uiStore.nwpTranslations?.[key] !== uiStore.remoteNWP[key];
      });
});

const reset = () => {
  if (props.type === "NWS") {
    uiStore.translations = parseTranslationFile(uiStore.translationsString);
  } else if (uiStore.nwpString) {
    uiStore.nwpTranslations = parseTranslationFile(uiStore.nwpString);
  }
  emit("reset");
};
</script>
