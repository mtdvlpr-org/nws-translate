<template>
  <UForm class="flex flex-col gap-4">
    <UFormField
      :label="original === translationKey ? 'Key' : 'Origineel'"
      :description="original === translationKey ? undefined : translationKey"
    >
      <UTextarea
        readonly
        :rows="1"
        autoresize
        class="w-full"
        :model-value="original"
      />
    </UFormField>
    <UFormField label="Vertaling" name="translation">
      <UTextarea v-model="translation" :rows="1" autoresize class="w-full">
        <template v-if="translation?.length" #trailing>
          <UTooltip text="Kopiëren" :content="{ side: 'right' }">
            <UButton
              size="sm"
              variant="link"
              aria-label="Gekopieerd naar klembord"
              :color="copied ? 'success' : 'neutral'"
              :icon="copied ? 'i-lucide-copy-check' : 'i-lucide-copy'"
              @click="copy(translation)"
            />
          </UTooltip>
        </template>
      </UTextarea>
    </UFormField>
    <uButton class="w-fit" label="Opslaan" @click="save" />
  </UForm>
</template>
<script setup lang="ts">
const props = defineProps<{
  newValue?: string;
  translationKey: string;
}>();

const emit = defineEmits<{
  (e: "save"): void;
}>();

const importStore = useImportStore();
const { copied, copy } = useClipboard();

const original = computed(
  () => importStore.references[props.translationKey] || props.translationKey,
);
const translation = ref("");

onMounted(() => {
  translation.value =
    props.newValue || importStore.translations[props.translationKey] || "";
});

const { showSuccess } = useFlash();

const save = () => {
  importStore.translations[props.translationKey] = translation.value;
  emit("save");
  showSuccess({ description: "Vertaling opgeslagen." });
};
</script>
