<template>
  <UForm
    :state="state"
    :schema="schema"
    class="flex flex-col gap-4"
    @submit="handleSubmit"
  >
    <UFormField
      :required
      label="Online"
      name="translations"
      description="Plak tekst uit het Google Docs bestand."
      v-bind="field"
    >
      <UTextarea
        v-model="state.translations"
        class="w-full"
        placeholder="about: About&#10;about1: New World Scheduler..."
        v-bind="textarea"
      />
    </UFormField>
    <UButton class="w-fit" type="submit" label="Opslaan" v-bind="submit" />
  </UForm>
</template>

<script setup lang="ts">
import type {
  ButtonProps,
  FormFieldProps,
  FormSubmitEvent,
  TextareaProps,
} from "@nuxt/ui";

import { z } from "zod";

const props = defineProps<{
  field?: FormFieldProps;
  noToast?: boolean;
  required?: boolean;
  submit?: ButtonProps;
  textarea?: TextareaProps;
}>();

const model = defineModel<TranslationFile>();

const schema = z.object({
  translations: props.required
    ? translationFileSchema
    : translationFileSchema.optional(),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  translations: model.value,
});

const { showSuccess } = useFlash();

const handleSubmit = (event: FormSubmitEvent<Schema>) => {
  model.value = event.data.translations;
  if (props.noToast) return;
  showSuccess({ description: "Succesvol opgeslagen." });
};
</script>
