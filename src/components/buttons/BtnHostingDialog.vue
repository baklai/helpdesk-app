<script setup>
import { useConfig } from '@/stores/config';

const $config = useConfig();
</script>

<template>
  <Button
    text
    plain
    rounded
    icon="pi pi-cloud-upload"
    v-tooltip.bottom="$t('HD File Hosting')"
    @click="$config.cloud = !$config.cloud"
  />
</template>
