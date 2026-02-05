<template>
  <UForm
    :state="state"
    :schema="schema"
    class="flex flex-col gap-4"
    @submit="onSubmit"
  >
    <UFormField
      :label="original ? 'Origineel' : 'Key'"
      :description="original ? translationKey : undefined"
    >
      <UTextarea
        readonly
        :rows="1"
        autoresize
        class="w-full"
        :model-value="original || translationKey"
      />
    </UFormField>
    <UFormField label="Vertaling" name="translation">
      <UTextarea
        v-model="state.translation"
        :rows="1"
        autoresize
        class="w-full"
      >
        <template v-if="state.translation?.length" #trailing>
          <UTooltip text="Kopiëren" :content="{ side: 'right' }">
            <UButton
              size="sm"
              variant="link"
              aria-label="Gekopieerd naar klembord"
              :color="copied ? 'success' : 'neutral'"
              :icon="copied ? 'i-lucide-copy-check' : 'i-lucide-copy'"
              @click="copy(state.translation)"
            />
          </UTooltip>
        </template>
      </UTextarea>
    </UFormField>
    <UButton class="w-fit" type="submit" label="Opslaan" />
  </UForm>
</template>
<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";

import { z } from "zod";

const props = defineProps<{
  original?: string;
  translation: string;
  translationKey?: string;
}>();

const emit = defineEmits<{
  (e: "submit", translation: string): void;
}>();

const { copied, copy } = useClipboard();

const schema = z.object({
  translation: z.string().nonempty(),
});

type Schema = z.infer<typeof schema>;

const state = reactive<Partial<Schema>>({
  translation: props.translation,
});

function onSubmit(event: FormSubmitEvent<Schema>) {
  emit("submit", event.data.translation);
}
</script>
