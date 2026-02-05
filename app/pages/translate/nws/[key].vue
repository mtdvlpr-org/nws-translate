<template>
  <NWSTranslationForm :translation-key="key" />
</template>
<script setup lang="ts">
const key = useRouteParams<string>("key");
</script>
