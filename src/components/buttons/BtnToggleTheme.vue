<script setup>
import { useConfig } from '@/stores/config';

const $config = useConfig();
</script>

<template>
  <Button
    text
    plain
    rounded
    class="text-2xl w-12 h-12"
    :icon="$config.isDarkAppTheme ? 'pi pi-sun' : 'pi pi-moon'"
    v-tooltip.bottom="$config.isDarkAppTheme ? $t('Theme Light') : $t('Theme Dark')"
    @click="$config.isDarkAppTheme ? ($config.appTheme = 'light') : ($config.appTheme = 'dark')"
  />
</template>
