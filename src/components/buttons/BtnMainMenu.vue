<script setup>
import { ref, defineAsyncComponent } from 'vue';

const SidebarMenu = defineAsyncComponent(() => import('@/components/partials/SidebarMenu.vue'));
const BtnAuth = defineAsyncComponent(() => import('@/components/buttons/BtnAuth.vue'));
const BtnToggleTheme = defineAsyncComponent(() =>
  import('@/components/buttons/BtnToggleTheme.vue')
);
const BtnToggleLang = defineAsyncComponent(() => import('@/components/buttons/BtnToggleLang.vue'));

const BtnFTPClient = defineAsyncComponent(() => import('@/components/buttons/BtnFTPClient.vue'));

const BtnNotifications = defineAsyncComponent(() =>
  import('@/components/buttons/BtnNotifications.vue')
);

const BtnFullScreen = defineAsyncComponent(() => import('@/components/buttons/BtnFullScreen.vue'));

const refMenu = ref();

const toggle = event => {
  refMenu.value.toggle(event);
};
</script>

<template>
  <Button
    text
    plain
    rounded
    icon="pi pi-th-large"
    class="text-3xl w-12 h-12"
    v-tooltip.bottom="$t('Main menu')"
    @click="toggle"
  />

  <Menu ref="refMenu" popup :model="[]" class="w-96 py-2 px-4">
    <template #start>
      <div class="flex my-2 items-center">
        <div class="flex items-center">
          <Avatar icon="pi pi-user text-4xl" class="text-4xl mr-3" size="large" />
          <div>
            <p class="font-bold m-0">
              {{ $helpdesk?.user?.fullname }}
            </p>
            <p class="line-height-3 text-surface-500 m-0">
              {{ $helpdesk?.user?.email }}
            </p>
          </div>
        </div>
      </div>
      <div class="overflow-scroll w-full max-h-[30rem] px-4">
        <SidebarMenu />
      </div>
    </template>

    <template #item="{ label, item, props }">
      <a :href="item.url" v-bind="props.action">
        <span v-bind="props.icon" />
        <span v-bind="props.label">{{ label }}</span>
      </a>
    </template>

    <template #end>
      <div class="flex items-center content-center justify-between p-2">
        <BtnToggleTheme />
        <BtnToggleLang />
        <BtnFTPClient />
        <BtnNotifications />
        <BtnFullScreen />
        <BtnAuth />
      </div>
    </template>
  </Menu>
</template>
