<script setup>
import { mdiAt, mdiBookOpenOutline, mdiLan, mdiMonitorDashboard } from '@mdi/js';
import { computed, inject } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const $helpdesk = inject('helpdesk');

const navLinks = computed(() => {
  const routes = router.getRoutes();

  const buildLinks = names =>
    names
      .map(name => {
        if (!name) return null;
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

  const buildGroup = (label, icon, names) => {
    const items = buildLinks(names);
    if (!items.length) return null;
    return { label, icon, items };
  };

  const adminLinks = $helpdesk?.isAdmin
    ? buildLinks(['dashboard', 'log-audit', 'settings', 'users'])
    : [];

  const reportLinks = buildLinks(['reports']);

  return [
    ...buildLinks(['events']),

    'Системні додатки',

    buildGroup('Мережеві дані', mdiLan, [
      'channels',
      'ipaddresses',
      ($helpdesk?.isAdmin || $helpdesk?.isManager) && 'network-statistic'
    ]),

    buildGroup('Поштові скриньки', mdiAt, [
      'mailboxes',
      ($helpdesk?.isAdmin || $helpdesk?.isManager) && 'mailbox-statistic'
    ]),

    buildGroup('Сервісна підтримка', mdiBookOpenOutline, [
      'requests',
      ($helpdesk?.isAdmin || $helpdesk?.isManager) && 'request-statistic'
    ]),

    buildGroup('ПК SysInspector', mdiMonitorDashboard, [
      'inspectors',
      ($helpdesk?.isAdmin || $helpdesk?.isManager) && 'inspector-statistic'
    ]),

    ...(reportLinks.length && ($helpdesk?.isAdmin || $helpdesk?.isManager)
      ? ['Звіти та шаблони', ...reportLinks]
      : []),

    ...(adminLinks.length && $helpdesk?.isAdmin ? ['Адміністрування', ...adminLinks] : [])
  ].filter(Boolean);
});
</script>

<template>
  <PanelMenu
    class="w-full"
    :model="navLinks"
    multiple
    :pt="{
      panel: { class: 'bg-transparent! border-none!' },
      rootlist: { class: 'flex flex-col gap-y-2 my-4!' }
    }"
  >
    <template #item="{ item }">
      <p
        v-if="typeof item === 'string'"
        class="text-muted-color my-2 flex items-center font-bold uppercase"
      >
        {{ item }}
      </p>

      <router-link
        v-else-if="item.name"
        v-slot="{ href, navigate, isActive }"
        class=" "
        custom
        :to="{ name: item.name }"
      >
        <a
          v-ripple
          class="text-surface-700 dark:text-surface-0 flex cursor-pointer items-center px-4 py-2"
          :class="{ 'text-primary-500! font-bold!': isActive }"
          :href="href"
          @click="navigate"
        >
          <app-icon :path="item.icon" :size="18" />
          <span class="ml-2">{{ item.label }}</span>
        </a>
      </router-link>

      <a
        v-else
        v-ripple
        class="text-surface-700 dark:text-surface-0 flex cursor-pointer items-center px-4 py-2"
        :href="item.url"
        :target="item.target"
      >
        <app-icon :path="item.icon" :size="18" />
        <span class="ml-2">{{ item.label }}</span>
        <span v-if="item.items" class="pi pi-angle-down ml-auto" />
      </a>
    </template>
  </PanelMenu>
</template>

<style scoped>
:deep(
  div[data-pc-section='headercontent']:has(> p),
  div[data-pc-section='headercontent']:has(> p):hover
) {
  background: none !important;
}
</style>
