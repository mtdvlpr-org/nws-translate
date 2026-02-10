<template>
  <UForm
    :state="state"
    :schema="schema"
    class="flex flex-col gap-4"
    @error="onError"
    @submit="onSubmit"
  >
    <fieldset class="flex flex-col gap-4">
      <legend>UI</legend>
      <UFormField
        required
        name="ui"
        label="NWS UI"
        description="Plak tekst uit het Google Docs bestand."
      >
        <UTextarea
          v-model="state.ui"
          class="w-full"
          placeholder="about: About&#10;about1: New World Scheduler..."
        />
      </UFormField>
      <UFormField
        v-if="!noNwp"
        name="nwp"
        label="NWP UI"
        description="Plak tekst uit het Google Docs bestand."
      >
        <UTextarea
          v-model="state.nwp"
          class="w-full"
          placeholder='"____v360____": "",&#10;"____GENERAL____": "",&#10;"help": "Help",&#10;...'
        />
      </UFormField>
    </fieldset>
    <fieldset class="flex flex-col gap-4">
      <legend>JSON-bestanden</legend>
      <UFormField
        v-for="file in jsonFiles"
        :key="file.key"
        :name="file.key"
        :label="file.label"
        :error="errors[file.key]"
        :description="`Plak tekst uit het lokale ${capitalize(file.key)}.json bestand.`"
      >
        <UTextarea v-model="state[file.key]" class="w-full" />
      </UFormField>
    </fieldset>
    <UButton class="w-fit" type="submit" label="Opslaan" />
  </UForm>
</template>

<script setup lang="ts">
import type { FormErrorEvent, FormSubmitEvent } from "@nuxt/ui";

import { z } from "zod";

defineProps<{
  noNwp?: boolean;
}>();

const model = defineModel<Output>();

const jsonFiles: { key: JsonKey; label: string }[] = [
  { key: "literature", label: "Literatuur" },
  { key: "outlines", label: "Lezingen" },
  { key: "songs", label: "Liederen" },
  { key: "tips", label: "Tips" },
];

const schema = z.object({
  literature: jsonCodec(literatureSchema).optional(),
  nwp: translationFileSchema.optional(),
  outlines: jsonCodec(outlinesSchema).optional(),
  songs: jsonCodec(songsSchema).optional(),
  tips: jsonCodec(tipsSchema).optional(),
  ui: translationFileSchema,
} satisfies Record<JsonKey | UIKey, unknown>);

export type Input = z.input<typeof schema>;
export type Output = z.output<typeof schema>;

const state = reactive<Partial<Input>>(
  model.value && schema.partial().safeEncode(model.value).success
    ? schema.partial().encode(model.value)
    : {},
);

watch(
  model,
  (newVal) => {
    if (newVal) {
      const parsed = newVal.ui
        ? schema.partial().safeEncode(newVal)
        : schema.omit({ ui: true }).safeEncode(newVal);
      if (parsed.success) {
        typedKeys(parsed.data).forEach((key) => {
          state[key] = parsed.data[key];
        });
      } else {
        console.warn("Invalid model", parsed.error);
      }
    } else {
      typedKeys(state).forEach((key) => {
        state[key] = undefined;
      });
    }
  },
  { immediate: true },
);

const errors = ref<Record<string, string>>({});

function onError(event: FormErrorEvent) {
  errors.value = {};
  event.errors.forEach((error) => {
    if (error.name && !jsonFiles.some((file) => file.key === error.name)) {
      const key = error.name.split(".")[0];
      if (key) errors.value[key] = error.message;
    }
  });

  if (Object.keys(errors.value).length === 0) {
    showError("De ingevoerde tekst is niet geldig.");
  }
}

function onSubmit(event: FormSubmitEvent<Output>) {
  model.value = event.data;
}
</script>
