<template>
  <UForm
    :state="state"
    :schema="schema"
    class="flex flex-col gap-4"
    @submit="onSubmit"
  >
    <UFormField
      name="title"
      :description="song.title"
      :label="`Lied ${song.number}`"
    >
      <UInput v-model="state.title" class="w-full" />
    </UFormField>
    <UButton class="w-fit" type="submit" label="Opslaan" />
  </UForm>
</template>
<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";

import { z } from "zod";

const props = defineProps<{
  song: Song;
}>();

const jsonStore = useJsonStore();

const translation = computed(() =>
  jsonStore.translations.songs?.find((s) => s.number === props.song.number),
);

const schema = z.object({
  title: z.string().nonempty(),
});

type Schema = z.infer<typeof schema>;

const state = reactive<Partial<Schema>>({
  title: translation.value?.title,
});

const { showSuccess } = useFlash();

function onSubmit(event: FormSubmitEvent<Schema>) {
  const songs: Songs =
    jsonStore.originals.songs?.map((original) => {
      const translation = jsonStore.translations.songs?.find(
        (s) => s.number === original.number,
      );

      if (original.number !== props.song.number) {
        return translation ?? { number: original.number, title: "" };
      }

      return translation
        ? { ...translation, ...event.data }
        : { ...original, ...event.data };
    }) ?? [];

  jsonStore.setTranslations({ songs }, "songs");
  showSuccess({ description: "Lied opgeslagen.", id: "song-saved" });
}
</script>
