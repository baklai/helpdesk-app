<script setup>
import { mdiHelpCircleOutline } from '@mdi/js';
</script>

<template>
  <Button
    v-if="$helpdesk?.settings?.documentation"
    v-tooltip.bottom="'Документація'"
    as="a"
    :href="$helpdesk.settings.documentation"
    rel="noopener"
    rounded
    severity="secondary"
    target="_blank"
    variant="text"
  >
    <template #icon>
      <AppIcon :path="mdiHelpCircleOutline" :size="24" />
    </template>
  </Button>
</template>
