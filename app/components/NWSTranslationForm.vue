<template>
  <TranslationForm
    :original="original"
    :translation="translation"
    :translation-key="translationKey"
    @submit="save"
  />
</template>
<script setup lang="ts">
const props = defineProps<{
  newValue?: string;
  translationKey: string;
}>();

const emit = defineEmits<{
  (e: "save"): void;
}>();

const uiStore = useUIStore();

const original = computed(
  () => uiStore.references[props.translationKey] || props.translationKey,
);
const translation = computed(() => {
  return props.newValue || uiStore.translations[props.translationKey] || "";
});

const { showSuccess } = useFlash();

const save = (newTranslation: string) => {
  uiStore.translations[props.translationKey] = newTranslation;
  emit("save");
  showSuccess({
    description: "NWS-vertaling opgeslagen.",
    id: "nws-translation-form",
  });
};
</script>
