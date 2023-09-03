<script setup>
import { useConfig } from '@/stores/config';

const Config = useConfig();
</script>

<template>
  <Button
    text
    plain
    rounded
    :icon="Config.isDarkTheme ? 'pi pi-sun' : 'pi pi-moon'"
    v-tooltip.bottom="Config.isDarkTheme ? $t('Theme Light') : $t('Theme Dark')"
    @click="Config.isDarkTheme ? (Config.theme = 'light') : (Config.theme = 'dark')"
  />
</template>
