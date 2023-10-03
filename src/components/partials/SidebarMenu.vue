<script setup>
import SidebarMenuItem from '@/components/partials/SidebarMenuItem.vue';

import { useSidebar } from '@/stores/sidebar';

const $sidebar = useSidebar();
</script>

<template>
  <ul class="layout-menu">
    <template v-for="(item, index) in $sidebar.links" :key="item">
      <SidebarMenuItem v-if="!item.separator" :item="item" :index="index" />
    </template>
  </ul>
</template>
