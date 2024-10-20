<script setup>
import { ref, defineAsyncComponent } from 'vue';

const AppConfig = defineAsyncComponent(() => import('@/components/AppConfig.vue'));

const visible = ref(false);
</script>

<template>
  <button
    type="button"
    class="fixed inset-y-1/2 right-0 z-50 block h-12 cursor-pointer overflow-hidden rounded-none rounded-bl-md rounded-tl-md bg-surface-600 px-2.5 text-center text-2xl text-white opacity-80 shadow-lg hover:opacity-100 dark:bg-surface-700"
    v-tooltip.left="'HD опції'"
    @click="visible = !visible"
  >
    <i class="pi pi-cog rotate-0 transition duration-1000 hover:rotate-45"></i>
  </button>

  <AppConfig v-model:visible="visible" />
</template>
