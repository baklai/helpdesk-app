<script setup>
import { ref, defineAsyncComponent } from 'vue';

const AppInfoUser = defineAsyncComponent(() => import('@/components/AppInfoUser.vue'));

const visible = ref(false);
</script>

<template>
  <Button
    text
    plain
    rounded
    icon="pi pi-user"
    class="text-2xl w-12 h-12"
    v-tooltip.top="$t('User account')"
    @click="visible = !visible"
  />

  <AppInfoUser v-model:visible="visible" v-if="visible" />
</template>
