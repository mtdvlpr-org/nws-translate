<template>
  <UForm
    :state="state"
    :schema="schema"
    class="flex flex-col gap-4"
    @submit="onSubmit"
  >
    <UFormField label="Titel" name="heading" :description="tip.heading">
      <UInput v-model="state.heading" class="w-full" />
    </UFormField>
    <fieldset>
      <legend>Tekst</legend>
      <UFormField label="Origineel">
        <UTextarea
          readonly
          :rows="1"
          autoresize
          class="w-full"
          :model-value="tip.text"
        />
      </UFormField>
      <UFormField name="text" label="Vertaling">
        <UTextarea v-model="state.text" :rows="1" autoresize class="w-full" />
      </UFormField>
    </fieldset>
    <UButton class="w-fit" type="submit" label="Opslaan" />
  </UForm>
</template>
<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";

import { z } from "zod";

const props = defineProps<{
  index: number;
  tip: Tip;
}>();

const translationStore = useTranslationStore();

const translation = computed(
  () => translationStore.translations.tips?.[props.index],
);

const schema = z.object({
  heading: z.string().nonempty(),
  text: z.string().nonempty(),
});

type Schema = z.infer<typeof schema>;

const state = reactive<Partial<Schema>>({
  heading: translation.value?.heading,
  text: translation.value?.text,
});

const { showSuccess } = useFlash();

function onSubmit(event: FormSubmitEvent<Schema>) {
  const tips = translationStore.translations.tips?.map((tip, i) =>
    i === props.index ? { ...tip, ...event.data } : tip,
  );

  translationStore.setTranslations({ tips }, "tips");
  showSuccess({ description: "Tip opgeslagen.", id: "tip-saved" });
}
</script>
