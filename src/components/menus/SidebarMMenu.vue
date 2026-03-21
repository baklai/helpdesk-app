<script setup>
import { computed, inject } from 'vue';
import { useRouter } from 'vue-router';

import { useConfigStore } from '@/stores/config.store';

const configStore = useConfigStore();
const router = useRouter();
const $helpdesk = inject('helpdesk');

const navLinks = computed(() => {
  const routes = router.getRoutes();

  return ['events', 'ipaddresses', 'mailboxes', 'requests', 'inspectors', 'reports']
    .map(name => {
      const route = routes.find(r => r.name === name);
      if (!route) return null;

      const permissions = route.meta?.permissions || [];

      if (!$helpdesk?.isAdmin && permissions.length > 0) {
        const hasAccess = permissions.every(p => $helpdesk?.scope(p));
        if (!hasAccess) return null;
      }

      return {
        icon: route.meta.icon,
        name: route.name,
        label: route.meta.title
      };
    })
    .filter(Boolean);
});
</script>

<template>
  <div class="flex items-center justify-center gap-y-2">
    <RouterLink
      v-for="(item, index) in navLinks"
      :key="`nav-link-m-item-${index}`"
      v-tooltip.right="item.label"
      v-slot="{ isActive }"
      :to="{ name: item.name }"
    >
      <Button
        class="w-full rounded-none!"
        :class="{ 'text-primary-500!': isActive }"
        severity="secondary"
        variant="text"
      >
        <AppIcon :path="item.icon" :size="28" />
      </Button>
    </RouterLink>

    <Button
      v-tooltip.right="'Перемкнути бічну панель'"
      icon="pi pi-arrow-right-arrow-left"
      iconClass="text-xl"
      rounded
      severity="secondary"
      variant="text"
      @click="configStore.appSideBarMini = !configStore.appSideBarMini"
    />
  </div>
</template>
