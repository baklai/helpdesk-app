<script setup>
import { onMounted } from 'vue';

import BtnConfig from '@/components/buttons/BtnConfig.vue';

import ThemeSwitcher from '@/components/ThemeSwitcher.vue';

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

  <BtnConfig />

  <ThemeSwitcher />

  <Toast position="top-right" class="z-100" />
</template>
