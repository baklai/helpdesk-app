<script setup>
import AppMenuItem from '@/components/AppMenuItem.vue';
import { useSidebar } from '@/stores/sidebar';

const Sidebar = useSidebar();
</script>

<template>
  <ul class="layout-menu">
    <template v-for="(item, index) in Sidebar.links" :key="item">
      <AppMenuItem v-if="!item.separator" :item="item" :index="index" />
    </template>
  </ul>
</template>
