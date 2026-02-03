<template>
  <UDropdownMenu
    v-slot="{ open }"
    size="xs"
    :modal="false"
    :content="{ align: 'start' }"
    :ui="{ content: 'min-w-fit' }"
    :items="[
      {
        label: 'Starter',
        to: 'https://starter-template.nuxt.dev/',
        color: 'primary',
        checked: true,
        type: 'checkbox',
      },
      {
        label: 'Landing',
        to: 'https://landing-template.nuxt.dev/',
      },
      {
        label: 'Docs',
        to: 'https://docs-template.nuxt.dev/',
      },
      {
        label: 'SaaS',
        to: 'https://saas-template.nuxt.dev/',
      },
      {
        label: 'Dashboard',
        to: 'https://dashboard-template.nuxt.dev/',
      },
      {
        label: 'Chat',
        to: 'https://chat-template.nuxt.dev/',
      },
      {
        label: 'Portfolio',
        to: 'https://portfolio-template.nuxt.dev/',
      },
      {
        label: 'Changelog',
        to: 'https://changelog-template.nuxt.dev/',
      },
    ]"
  >
    <UButton
      size="xs"
      label="Starter"
      variant="subtle"
      :class="[open && 'bg-primary/15']"
      trailing-icon="i-lucide-chevron-down"
      class="-mb-[6px] font-semibold rounded-full truncate"
      :ui="{
        trailingIcon: [
          'transition-transform duration-200',
          open ? 'rotate-180' : undefined,
        ]
          .filter(Boolean)
          .join(' '),
      }"
    />
  </UDropdownMenu>
</template>
