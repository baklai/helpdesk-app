<script setup>
import BtnFTPClient from '@/components/buttons/BtnFTPClient.vue';
import BtnToggleTheme from '@/components/buttons/BtnToggleTheme.vue';
import BtnToggleLang from '@/components/buttons/BtnToggleLang.vue';
import BtnNotifications from '@/components/buttons/BtnNotifications.vue';
import BtnFullScreen from '@/components/buttons/BtnFullScreen.vue';
import BtnMainMenu from '@/components/buttons/BtnMainMenu.vue';

import { useConfig } from '@/stores/config';

const { toggleSidebarMenu } = useConfig();
</script>

<template>
  <header
    class="flex h-20 py-0 px-8 z-10 items-center justify-between transition-left duration-200"
  >
    <Button
      text
      plain
      rounded
      icon="pi pi-bars"
      class="text-2xl w-12 h-12"
      @click="toggleSidebarMenu"
    />

    <div class="flex gap-x-2">
      <BtnToggleTheme class="hidden md:flex" />
      <BtnToggleLang class="hidden md:flex" />
      <BtnFTPClient class="hidden md:flex" />
      <BtnNotifications class="hidden md:flex" />
      <BtnFullScreen class="hidden md:flex" />
      <BtnMainMenu />
    </div>
  </header>
</template>
