<script setup>
import { onMounted } from 'vue';
import { useConfig } from '@/stores/config';

const $config = useConfig();

onMounted(() => {
  $config.applyScale();
  $config.onMenuToggle();
  $config.toggleTheme();
  $config.toggleLang();
});
</script>

<template>
  <ScrollTop />

  <RouterView />

  <Toast position="bottom-right" class="z-100" />

  <ConfirmDialog :style="{ minWidth: '350px' }">
    <template #message="slotProps">
      <div class="flex align-items-center justify-content-start confirmation-content">
        <i class="text-4xl mr-3" :class="slotProps.message.icon" />
        <span class="font-medium">{{ slotProps.message.message }} </span>
      </div>
    </template>
  </ConfirmDialog>
</template>

<style scoped>
.p-scrolltop.p-link {
  background: var(--primary-color);
}
</style>
