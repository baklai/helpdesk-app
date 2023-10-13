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
    v-tooltip.bottom="$t('FTP File Hosting')"
    @click="$router.push({ name: 'ftp-client' })"
    v-if="$helpdesk?.ftpUrl"
  />
</template>
