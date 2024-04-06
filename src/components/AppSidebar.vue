<script setup>
import AppLogo from '@/components/AppLogo.vue';
import SidebarMenu from '@/components/menus/SidebarMenu.vue';
import BtnAuth from '@/components/buttons/BtnAuth.vue';
import BtnInfoUser from '@/components/buttons/BtnInfoUser.vue';
import BtnToggleTheme from '@/components/buttons/BtnToggleTheme.vue';
import BtnToggleLang from '@/components/buttons/BtnToggleLang.vue';
</script>

<template>
  <div
    :class="[
      'list-none',
      'pointer-events-auto',
      'flex flex-col relative',
      'w-[25rem] h-full py-2 px-6',
      'bg-surface-100 dark:bg-surface-900',
      'transition-transform duration-200'
    ]"
  >
    <RouterLink :to="{ name: 'home' }" class="flex justify-center py-2 mb-6">
      <div class="flex flex-col items-center justify-center mb-2">
        <div class="flex justify-center text-surface-900 dark:text-surface-50">
          <div class="justify-start">
            <p class="uppercase font-bold text-4xl m-0" translate="no" lang="en">
              h&nbsp;e&nbsp;l&nbsp;p&nbsp;
            </p>
          </div>
          <div class="flex items-center justify-center">
            <AppLogo class="mx-2 text-primary-500" :size="32" />
          </div>
          <div class="justify-start">
            <p class="uppercase font-bold text-4xl m-0" translate="no" lang="en">
              &nbsp;d&nbsp;e&nbsp;s&nbsp;k
            </p>
          </div>
        </div>
        <div class="flex text-center">
          <p class="text-base font-medium text-surface-500">
            {{ $t('Web Application of technical support') }}
          </p>
        </div>
      </div>
    </RouterLink>

    <div class="flex justify-start my-6" v-if="$route?.meta?.title">
      <div class="flex items-center justify-center mr-2">
        <Avatar class="mr-2" size="xlarge">
          <AppIcons :name="$route?.name" :size="32" />
        </Avatar>
      </div>
      <div class="flex flex-col items-start justify-center">
        <span class="text-2xl">{{ $t($route?.meta?.title) }}</span>
        <p class="text-sm text-surface-500">
          {{ $t($route?.meta?.description) }}
        </p>
      </div>
    </div>

    <div
      class="overflow-y-scroll w-full text-base my-6"
      style="height: calc(100vh - 20rem); scrollbar-width: none"
    >
      <SidebarMenu />
    </div>

    <div class="w-full absolute bottom-0 left-0 right-0">
      <div class="flex items-center content-center justify-between flex-wrap py-2 px-4">
        <BtnInfoUser />
        <BtnToggleLang />
        <BtnToggleTheme />
        <BtnAuth />
      </div>
    </div>
  </div>
</template>
