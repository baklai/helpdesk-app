<script setup>
import { onMounted } from 'vue';

import BtnConfig from '@/components/buttons/BtnConfig.vue';

import { useConfig } from '@/stores/config';

const { initAppConfigs } = useConfig();

onMounted(() => {
  initAppConfigs();
});
</script>

<template>
  <component :is="$route.meta.layout">
    <slot />
  </component>

  <BtnConfig />

  <Toast position="top-right" class="z-100" />
</template>
