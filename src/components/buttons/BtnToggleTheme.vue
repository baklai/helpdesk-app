<script setup>
import { useConfig } from '@/stores/config';

const $config = useConfig();
</script>

<template>
  <Button
    text
    plain
    rounded
    class="text-2xl w-12 h-12 hover:text-surface-600 dark:hover:text-surface-300"
    :icon="$config.isDarkTheme ? 'pi pi-sun' : 'pi pi-moon'"
    v-tooltip.bottom="$config.isDarkTheme ? $t('Theme Light') : $t('Theme Dark')"
    @click="$config.isDarkTheme ? ($config.theme = 'light') : ($config.theme = 'dark')"
  />
</template>
