<template>
  <UPage>
    <UPageHeader
      :title="title"
      headline="Vertalen"
      :description="description"
    />

    <UPageBody>
      <template v-if="translationStore.inconsistentTips.length">
        <p>
          {{ translationStore.inconsistentTips.length }} inconsistentie(s)
          gevonden:
        </p>
        <UAlert
          v-for="h in translationStore.inconsistentTips"
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
        <TipForm
          v-for="(tip, i) in translationStore.originals.tips"
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
const translationStore = useTranslationStore();

const loading = ref(false);

const fixInconsistentTips = async (
  heading: string,
  tips: { index: number }[],
) => {
  loading.value = true;
  await translationStore.fixInconsistentTips(heading, tips);
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
