<template>
  <UForm
    :state="state"
    :schema="schema"
    class="flex flex-col gap-4"
    @submit="onSubmit"
  >
    <fieldset
      v-for="emailGroup in emailGroups"
      :key="emailGroup.key"
      class="flex flex-col gap-4"
    >
      <legend>{{ emailGroup.label }} ({{ locale }})</legend>
      <UFileUpload
        v-model="emailFiles"
        multiple
        layout="list"
        position="inside"
        accept="text/plain"
        :file-delete="false"
        class="w-full min-h-48"
        :disabled="emailFiles.length > 0"
        :label="`Importeer vanuit lokale bestanden (${capitalize(emailGroup.key)} folder)`"
        @update:model-value="(v) => loadEmailFiles(v, emailGroup.key)"
      />
      <template v-for="i of emailGroup.count" :key="i">
        <UFormField
          v-if="state[emailGroup.key][i]"
          :label="`${i}. Titel`"
          :name="`${emailGroup.key}.${i}.text`"
          :description="`Vul de titel uit de bestandsnaam in (bijvoorbeeld: '${i}_Titel.txt' -> 'Titel').`"
        >
          <UInput v-model="state[emailGroup.key][i]!.title" class="w-full" />
        </UFormField>
        <UFormField
          v-if="state[emailGroup.key][i]"
          label="Tekst"
          :name="`${emailGroup.key}.${i}.title`"
          :description="`Plak tekst uit het lokale ${capitalize(emailGroup.key)}/${i}_Titel.txt bestand.`"
        >
          <UTextarea v-model="state[emailGroup.key][i]!.text" class="w-full" />
        </UFormField>
      </template>
    </fieldset>
    <UButton class="w-fit" type="submit" label="Opslaan" />
  </UForm>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";

import { z } from "zod";

defineProps<{
  locale: "Engels" | "Nederlands";
}>();

const model = defineModel<Partial<Output>>();

const defaultState = (
  count: number,
): Partial<Record<number, { text?: string; title?: string }>> =>
  Object.fromEntries(Array.from({ length: count }, (_, i) => [i + 1, {}]));

const schema = z.object({
  assignmentsAndDuties: z.partialRecord(
    z.number(),
    z.strictObject({
      text: z.string().optional(),
      title: z.string().optional(),
    }),
  ),
  fieldServiceReports: z.partialRecord(
    z.number(),
    z.strictObject({
      text: z.string().optional(),
      title: z.string().optional(),
    }),
  ),
  lifeAndMinistryMeeting: z.partialRecord(
    z.number(),
    z.strictObject({
      text: z.string().optional(),
      title: z.string().optional(),
    }),
  ),
  other: z.partialRecord(
    z.number(),
    z.strictObject({
      text: z.string().optional(),
      title: z.string().optional(),
    }),
  ),
  persons: z.partialRecord(
    z.number(),
    z.strictObject({
      text: z.string().optional(),
      title: z.string().optional(),
    }),
  ),
  publicTalks: z.partialRecord(
    z.number(),
    z.strictObject({
      text: z.string().optional(),
      title: z.string().optional(),
    }),
  ),
  schedules: z.partialRecord(
    z.number(),
    z.strictObject({
      text: z.string().optional(),
      title: z.string().optional(),
    }),
  ),
  territory: z.partialRecord(
    z.number(),
    z.strictObject({
      text: z.string().optional(),
      title: z.string().optional(),
    }),
  ),
} satisfies Record<EmailKey, unknown>);

export type Input = z.input<typeof schema>;
export type Output = z.output<typeof schema>;

const state = reactive<Input>({
  assignmentsAndDuties: {
    ...defaultState(
      emailGroups.find((group) => group.key === "assignmentsAndDuties")!.count,
    ),
    ...(model.value?.assignmentsAndDuties ?? {}),
  },
  fieldServiceReports: {
    ...defaultState(
      emailGroups.find((group) => group.key === "fieldServiceReports")!.count,
    ),
    ...(model.value?.fieldServiceReports ?? {}),
  },
  lifeAndMinistryMeeting: {
    ...defaultState(
      emailGroups.find((group) => group.key === "lifeAndMinistryMeeting")!
        .count,
    ),
    ...(model.value?.lifeAndMinistryMeeting ?? {}),
  },
  other: {
    ...defaultState(emailGroups.find((group) => group.key === "other")!.count),
    ...(model.value?.other ?? {}),
  },
  persons: {
    ...defaultState(
      emailGroups.find((group) => group.key === "persons")!.count,
    ),
    ...(model.value?.persons ?? {}),
  },
  publicTalks: {
    ...defaultState(
      emailGroups.find((group) => group.key === "publicTalks")!.count,
    ),
    ...(model.value?.publicTalks ?? {}),
  },
  schedules: {
    ...defaultState(
      emailGroups.find((group) => group.key === "schedules")!.count,
    ),
    ...(model.value?.schedules ?? {}),
  },
  territory: {
    ...defaultState(
      emailGroups.find((group) => group.key === "territory")!.count,
    ),
    ...(model.value?.territory ?? {}),
  },
});

watch(
  model,
  (newVal) => {
    if (newVal) {
      emailGroups
        .map(({ key }) => key)
        .forEach((key) => {
          state[key] = {
            ...defaultState(
              emailGroups.find((group) => group.key === key)!.count,
            ),
            ...Object.fromEntries(
              Object.entries(newVal[key] ?? {}).filter(([_, v]) => !!v),
            ),
          };
        });
    } else {
      emailGroups
        .map(({ key }) => key)
        .forEach((key) => {
          state[key] = defaultState(
            emailGroups.find((group) => group.key === key)!.count,
          );
        });
    }
  },
  { immediate: true },
);

function onSubmit(event: FormSubmitEvent<Output>) {
  model.value = event.data;
}

const loadEmailFile = async (
  file: File,
  group: (typeof emailGroups)[number],
) => {
  try {
    const [nrString, ...rest] = file.name.split("_");
    const title = rest.join("_").replace(".txt", "");
    const nr = nrString ? Number(nrString) : undefined;

    if (!nr || !title || isNaN(nr) || nr < 1 || nr > group.count) return;
    const text = await file.text();

    state[group.key] = {
      ...state[group.key],
      [nr]: {
        text,
        title,
      },
    };
  } catch (e) {
    console.error(e);
  }
};

const emailFiles = ref<File[]>([]);

const { showError } = useFlash();

const loadEmailFiles = async (
  files: File[] | null | undefined,
  group: EmailKey,
) => {
  if (!files || files.length === 0) return;

  const groupInfo = emailGroups.find((g) => g.key === group);
  if (!groupInfo) return;

  if (files.some((file) => file.type !== "text/plain")) {
    emailFiles.value = emailFiles.value.filter(
      (file) => file.type === "text/plain",
    );
    return loadEmailFiles(emailFiles.value, group);
  }

  if (files.some((file) => !/^\d+_.+\.txt$/i.test(file.name))) {
    emailFiles.value = emailFiles.value.filter((file) =>
      /^\d+_.+\.txt$/i.test(file.name),
    );
    return loadEmailFiles(emailFiles.value, group);
  }

  if (files.length !== groupInfo.count) {
    showError({
      description: `Er horen ${groupInfo.count} bestanden te zijn voor de groep ${groupInfo.label}. Heb je de juiste folder geopend?`,
      id: "email-import-error",
    });
    emailFiles.value = [];
    return;
  }

  for (const file of files) {
    await loadEmailFile(file, groupInfo);
  }

  emailFiles.value = [];
  model.value = { ...state };
};
</script>
