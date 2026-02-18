<template>
  <CodeDiff
    hide-header
    :theme="theme"
    no-diff-line-feed
    :context="context ?? 0"
    :new-string="newString"
    :old-string="oldString"
    output-format="line-by-line"
    :language="language || 'json'"
  />
</template>
<script setup lang="ts">
import { CodeDiff } from "v-code-diff";

defineProps<{
  context?: number;
  language?: string;
  newString: string;
  oldString: string;
}>();

const colorMode = useColorMode();
const theme = computed(() => colorMode.value);
</script>
