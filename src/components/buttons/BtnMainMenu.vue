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
    class="h-12 w-12 text-3xl"
    v-tooltip.bottom="$t('Main menu')"
    @click="toggle"
  />

  <Menu ref="refMenu" popup :model="[]" class="w-[22rem] px-4 py-2">
    <template #start>
      <div class="my-2 flex items-center">
        <div class="flex items-center">
          <Avatar icon="pi pi-user text-4xl" class="mr-3 text-4xl" size="large" />
          <div>
            <p class="m-0 font-bold">
              {{ $helpdesk?.profile?.fullname }}
            </p>
            <p class="line-height-3 m-0 text-surface-500">
              {{ $helpdesk?.profile?.email }}
            </p>
          </div>
        </div>
      </div>
      <div class="max-h-[30rem] w-full overflow-scroll px-2 py-2">
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
      <div class="flex content-center items-center justify-between py-2">
        <BtnToggleTheme />
        <BtnToggleLang />
        <BtnStorageClient />
        <BtnFullScreen />
        <BtnAuth />
      </div>
    </template>
  </Menu>
</template>
