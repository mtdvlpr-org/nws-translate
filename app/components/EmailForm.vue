<template>
  <UForm
    :state="state"
    :schema="schema"
    class="flex flex-col gap-4"
    @submit="onSubmit"
  >
    <UFormField
      name="title"
      :label="`E-mail #${nr}`"
      :description="original.title"
    >
      <UInput v-model="state.title" class="w-full" />
    </UFormField>
    <UFormField label="Origineel">
      <UTextarea
        readonly
        :rows="1"
        autoresize
        class="w-full"
        :model-value="original.text"
      />
    </UFormField>
    <UFormField name="text" label="Vertaling">
      <UTextarea v-model="state.text" :rows="1" autoresize class="w-full" />
    </UFormField>
    <UButton class="w-fit" type="submit" label="Opslaan" />
  </UForm>
</template>
<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";

import { z } from "zod";

const props = defineProps<{
  group: EmailKey;
  nr: number;
}>();

const emailStore = useEmailStore();

const original = computed(
  () => emailStore[props.group]?.[props.nr]?.originals ?? {},
);

const translation = computed(
  () => emailStore[props.group]?.[props.nr]?.translations ?? {},
);

const schema = z.object({
  text: z.string(),
  title: z.string(),
});

type Schema = z.infer<typeof schema>;

const state = reactive<Partial<Schema>>({ ...translation.value });

const { showSuccess } = useFlash();

function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log(JSON.stringify(event.data, null, 2));
  emailStore.setTranslation(props.group, props.nr, event.data);
  showSuccess({ description: "E-mail opgeslagen.", id: "email-saved" });
}
</script>
