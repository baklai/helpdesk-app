<script setup>
import { defineAsyncComponent } from 'vue';

const AppMenuItem = defineAsyncComponent(() => import('@/components/AppMenuItem.vue'));

// import AppMenuItem from '@/components/AppMenuItem.vue';

import { useSidebar } from '@/stores/sidebar';

const $sidebar = useSidebar();
</script>

<template>
  <ul class="layout-menu">
    <template v-for="(item, index) in $sidebar.links" :key="item">
      <AppMenuItem v-if="!item.separator" :item="item" :index="index" />
    </template>
  </ul>
</template>
