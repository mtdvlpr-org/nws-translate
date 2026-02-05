<template>
  <UPage>
    <UPageHeader
      :title="title"
      headline="Vertalen"
      :description="description"
    />

    <UPageBody>
      <template v-if="loading">
        <UPageGrid>
          <div v-for="i in 12" :key="i" class="grid gap-2">
            <USkeleton class="h-4 w-3xs" />
            <USkeleton class="h-4 w-20" />
            <USkeleton class="h-4 w-full" />
          </div>
        </UPageGrid>
      </template>
      <template v-else>
        <UPageGrid>
          <OutlineForm
            v-for="outline in translationStore.originals.outlines"
            :id="`outline-${outline.number}`"
            :key="outline.number"
            :outline="outline"
          />
        </UPageGrid>
      </template>
    </UPageBody>
  </UPage>
</template>
<script setup lang="ts">
const translationStore = useTranslationStore();

const loading = ref(false);

const title = "Lezingen";
const description = "Vertaal op deze pagina de lezingen.";

useSeoMeta({
  description,
  ogDescription: description,
  ogTitle: title,
  title,
});
</script>
