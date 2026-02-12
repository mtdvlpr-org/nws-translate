<template>
  <div>
    <UPageHero
      :title="title"
      :description="description"
      :links="[
        {
          label: 'Begin met vertalen',
          to: hasTranslations ? '/translate' : '/import',
          icon: 'i-lucide:languages',
          size: 'xl',
        },
        {
          label: 'Verwerk een update',
          to: '/update',
          icon: 'i-lucide:refresh-cw',
          size: 'xl',
          color: 'neutral',
          variant: 'subtle',
        },
      ]"
    />

    <UPageSection
      id="features"
      title="Alles wat je nodig hebt om NWS efficiënt te vertalen"
      description="Vertaal NWS UI, NWP UI, lectuur, lezingen, liederen, tips en e-mailtemplates met één tool."
      :features="[
        {
          icon: 'i-lucide:file-input',
          title: '1. Importeren',
          to: '/import',
          description:
            'Importeer de originele en vertaalde teksten vanuit Google Docs, .json- en .txt-bestanden.',
        },
        {
          icon: 'i-lucide:languages',
          title: '2. Vertalen',
          to: '/translate',
          description:
            'Vertaal de teksten met een simpele interface, zoekfunctie en meer.',
        },
        {
          icon: 'i-lucide:refresh-cw',
          title: '3. Update',
          to: '/update',
          description:
            'Zie precies welke veranderingen zijn aangebracht en verwerk ze met één klik.',
        },
        {
          icon: 'i-lucide:file-output',
          title: '4. Exporteren',
          to: '/export',
          description:
            'Exporteer de lokale vertalingen naar Google Docs, .json- en .txt-bestanden.',
        },
      ]"
    />
  </div>
</template>
<script setup lang="ts">
const title = "NWS Translate";
const description = "Een tool om New World Scheduler te vertalen.";

const uiStore = useUIStore();
const hasTranslations = computed(() => !!uiStore.translationsString);
</script>
