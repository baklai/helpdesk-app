<script setup>
import { ref } from 'vue';
import { useConfig } from '@/stores/config';

const Config = useConfig();

const refMenu = ref();
const items = ref([
  {
    label: 'English',
    icon: 'pi pi-language',
    command: () => Config.toggleLang('en')
  },
  {
    label: 'Українська',
    icon: 'pi pi-language',
    command: () => Config.toggleLang('uk')
  },
  {
    label: 'Русский',
    icon: 'pi pi-language',
    command: () => Config.toggleLang('ru')
  }
]);
</script>

<template>
  <Menu ref="refMenu" id="language_menu" :model="items" :popup="true" />

  <Button
    text
    plain
    rounded
    aria-haspopup="true"
    aria-controls="language_menu"
    icon="pi pi-language"
    iconClass="text-2xl"
    class="p-button-lg hover:text-color h-3rem w-3rem"
    v-tooltip.bottom="$t('Languages')"
    @click="(event) => refMenu.toggle(event)"
  />
</template>
