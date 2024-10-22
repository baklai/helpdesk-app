<script setup>
import { useConfig } from '@/stores/config';

const $config = useConfig();
</script>

<template>
  <Button
    text
    plain
    rounded
    class="h-12 w-12 text-2xl"
    :icon="$config.isDarkAppTheme ? 'pi pi-sun' : 'pi pi-moon'"
    v-tooltip.bottom="$config.isDarkAppTheme ? 'Світла тема' : 'Темна тема'"
    @click="$config.isDarkAppTheme ? ($config.appTheme = 'light') : ($config.appTheme = 'dark')"
  />
</template>
