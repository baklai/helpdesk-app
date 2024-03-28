<script setup>
import { ref, defineAsyncComponent } from 'vue';

const AppConfig = defineAsyncComponent(() => import('@/components/AppConfig.vue'));

const visible = ref(false);
</script>

<template>
  <button
    type="button"
    class="text-2xl block fixed h-12 px-2.5 z-50 opacity-80 hover:opacity-100 overflow-hidden rounded-none rounded-tl-md rounded-bl-md leading-none bg-surface-600 dark:bg-surface-700 shadow-lg text-white text-center inset-y-1/2 right-0 cursor-pointer"
    v-tooltip.left="$t('HD Options')"
    @click="visible = !visible"
  >
    <i class="pi pi-cog transition duration-1000 rotate-0 hover:rotate-45"></i>
  </button>

  <AppConfig v-model:visible="visible" />
</template>
