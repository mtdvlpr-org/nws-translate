<template>
  <div class="flex flex-col gap-8">
    <UAlert
      v-if="uiStore.missingNWS.length > 0"
      color="error"
      variant="subtle"
      :title="`${uiStore.missingNWS.length} ontbrekende vertaling(en)`"
      description="Ga naar Update en importeer daar de nieuwste NWS-teksten."
      :actions="[
        {
          label: 'Ga naar Update',
          variant: 'link',
          to: '/update',
        },
      ]"
    />
    <p>Kies een key uit de lijst om te vertalen.</p>
    <template v-if="uiStore.inconsistentNWS.length > 0">
      <p>
        {{ uiStore.inconsistentNWS.length }} mogelijke inconsistentie(s)
        gevonden:
      </p>
      <UAlert
        v-for="i in uiStore.inconsistentNWS"
        :key="i.key"
        color="warning"
        variant="subtle"
        :title="`Inconsistentie in de term: ${i.original} = ${i.translation}`"
        :description="
          i.others.length === 1
            ? i.others[0]!.value
            : `${i.others.length} inconsistente vertalingen`
        "
        :actions="[
          {
            label: 'Open termen naast elkaar',
            to: `/translate/nws/${i.key},${i.others.map((o) => o.key).join(',')}`,
          },
          ...(i.others.length === 1
            ? ([
                {
                  label: 'Markeer als consistent',
                  onClick: () => {
                    uiStore.markNWSConsistent(i.key, i.others[0]!.key);
                  },
                  color: 'neutral',
                },
              ] as const)
            : []),
        ]"
      />
    </template>
  </div>
</template>
<script setup lang="ts">
const uiStore = useUIStore();
</script>
