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
                  variant: 'subtle',
                  color: 'neutral',
                },
              ] as const)
            : []),
        ]"
      />
    </template>
    <template v-if="uiStore.inconsistentNWSSpecialCharacters.length > 0">
      <p>
        {{ uiStore.inconsistentNWSSpecialCharacters.length }}
        inconsistentie(s) in afsluitende leestekens gevonden:
      </p>
      <UAlert
        v-for="i in uiStore.inconsistentNWSSpecialCharacters"
        :key="`special-${i.key}`"
        color="warning"
        variant="subtle"
        title="Inconsistentie in afsluitend leesteken"
        :description="`EN: ${i.original} • NL: ${i.translation}`"
        :actions="[
          {
            label: 'Open key',
            to: `/translate/nws/${i.key}`,
          },
        ]"
      />
    </template>
    <template v-if="uiStore.inconsistentNWSUntranslatedTerms.length > 0">
      <p>
        {{ uiStore.inconsistentNWSUntranslatedTerms.length }}
        onvertaalde term(en) ontbreken in vertaling:
      </p>
      <UAlert
        v-for="i in uiStore.inconsistentNWSUntranslatedTerms"
        :key="`untranslated-${i.key}-${i.term}`"
        color="warning"
        variant="subtle"
        :description="`EN: ${i.original} • NL: ${i.translation}`"
        :title="`Term &quot;${i.term}&quot; ontbreekt in vertaling`"
        :actions="[
          {
            label: 'Open key',
            to: `/translate/nws/${i.key}`,
          },
        ]"
      />
    </template>
  </div>
</template>
<script setup lang="ts">
const uiStore = useUIStore();
</script>
