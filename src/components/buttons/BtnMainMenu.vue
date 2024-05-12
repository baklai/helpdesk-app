<script setup>
import { ref } from 'vue';

import SidebarMenu from '@/components/menus/SidebarMenu.vue';
import BtnAuth from '@/components/buttons/BtnAuth.vue';
import BtnToggleTheme from '@/components/buttons/BtnToggleTheme.vue';
import BtnToggleLang from '@/components/buttons/BtnToggleLang.vue';
import BtnStorageClient from '@/components/buttons/BtnStorageClient.vue';
import BtnFullScreen from '@/components/buttons/BtnFullScreen.vue';

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

  <Menu ref="refMenu" popup :model="[]" class="w-[22rem] py-2 px-4">
    <template #start>
      <div class="flex my-2 items-center">
        <div class="flex items-center">
          <Avatar icon="pi pi-user text-4xl" class="text-4xl mr-3" size="large" />
          <div>
            <p class="font-bold m-0">
              {{ $helpdesk?.profile?.fullname }}
            </p>
            <p class="line-height-3 text-surface-500 m-0">
              {{ $helpdesk?.profile?.email }}
            </p>
          </div>
        </div>
      </div>
      <div class="overflow-scroll w-full max-h-[30rem] px-2 py-2">
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
      <div class="flex items-center content-center justify-between py-2">
        <BtnToggleTheme />
        <BtnToggleLang />
        <BtnStorageClient />
        <BtnFullScreen />
        <BtnAuth />
      </div>
    </template>
  </Menu>
</template>
