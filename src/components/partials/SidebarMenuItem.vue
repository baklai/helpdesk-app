<script setup>
import { ref, onBeforeMount, watch } from 'vue';
import { useRoute } from 'vue-router';

import SidebarMenuItem from '@/components/partials/SidebarMenuItem.vue';

import { useConfig } from '@/stores/config';

const Route = useRoute();
const $config = useConfig();

const props = defineProps({
  item: {
    type: Object,
    default: () => ({})
  },
  index: {
    type: Number,
    default: 0
  },
  root: {
    type: Boolean,
    default: true
  },
  parentItemKey: {
    type: String,
    default: null
  }
});

const isActiveMenu = ref(false);

const itemKey = ref(null);

onBeforeMount(() => {
  itemKey.value = props.parentItemKey
    ? props.parentItemKey + '-' + props.index
    : String(props.index);

  const activeItem = $config.activeMenuItem;

  isActiveMenu.value =
    activeItem === itemKey.value || activeItem ? activeItem.startsWith(itemKey.value + '-') : false;
});

watch(
  () => $config.activeMenuItem,
  newVal => {
    isActiveMenu.value = newVal === itemKey.value || newVal.startsWith(itemKey.value + '-');
  }
);

const itemClick = (event, item) => {
  if (item.disabled) {
    event.preventDefault();
    return;
  }

  // if ((item.to || item.url) && ($config.staticMenuMobileActive || $config.overlayMenuActive)) {
  //   $config.toggleAppSideBar();
  // }

  if (item.command) {
    item.command({ originalEvent: event, item: item });
  }

  const foundItemKey = item.items
    ? isActiveMenu.value
      ? props.parentItemKey
      : itemKey
    : itemKey.value;

  $config.setActiveMenuItem(foundItemKey);
};

const checkActiveRoute = item => {
  return Route.name === item.name;
};
</script>

<template>
  <li class="select-none">
    <div v-if="root && item.visible !== false" class="text-sm font-bold uppercase my-4 mx-0">
      {{ item.title }}
    </div>

    <RouterLink
      v-if="item.name && !item.items && item.visible !== false"
      @click="itemClick($event, item, index)"
      :to="{ name: item.name }"
      :class="[
        item.class,
        'text-base font-semibold',
        'flex items-center relative outline-0 py-3 px-4 rounded-xl cursor-pointer',
        'hover:bg-surface-200 dark:hover:bg-surface-800'
      ]"
      tabindex="0"
    >
      <AppIcons
        :name="item.icon"
        class="mr-2"
        :size="18"
        :class="[{ 'text-primary-500': checkActiveRoute(item) }]"
      />
      <span :class="[{ '!font-bold text-primary-500': checkActiveRoute(item) }]">
        {{ item.title }}
      </span>
      <i
        :class="[
          'pi pi-angle-down',
          'text-sm ml-auto',
          'transition transform delay-200',
          { ' rotate-180': isActiveMenu }
        ]"
        v-if="item.items"
      />
    </RouterLink>

    <a
      v-if="(!item.name || item.items) && item.visible !== false"
      :href="item.url"
      @click="!item.url && itemClick($event, item, index)"
      :target="item.target"
      :class="[
        item.class,
        { flex: !item.visible },
        { hidden: root && !item.visible },
        'items-center relative outline-0 py-3 px-4 rounded-xl cursor-pointer',
        'hover:bg-surface-200 dark:hover:bg-surface-800'
      ]"
      tabindex="0"
    >
      <AppIcons :name="item.icon" class="mr-2" :size="18" />
      <span class="text-base font-semibold">{{ item.title }}</span>
      <i
        :class="[
          'pi pi-angle-down',
          'text-sm ml-auto',
          'transition transform delay-200',
          { ' rotate-180': isActiveMenu }
        ]"
        v-if="item.items"
      />
    </a>

    <div v-if="item.items && item.visible !== false">
      <ul v-show="root ? true : isActiveMenu">
        <SidebarMenuItem
          v-for="(child, index) in item.items"
          :key="child"
          :index="index"
          :item="child"
          :parentItemKey="itemKey"
          :root="false"
        />
      </ul>
    </div>
  </li>
</template>

<style scoped>
ul > li > div > ul > li > div > ul > li > a {
  margin-left: 1.5rem;
}
</style>
