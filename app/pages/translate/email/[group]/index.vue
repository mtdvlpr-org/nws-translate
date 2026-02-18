<template>
  <div class="flex flex-col gap-4">
    <p>Kies een e-mail uit de lijst om te vertalen.</p>
    <template v-if="numbers.length > 0">
      <p>{{ numbers.length }} inconsistentie(s) gevonden:</p>
      <EmailForm v-for="nr in numbers" :key="nr" :nr="nr" :group="group" />
    </template>
  </div>
</template>
<script setup lang="ts">
const emailStore = useEmailStore();
const group = useRouteParams<EmailKey>("group");

const numbers = computed(() =>
  Object.keys(emailStore.inconsistencies[group.value] ?? {}).map(Number),
);
</script>
