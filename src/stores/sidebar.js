import { computed } from 'vue';
import { defineStore } from 'pinia';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

export const useSidebar = defineStore('sidebar', () => {
  const Router = useRouter();
  const { t } = useI18n();

  const navLinks = computed(() => [
    { ...getRoute('home') },

    t('Documentation'),

    {
      label: t('Docs of helpdesk'),
      url: '/docs/',
      icon: 'docs',
      target: '_blank',
      description: t('Docs of the technical support')
    },

    t('Applications'),

    { ...getRoute('calendar-events') },
    {
      ...getRouteLabel('network-info'),
      items: [
        getRoute('network-map'),
        getRoute('network-channels'),
        getRoute('network-ipaddress'),
        getRoute('network-mailbox'),
        getRoute('network-statistics')
      ]
    },
    {
      ...getRouteLabel('technical-support'),
      items: [getRoute('technical-support-requests'), getRoute('technical-support-statistics')]
    },
    {
      ...getRouteLabel('pc-sys-inspector'),
      items: [getRoute('pc-sys-inspector-reports'), getRoute('pc-sys-inspector-statistics')]
    },
    {
      ...getRouteLabel('onmap-scanner'),
      items: [getRoute('onmap-scanner-reports'), getRoute('onmap-scanner-statistics')]
    },

    { ...getRoute('ping-icmp') },

    t('HD Reports'),

    { ...getRoute('reports') },

    t('Administration'),

    { ...getRoute('core-dashboard') },
    { ...getRoute('core-log-audit') },
    { ...getRoute('core-users') }
  ]);

  const miniNavLinks = computed(() => [
    { ...getRoute('calendar-events') },
    { ...getRoute('network-ipaddress') },
    { ...getRoute('network-mailbox') },
    { ...getRoute('technical-support-requests') },
    { ...getRouteLabel('pc-sys-inspector-reports') },
    { ...getRouteLabel('onmap-scanner-reports') }
  ]);

  function getRoute(name) {
    const routes = Router.getRoutes();
    const route = routes.find(item => item.name === name);
    return {
      name: route.name,
      label: t(route.meta.title),
      icon: route.name,
      command: () => {
        Router.push({ name: route.name });
      }
    };
  }

  function getRouteLabel(name) {
    const routes = Router.getRoutes();
    const route = routes.find(item => item.name === name);
    return {
      name: route.name,
      label: t(route.meta.title),
      icon: route.name
    };
  }

  return { navLinks, miniNavLinks, getRoute };
});
