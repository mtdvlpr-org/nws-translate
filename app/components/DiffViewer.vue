<template>
  <CodeDiff
    hide-header
    :theme="theme"
    language="json"
    no-diff-line-feed
    :context="context ?? 0"
    :new-string="newString"
    :old-string="oldString"
    output-format="line-by-line"
  />
</template>
<script setup lang="ts">
import { CodeDiff } from "v-code-diff";

defineProps<{
  context?: number;
  newString: string;
  oldString: string;
}>();

const colorMode = useColorMode();
const theme = computed(() => colorMode.value);
</script>
