<script setup>
import { useConfig } from '@/stores/config';

const Config = useConfig();
</script>

<template>
  <Button
    text
    plain
    rounded
    icon="pi pi-cloud-upload"
    v-tooltip.bottom="$t('HD File Hosting')"
    @click="Config.cloud = !Config.cloud"
  />
</template>
