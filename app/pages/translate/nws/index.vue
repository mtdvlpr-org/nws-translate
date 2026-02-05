<template>
  <div class="flex flex-col gap-4">
    <p>Kies een key uit de lijst om te vertalen.</p>
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
  </div>
</template>
<script setup lang="ts">
const uiStore = useUIStore();
</script>
