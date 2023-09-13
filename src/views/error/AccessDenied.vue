<script setup>
import { useConfig } from '@/stores/config';

const $config = useConfig();
</script>

<template>
  <div class="m-auto">
    <div class="flex flex-column align-items-center w-full py-8 px-5 sm:px-8">
      <div class="flex flex-column align-items-center">
        <h1 class="text-6xl font-bold mb-2">
          {{ $t('Access Denied') }}
        </h1>
        <span class="text-color-secondary mb-5">
          {{ $t('You do not have the necessary permisions') }}
        </span>
        <img
          :src="$config?.theme === 'light' ? '/img/403-dark.webp' : '/img/403-light.webp'"
          alt="Access denied"
          width="300"
          class="mb-5"
        />
        <div class="text-center">
          <i class="pi pi-home text-blue-600 mr-2"></i>
          <RouterLink :to="{ name: 'home' }" class="text-blue-600">
            {{ $t('Back to home page') }}
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
