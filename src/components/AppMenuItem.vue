<script setup>
import { ref, onBeforeMount, watch } from 'vue';
import { useRoute } from 'vue-router';
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

  if ((item.to || item.url) && ($config.staticMenuMobileActive || $config.overlayMenuActive)) {
    $config.onMenuToggle();
  }

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
  <li :class="{ 'layout-root-menuitem': root, 'active-menuitem': isActiveMenu }">
    <div v-if="root && item.visible !== false" class="layout-menuitem-root-text">
      {{ item.title }}
    </div>
    <a
      v-if="(!item.name || item.items) && item.visible !== false"
      :href="item.url"
      @click="!item.url && itemClick($event, item, index)"
      :class="item.class"
      :target="item.target"
      tabindex="0"
    >
      <AppIcons :name="item.icon" class="mr-2" :size="18" />
      <span class="layout-menuitem-text">{{ item.title }}</span>
      <i class="pi pi-angle-down layout-submenu-toggler" v-if="item.items"></i>
    </a>
    <RouterLink
      v-if="item.name && !item.items && item.visible !== false"
      @click="itemClick($event, item, index)"
      :class="[item.class, { 'active-route': checkActiveRoute(item) }]"
      tabindex="0"
      :to="{ name: item.name }"
    >
      <AppIcons :name="item.icon" class="mr-2" :size="18" />
      <span class="layout-menuitem-text">{{ item.title }}</span>
      <i class="pi pi-angle-down layout-submenu-toggler" v-if="item.items"></i>
    </RouterLink>
    <Transition v-if="item.items && item.visible !== false" name="layout-submenu">
      <ul v-show="root ? true : isActiveMenu" class="layout-submenu">
        <AppMenuItem
          v-for="(child, index) in item.items"
          :key="child"
          :index="index"
          :item="child"
          :parentItemKey="itemKey"
          :root="false"
        />
      </ul>
    </Transition>
  </li>
</template>
