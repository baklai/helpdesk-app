<script setup>
const openInNewTab = url => {
  window.open(url, '_blank', 'noreferrer');
};
</script>

<template>
  <Button
    text
    plain
    rounded
    icon="pi pi-cloud-upload"
    v-tooltip.bottom="$t('HD File Hosting')"
    @click="openInNewTab($helpdesk.ftpUrl)"
    v-if="$helpdesk?.ftpUrl"
  />
</template>
