<script setup>
import { useConfig } from '@/stores/config';

const $config = useConfig();
</script>

<template>
  <div class="container">
    <div
      class="w-full surface-card py-8 px-5 sm:px-8 flex flex-column align-items-center border-radius-53"
    >
      <div class="grid flex flex-column align-items-center">
        <h1 class="text-900 font-bold text-4xl lg:text-5xl mb-2">{{ $t('Not Found') }}</h1>
        <span class="text-600 mb-5">{{ $t('Requested resource is not available') }}.</span>
        <img
          :src="$config?.theme === 'light' ? '/img/404-dark.webp' : '/img/404-light.webp'"
          alt="Access denied"
          width="280"
          class="mb-5"
        />
        <div class="col-12 mt-5 text-center">
          <i class="pi pi-arrow-left text-blue-500 mr-2" style="vertical-align: center"></i>
          <router-link to="/" class="text-blue-500">{{ $t('Go to Dashboard') }}</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  border-radius: 56px;
  padding: 0.3rem;
  background: linear-gradient(180deg, rgba(33, 150, 243, 0.4) 10%, rgba(33, 150, 243, 0) 30%);
}

.border-radius-53 {
  border-radius: 53px;
}
</style>
