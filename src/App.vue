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
  <component :is="$route.meta.layout">
    <slot />
  </component>

  <Toast position="top-right" class="z-100" />
</template>
