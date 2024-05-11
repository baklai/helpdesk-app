<script setup>
// const openInNewTab = url => {
//   window.open(url, '_blank', 'noreferrer');
// };
</script>

<template>
  <Button
    text
    plain
    rounded
    icon="pi pi-cloud-upload"
    class="text-2xl w-12 h-12"
    v-tooltip.bottom="$t('File Storage Client')"
    @click="$router.push({ name: 'storage' })"
  />
</template>
