<template>
  <UForm
    v-if="outline.title"
    :state="state"
    :schema="schema"
    class="flex flex-col gap-4"
    @submit="onSubmit"
  >
    <UFormField
      name="title"
      :description="outline.title"
      :label="`Lezing nr. ${outline.number}`"
    >
      <UInput v-model="state.title" class="w-full" />
    </UFormField>
    <UFormField
      v-if="outline.updated"
      hint="m/yy"
      name="updated"
      label="Bijgewerkt op"
      :description="outline.updated"
    >
      <UInput v-model="state.updated" class="w-full" />
    </UFormField>
    <UFormField
      v-if="outline.notes || state.notes"
      name="notes"
      label="Opmerking"
      :description="outline.notes"
    >
      <UTextarea v-model="state.notes" :rows="1" autoresize class="w-full" />
    </UFormField>
    <UButton class="w-fit" type="submit" label="Opslaan" />
  </UForm>
</template>
<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";

import { z } from "zod";

const props = defineProps<{
  outline: Outline;
}>();

const jsonStore = useJsonStore();

const translation = computed(() =>
  jsonStore.translations.outlines?.find(
    (s) => s.number === props.outline.number,
  ),
);

const schema = z.object({
  notes: z.string().optional(),
  title: z.string().optional(),
  updated: z.string(),
});

type Schema = z.infer<typeof schema>;

const state = reactive<Partial<Schema>>({
  notes: translation.value?.notes,
  title: translation.value?.title,
  updated: translation.value?.updated,
});

const { showSuccess } = useFlash();

function onSubmit(event: FormSubmitEvent<Schema>) {
  const outlines: Outlines =
    jsonStore.originals.outlines?.map((original) => {
      const translation = jsonStore.translations.outlines?.find(
        (s) => s.number === original.number,
      );
      if (original.number !== props.outline.number) {
        return (
          translation ?? { number: original.number, title: "", updated: "" }
        );
      }
      return translation
        ? { ...translation, ...event.data }
        : { ...original, ...event.data };
    }) ?? [];

  jsonStore.setTranslations({ outlines }, "outlines");
  showSuccess({ description: "Schema opgeslagen.", id: "outline-saved" });
}
</script>
