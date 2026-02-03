<template>
  <CodeDiff
    hide-header
    :context="0"
    :theme="theme"
    language="json"
    no-diff-line-feed
    :new-string="newString"
    :old-string="oldString"
    output-format="line-by-line"
  />
</template>
<script setup lang="ts">
import { CodeDiff } from "v-code-diff";

defineProps<{
  newString: string;
  oldString: string;
}>();

const colorMode = useColorMode();
const theme = computed(() => colorMode.value);
</script>
