<script setup>
import { ref, defineAsyncComponent } from 'vue';

const AppProfile = defineAsyncComponent(() => import('@/components/AppProfile.vue'));

const visible = ref(false);
</script>

<template>
  <Button
    text
    plain
    rounded
    icon="pi pi-user"
    class="text-2xl w-12 h-12"
    v-tooltip.top="$t('Profile account')"
    @click="visible = !visible"
  />

  <AppProfile v-model:visible="visible" v-if="visible" />
</template>
