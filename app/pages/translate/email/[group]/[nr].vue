<template>
  <div>
    <div v-if="numbers.length < 3" class="flex flex-col gap-8">
      <EmailForm v-for="nr in numbers" :key="nr" :nr="nr" :group="group" />
    </div>
    <UPageGrid v-else>
      <EmailForm v-for="nr in numbers" :key="nr" :nr="nr" :group="group" />
    </UPageGrid>
  </div>
</template>
<script setup lang="ts">
const group = useRouteParams<EmailKey>("group");

const number = useRouteParams<string>("nr");
const numbers = computed(() =>
  number.value
    .split(",")
    .map(Number)
    .filter((nr) => !isNaN(nr)),
);
</script>
