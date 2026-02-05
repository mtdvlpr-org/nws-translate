<template>
  <UPage>
    <UPageHeader
      :title="title"
      headline="Vertalen"
      :description="description"
    />

    <UPageBody>
      <template v-if="inconsistentHeadings.length">
        <UAlert
          v-for="h in inconsistentHeadings"
          :key="h.heading"
          variant="soft"
          color="warning"
          :title="`Inconsistentie in de titel: ${h.heading}`"
          description="Kies de juiste vertaling voor deze titel:"
          :actions="
            h.translations.map((t) => ({
              label: t,
              onClick: () => {
                fixInconsistentHeading(t, h.tips);
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

const inconsistentHeadings = computed(() => {
  if (!translationStore.originals.tips?.length) return [];
  const headings: Record<string, { index: number; translation: string }[]> = {};

  translationStore.originals.tips.forEach((tip, index) => {
    if (headings[tip.heading]) {
      headings[tip.heading]!.push({
        index,
        translation: translationStore.translations.tips?.[index]?.heading ?? "",
      });
    } else {
      headings[tip.heading] = [
        {
          index,
          translation:
            translationStore.translations.tips?.[index]?.heading ?? "",
        },
      ];
    }
  });
  return Object.entries(headings)
    .filter(
      ([, tips]) =>
        tips.length > 1 &&
        tips.some((t) => t.translation !== tips[0]?.translation),
    )
    .map(([heading, tips]) => ({
      heading,
      tips: tips,
      translations: [...new Set(tips.map((t) => t.translation))],
    }));
});

const loading = ref(false);

const fixInconsistentHeading = async (
  heading: string,
  tips: { index: number }[],
) => {
  loading.value = true;
  tips.forEach((t) => {
    translationStore.translations.tips![t.index]!.heading = heading;
  });
  await new Promise((resolve) => setTimeout(resolve, 100));
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
