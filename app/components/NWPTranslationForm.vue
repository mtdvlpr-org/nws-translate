<template>
  <TranslationForm
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

const translation = computed(() => {
  return (
    props.newValue || uiStore.nwpTranslations?.[props.translationKey] || ""
  );
});

const { showSuccess } = useFlash();

const save = (newTranslation: string) => {
  if (!uiStore.nwpTranslations) return;
  uiStore.nwpTranslations[props.translationKey] = newTranslation;
  emit("save");
  showSuccess({
    description: "NWP-vertaling opgeslagen.",
    id: "nwp-translation-form",
  });
};
</script>
