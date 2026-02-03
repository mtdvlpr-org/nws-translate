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
      description="Importeer de teksten van NWS, verwerk updates en exporteer de vertalingen naar Google Docs of een ProgramUI.json bestand."
      :features="[
        {
          icon: 'i-lucide:file-input',
          title: '1. Importeren',
          to: '/import',
          description:
            'Importeer de originele en vertaalde NWS teksten vanuit Google Docs bestanden.',
        },
        {
          icon: 'i-lucide:languages',
          title: '2. Vertalen',
          to: '/translate',
          description:
            'Vertaal de teksten. Zoek makkelijk naar terugkerende termen.',
        },
        {
          icon: 'i-lucide:refresh-cw',
          title: '3. Update',
          to: '/update',
          description:
            'Verwerk updates die in de Google Docs bestanden zijn aangebracht.',
        },
        {
          icon: 'i-lucide:file-output',
          title: '4. Exporteren',
          to: '/export',
          description:
            'Exporteer de lokale vertalingen naar Google Docs of een ProgramUI.json bestand.',
        },
      ]"
    />
  </div>
</template>
<script setup lang="ts">
const title = "NWS Translate";
const description = "Een tool om New World Scheduler te vertalen.";

const importStore = useImportStore();
const hasTranslations = computed(() => !!importStore.translationsString);
</script>
