<template>
  <UForm
    :state="state"
    :schema="schema"
    class="flex flex-col gap-4"
    @submit="onSubmit"
  >
    <UFormField
      name="title"
      :hint="item.symbol"
      :description="item.title"
      :label="`Lectuurartikel ${item.id}`"
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
  item: LiteratureItem;
}>();

const jsonStore = useJsonStore();

const translation = computed(() =>
  jsonStore.translations.literature?.find((s) => s.id === props.item.id),
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
  const literature = jsonStore.translations.literature?.map((item) =>
    item.id === props.item.id ? { ...item, ...event.data } : item,
  );

  jsonStore.setTranslations({ literature }, "literature");
  showSuccess({ description: "Lectuurartikel opgeslagen.", id: "item-saved" });
}
</script>
