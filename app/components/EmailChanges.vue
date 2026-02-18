<template>
  <UPageCard v-if="isDifferent" :title="label">
    <template v-if="isDifferent">
      <DiffViewer
        :context="1"
        :new-string="translations"
        :old-string="inputTranslations"
      />
      <UButton
        class="w-fit"
        color="error"
        :label="`Reset ${label.toLowerCase()}`"
        @click="reset"
      />
    </template>
    <p v-else>Geen veranderde {{ label.toLowerCase() }} gevonden.</p>
  </UPageCard>
</template>

<script setup lang="ts">
const props = defineProps<{
  group: EmailKey;
  nr: number;
}>();

const emailStore = useEmailStore();

const groupName = computed(() => {
  return (
    (emailGroups.find((group) => group.key === props.group)?.label ??
      "Onbekend") + " (e-mailtemplates)"
  );
});

const label = computed(() => {
  return `${groupName.value} #${props.nr}`;
});

const inputTranslations = computed(() => {
  return stringifyEmail(emailStore.inputs[props.group]?.[props.nr] ?? {});
});

const translations = computed(() => {
  return stringifyEmail(emailStore.translations[props.group]?.[props.nr] ?? {});
});

const isDifferent = computed(() => {
  return inputTranslations.value !== translations.value;
});

const reset = () => {
  emailStore.setTranslation(
    props.group,
    props.nr,
    emailStore.inputs[props.group]?.[props.nr] ?? {},
  );
};
</script>
