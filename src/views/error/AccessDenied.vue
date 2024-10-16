<script setup>
import { useConfig } from '@/stores/config';

const $config = useConfig();
</script>

<template>
  <div class="flex h-full w-full flex-col place-content-center items-center">
    <h1 class="mb-2 text-6xl font-bold">
      {{ $t('Access Denied') }}
    </h1>
    <span class="mb-8 text-surface-500">
      {{ $t('You do not have the necessary permisions') }}
    </span>
    <img
      :src="$config?.appTheme === 'light' ? '/img/403-dark.webp' : '/img/403-light.webp'"
      alt="Access denied"
      width="300"
      class="mb-6"
    />
    <div class="font-semibold uppercase text-primary-600 hover:text-primary-500">
      <i class="pi pi-home mr-2"></i>
      <RouterLink :to="{ name: 'home' }">
        {{ $t('Back to home page') }}
      </RouterLink>
    </div>
  </div>
</template>
