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
    class="h-12 w-12 text-2xl"
    v-tooltip.bottom="'Клієнт файлового сховища'"
    @click="$router.push({ name: 'storage' })"
  />
</template>
