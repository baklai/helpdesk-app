<script setup>
import SidebarMenu from '@/components/partials/SidebarMenu.vue';
import BtnAuth from '@/components/buttons/BtnAuth.vue';
import BtnToggleTheme from '@/components/buttons/BtnToggleTheme.vue';
import BtnToggleLang from '@/components/buttons/BtnToggleLang.vue';
import BtnUserInfo from '@/components/buttons/BtnUserInfo.vue';
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

  <div class="flex justify-content-start mt-6 mb-4" v-if="$route?.meta?.title">
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

  <div class="sidebar-menu overflow-y-scroll w-full text-base my-4">
    <SidebarMenu />
  </div>

  <div class="absolute bottom-0 left-0 right-0 w-full">
    <div class="flex align-items-center align-content-center justify-content-between flex-wrap p-4">
      <BtnUserInfo />
      <BtnToggleLang />
      <BtnToggleTheme iconClass="text-2xl" class="w-3rem h-3rem hover:text-color" />
      <BtnAuth iconClass="text-2xl" class="w-3rem h-3rem hover:text-color" />
    </div>
  </div>
</template>

<style scoped>
.sidebar-menu {
  height: calc(100vh - 20rem);
  scrollbar-width: none;
}
</style>
