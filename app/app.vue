<template>
  <UApp>
    <UHeader title="NWS Translate">
      <UNavigationMenu :items="items" />

      <template #right>
        <UColorModeButton />
      </template>

      <template #body>
        <UNavigationMenu
          :items="items"
          class="-mx-2.5"
          orientation="vertical"
        />
        <template v-if="pageLinks.length">
          <USeparator class="my-2" />
          <UNavigationMenu
            class="-mx-2.5"
            :items="pageLinks"
            orientation="vertical"
          />
        </template>
      </template>
    </UHeader>

    <UMain>
      <UContainer>
        <NuxtPage />
      </UContainer>
    </UMain>

    <USeparator icon="i-simple-icons-nuxtdotjs" />

    <UFooter>
      <template #left>
        <p class="text-sm text-muted">
          Manoah Tervoort • © {{ new Date().getFullYear() }}
        </p>
      </template>

      <template #right>
        <UButton
          color="neutral"
          target="_blank"
          variant="ghost"
          aria-label="GitHub"
          icon="i-simple-icons-github"
          to="https://github.com/mtdvlpr-org/nws-translate"
        />
      </template>
    </UFooter>
  </UApp>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

useHead({
  htmlAttrs: { lang: "en" },
  link: [{ href: "/favicon.ico", rel: "icon" }],
  meta: [{ content: "width=device-width, initial-scale=1", name: "viewport" }],
});

const title = "NWS Translate";
const description = "Een tool om New World Scheduler te vertalen.";

useSeoMeta({
  description,
  ogDescription: description,
  ogTitle: title,
  title,
  titleTemplate: (title) =>
    title && title !== "NWS Translate"
      ? `${title} • NWS Translate`
      : "NWS Translate",
});

const pageStore = usePageStore();
const pageLinks = computed(() => pageStore.pageLinks);

const items: NavigationMenuItem[] = [
  {
    icon: "i-lucide:file-input",
    label: "Importeren",
    to: "/import",
  },
  {
    icon: "i-lucide:languages",
    label: "Vertalen",
    to: "/translate",
  },
  {
    icon: "i-lucide:refresh-cw",
    label: "Update",
    to: "/update",
  },
  {
    icon: "i-lucide:file-output",
    label: "Exporteren",
    to: "/export",
  },
];

const uiStore = useUIStore();
const translationStore = useTranslationStore();

onMounted(() => {
  if (
    Object.keys(uiStore.translations).length === 0 &&
    Object.keys(uiStore.remoteTranslations).length > 0
  ) {
    uiStore.translations = parseTranslationFile(uiStore.translationsString);
  }

  if (
    Object.keys(uiStore.nwpTranslations ?? {}).length === 0 &&
    !!uiStore.nwpString
  ) {
    uiStore.nwpTranslations = parseTranslationFile(uiStore.nwpString);
  }

  typedKeys(translationStore.input).forEach((key) => {
    if (translationStore.input[key] && !translationStore.translations[key]) {
      translationStore.setTranslations(translationStore.input, key);
    }
  });
});
</script>
