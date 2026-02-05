<template>
  <div>
    <div v-if="keys.length < 3" class="flex flex-col gap-8">
      <NWPTranslationForm v-for="k in keys" :key="k" :translation-key="k" />
    </div>
    <UPageGrid v-else>
      <NWPTranslationForm v-for="k in keys" :key="k" :translation-key="k" />
    </UPageGrid>
  </div>
</template>
<script setup lang="ts">
const key = useRouteParams<string>("key");
const keys = computed(() => key.value.split(","));
</script>
