<script setup>
import AppMenu from '@/components/AppMenu.vue';
import BtnAppAuth from '@/components/buttons/BtnAppAuth.vue';
import BtnTimeOut from '@/components/buttons/BtnTimeOut.vue';
import BtnToggleTheme from '@/components/buttons/BtnToggleTheme.vue';
import BtnToggleLang from '@/components/buttons/BtnToggleLang.vue';
</script>

<template>
  <RouterLink to="/" class="flex justify-content-center layout-topbar-logo py-2 mb-6">
    <div class="flex justify-content-center">
      <div class="justify-content-start">
        <p class="uppercase font-bold text-4xl m-0 text-color" translate="no" lang="en">
          h&nbsp;e&nbsp;l&nbsp;p&nbsp;
        </p>
      </div>
      <div class="flex align-items-center justify-content-center">
        <img src="/img/logo-app.webp" alt="HD logo" width="32" height="32" class="mx-2" />
      </div>
      <div class="justify-content-start">
        <p class="uppercase font-bold text-4xl m-0 text-color" translate="no" lang="en">
          &nbsp;d&nbsp;e&nbsp;s&nbsp;k
        </p>
      </div>
    </div>
  </RouterLink>

  <div class="flex justify-content-start mt-6 mb-4">
    <div class="flex align-items-center justify-content-center mr-2">
      <Avatar class="mr-2" size="xlarge"><AppIcons :name="$route?.name" :size="32" /></Avatar>
    </div>
    <div class="flex align-items-center justify-content-center">
      <div>
        <span class="text-2xl">{{ $t($route?.meta?.title) }}</span>
        <p class="text-sm text-color-secondary m-0">
          {{ $t($route?.meta?.description) }}
        </p>
      </div>
    </div>
  </div>

  <div class="menu-sidebar overflow-y-scroll w-full text-base my-4">
    <AppMenu />
  </div>

  <div class="absolute bottom-0 left-0 right-0 w-full">
    <div class="flex align-items-center align-content-center justify-content-around flex-wrap p-4">
      <BtnTimeOut class="hover:text-color" />
      <BtnToggleLang />
      <BtnToggleTheme iconClass="text-2xl" class="w-3rem h-3rem hover:text-color" />
      <BtnAppAuth iconClass="text-2xl" class="w-3rem h-3rem hover:text-color" />
    </div>
  </div>
</template>

<style scoped>
.menu-sidebar {
  height: calc(100vh - 20rem);
  scrollbar-width: none;
}
</style>
