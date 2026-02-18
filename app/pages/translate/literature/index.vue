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
        <UPageCard
          v-if="jsonStore.missingLiterature.length > 0"
          highlight
          highlight-color="error"
          :title="`${jsonStore.missingLiterature.length} ontbrekende vertaling(en) gevonden:`"
        >
          <UPageGrid>
            <LiteratureForm
              v-for="item in jsonStore.missingLiterature"
              :key="item.id"
              :item="item"
            />
          </UPageGrid>
        </UPageCard>
        <UPageCard
          v-if="jsonStore.wrongLiterature.length > 0"
          highlight
          highlight-color="error"
          :title="`${jsonStore.wrongLiterature.length} verkeerde vertaling(en) gevonden:`"
          description="De JSON-bestanden zijn niet consistent. Categorie, artikelnummer en symbool moeten gelijk zijn."
        >
          <UPageGrid>
            <LiteratureForm
              v-for="item in jsonStore.wrongLiterature"
              :key="item.id"
              :item="item"
            />
          </UPageGrid>
        </UPageCard>
        <UPageGrid>
          <LiteratureForm
            v-for="item in jsonStore.originals.literature"
            :id="`literature-${item.id}`"
            :key="item.id"
            :item="item"
          />
        </UPageGrid>
      </template>
    </UPageBody>
  </UPage>
</template>
<script setup lang="ts">
const jsonStore = useJsonStore();

const loading = ref(false);

const title = "Lectuur";
const description = "Vertaal op deze pagina de lectuur.";

useSeoMeta({
  description,
  ogDescription: description,
  ogTitle: title,
  title,
});
</script>
