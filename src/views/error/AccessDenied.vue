<script setup>
import { useConfig } from '@/stores/config';

const $config = useConfig();
</script>

<template>
  <div class="flex flex-col m-auto items-center text-center w-full py-20 px-8 sm:px-20">
    <h1 class="text-6xl font-bold mb-2">
      {{ $t('Access Denied') }}
    </h1>
    <span class="text-surface-500 mb-8">
      {{ $t('You do not have the necessary permisions') }}
    </span>
    <img
      :src="$config?.appTheme === 'light' ? '/img/403-dark.webp' : '/img/403-light.webp'"
      alt="Access denied"
      width="300"
      class="mb-6"
    />
    <div class="uppercase font-semibold text-primary-600 hover:text-primary-500">
      <i class="pi pi-home mr-2"></i>
      <RouterLink :to="{ name: 'home' }">
        {{ $t('Back to home page') }}
      </RouterLink>
    </div>
  </div>
</template>
