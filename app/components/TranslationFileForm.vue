<template>
  <UForm
    :state="state"
    :schema="schema"
    class="flex flex-col gap-4"
    @submit="handleSubmit"
  >
    <UFormField
      name="translations"
      :required="required"
      :label="`${type} UI`"
      description="Plak tekst uit het Google Docs bestand."
    >
      <UTextarea
        v-model="state.translations"
        class="w-full"
        :placeholder="placeholder"
      />
    </UFormField>
    <UButton class="w-fit" type="submit" label="Opslaan" v-bind="submit" />
  </UForm>
</template>

<script setup lang="ts">
import type { ButtonProps, FormSubmitEvent } from "@nuxt/ui";

import { z } from "zod";

const props = defineProps<{
  required?: boolean;
  submit?: ButtonProps;
  type: "NWP" | "NWS";
}>();

const placeholder = computed(() => {
  return props.type === "NWP"
    ? '____v360____: "",\n____GENERAL____: "",\n"help": "Help",\n...'
    : "about: About\nabout1: New World Scheduler...";
});

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

watch(model, (newVal) => {
  state.translations = newVal;
});

const handleSubmit = (event: FormSubmitEvent<Schema>) => {
  model.value = event.data.translations;
};
</script>
