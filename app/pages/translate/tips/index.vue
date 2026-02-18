<template>
  <UPage>
    <UPageHeader
      :title="title"
      headline="Vertalen"
      :description="description"
    />

    <UPageBody>
      <template v-if="jsonStore.inconsistentTips.length">
        <p>
          {{ jsonStore.inconsistentTips.length }} inconsistentie(s) gevonden:
        </p>
        <UAlert
          v-for="h in jsonStore.inconsistentTips"
          :key="h.heading"
          variant="soft"
          color="warning"
          :title="`Inconsistentie in de titel: ${h.heading}`"
          description="Kies de juiste vertaling voor deze titel."
          :actions="
            h.translations.map((t) => ({
              label: t,
              onClick: () => {
                fixInconsistentTips(t, h.tips);
              },
            }))
          "
        />
      </template>
      <template v-if="loading">
        <div v-for="i in 12" :key="i" class="grid gap-2">
          <USkeleton class="h-4 w-3xs" />
          <USkeleton class="h-4 w-20" />
          <USkeleton class="h-4 w-full" />
        </div>
      </template>
      <template v-else>
        <UPageCard
          v-if="jsonStore.missingTips.length > 0"
          highlight
          highlight-color="error"
          :title="`${jsonStore.missingTips.length} ontbrekende vertaling(en) gevonden:`"
        >
          <TipForm
            v-for="[i, tip] in jsonStore.missingTips"
            :key="i"
            :index="i"
            :tip="tip"
          />
        </UPageCard>
        <TipForm
          v-for="(tip, i) in jsonStore.originals.tips"
          :id="`tip-${i}`"
          :key="i"
          :index="i"
          :tip="tip"
        />
      </template>
    </UPageBody>
  </UPage>
</template>
<script setup lang="ts">
const jsonStore = useJsonStore();

const loading = ref(false);

const fixInconsistentTips = async (
  heading: string,
  tips: { index: number }[],
) => {
  loading.value = true;
  await jsonStore.fixInconsistentTips(heading, tips);
  loading.value = false;
};

const title = "Tips";
const description = "Vertaal op deze pagina de tips.";

useSeoMeta({
  description,
  ogDescription: description,
  ogTitle: title,
  title,
});
</script>
