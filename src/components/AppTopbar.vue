<script setup>
import { ref, computed, onMounted, onBeforeUnmount, defineAsyncComponent } from 'vue';

import { useConfig } from '@/stores/config';

const BtnFTPClient = defineAsyncComponent(() => import('@/components/buttons/BtnFTPClient.vue'));

const BtnToggleTheme = defineAsyncComponent(() =>
  import('@/components/buttons/BtnToggleTheme.vue')
);

const BtnToggleLang = defineAsyncComponent(() => import('@/components/buttons/BtnToggleLang.vue'));

const BtnNotifications = defineAsyncComponent(() =>
  import('@/components/buttons/BtnNotifications.vue')
);

const BtnMainMenu = defineAsyncComponent(() => import('@/components/buttons/BtnMainMenu.vue'));

const BtnFullScreen = defineAsyncComponent(() => import('@/components/buttons/BtnFullScreen.vue'));

const $config = useConfig();

const outsideClickListener = ref(null);
const topbarMenuActive = ref(false);

onMounted(() => {
  bindOutsideClickListener();
});

onBeforeUnmount(() => {
  unbindOutsideClickListener();
});

const topbarMenuClasses = computed(() => {
  return {
    'layout-topbar-menu-mobile-active': topbarMenuActive.value
  };
});

const onTopBarMenuButton = () => {
  topbarMenuActive.value = !topbarMenuActive.value;
};

const bindOutsideClickListener = () => {
  if (!outsideClickListener.value) {
    outsideClickListener.value = event => {
      if (isOutsideClicked(event)) {
        topbarMenuActive.value = false;
      }
    };
    document.addEventListener('click', outsideClickListener.value);
  }
};

const unbindOutsideClickListener = () => {
  if (outsideClickListener.value) {
    document.removeEventListener('click', outsideClickListener);
    outsideClickListener.value = null;
  }
};

const isOutsideClicked = event => {
  if (!topbarMenuActive.value) return;
  const sidebarEl = document.querySelector('.layout-topbar-menu');
  const topbarEl = document.querySelector('.layout-topbar-menu-button');
  return !(
    sidebarEl.isSameNode(event.target) ||
    sidebarEl.contains(event.target) ||
    topbarEl.isSameNode(event.target) ||
    topbarEl.contains(event.target)
  );
};
</script>

<template>
  <div class="layout-topbar justify-between">
    <Button
      text
      plain
      rounded
      icon="pi pi-bars"
      class="layout-menu-button layout-topbar-button text-2xl w-12 h-12"
      @click="$config.onMenuToggle()"
    />

    <Button
      text
      plain
      rounded
      icon="pi pi-ellipsis-v"
      class="layout-topbar-menu-button layout-topbar-button text-2xl w-12 h-12"
      @click="onTopBarMenuButton()"
    />

    <div class="layout-topbar-menu flex gap-x-2 p-0" :class="topbarMenuClasses">
      <BtnToggleTheme />
      <BtnToggleLang />
      <BtnFTPClient />
      <BtnNotifications />
      <BtnFullScreen />
      <BtnMainMenu />
    </div>
  </div>
</template>
