import { computed } from 'vue';
import { defineStore } from 'pinia';
import { useRouter } from 'vue-router';

export const useSidebar = defineStore('sidebar', () => {
  const Router = useRouter();

  const navLinks = computed(() => [
    'Документація',

    {
      label: 'Документація',
      url: '/docs/',
      icon: 'docs',
      target: '_blank',
      description: 'Документація технічної підтримки'
    },

    'Системні додатки',

    { ...getRoute('events-calendar') },
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

    { ...getRoute('ping-icmp') },

    'Категорії та шаблони',

    { ...getRoute('reports') },

    'Панель інструментів',

    { ...getRoute('core-dashboard') },
    { ...getRoute('core-log-audit') },
    { ...getRoute('core-profiles') }
  ]);

  const miniNavLinks = computed(() => [
    { ...getRoute('events-calendar') },
    { ...getRoute('network-ipaddress') },
    { ...getRoute('network-mailbox') },
    { ...getRoute('technical-support-requests') },
    { ...getRouteLabel('pc-sys-inspector-reports') }
  ]);

  function getRoute(name) {
    const routes = Router.getRoutes();
    const route = routes.find(item => item.name === name);
    return {
      name: route.name,
      label: route.meta.title,
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
      label: route.meta.title,
      icon: route.name
    };
  }

  return { navLinks, miniNavLinks, getRoute };
});
