<script setup>
import BtnStorageClient from '@/components/buttons/BtnStorageClient.vue';
import BtnToggleTheme from '@/components/buttons/BtnToggleTheme.vue';
import BtnToggleLang from '@/components/buttons/BtnToggleLang.vue';
import BtnNotifications from '@/components/buttons/BtnNotifications.vue';
import BtnFullScreen from '@/components/buttons/BtnFullScreen.vue';
import BtnMainMenu from '@/components/buttons/BtnMainMenu.vue';

import { useConfig } from '@/stores/config';

const { toggleAppSideBar } = useConfig();
</script>

<template>
  <header
    class="transition-left z-10 flex h-20 items-center justify-between px-8 py-0 duration-200"
  >
    <Button
      text
      plain
      rounded
      icon="pi pi-bars"
      class="h-12 w-12 text-2xl"
      @click="toggleAppSideBar"
    />

    <div class="flex gap-x-2">
      <BtnToggleTheme class="hidden md:flex" />
      <BtnToggleLang class="hidden md:flex" />
      <BtnStorageClient class="hidden md:flex" />
      <BtnNotifications class="hidden md:flex" />
      <BtnFullScreen class="hidden md:flex" />
      <BtnMainMenu />
    </div>
  </header>
</template>
