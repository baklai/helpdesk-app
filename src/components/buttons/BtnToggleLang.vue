<script setup>
import { ref } from 'vue';

import { useConfig } from '@/stores/config';

const $config = useConfig();
const refMenu = ref();
const items = ref([
  {
    label: 'English',
    icon: 'pi pi-language',
    command: () => $config.toggleLang('en')
  },
  {
    label: 'Українська',
    icon: 'pi pi-language',
    command: () => $config.toggleLang('uk')
  },
  {
    label: 'Русский',
    icon: 'pi pi-language',
    command: () => $config.toggleLang('ru')
  }
]);
</script>

<template>
  <div>
    <Menu ref="refMenu" :model="items" popup>
      <template #item="{ label, item, props }">
        <a :href="item.url" v-bind="props.action">
          <span v-bind="props.icon" />
          <span v-bind="props.label">{{ label }}</span>
        </a>
      </template>
    </Menu>

    <Button
      text
      plain
      rounded
      icon="pi pi-language"
      class="text-2xl w-12 h-12"
      v-tooltip.bottom="$t('Languages')"
      @click="event => refMenu.toggle(event)"
    />
  </div>
</template>
