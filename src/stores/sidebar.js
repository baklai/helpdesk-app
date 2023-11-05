import { computed } from 'vue';
import { defineStore } from 'pinia';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

export const useSidebar = defineStore('sidebar', () => {
  const Router = useRouter();
  const { t } = useI18n();

  const links = computed(() => [
    {
      items: [getRoute('home')]
    },
    {
      title: t('Documentation'),
      items: [
        {
          title: t('Docs of helpdesk'),
          url: '/docs',
          icon: 'docs',
          target: '_blank',
          description: t('Docs of the technical support')
        }
      ]
    },
    {
      title: t('Applications'),
      items: [
        getRoute('calendar-events'),
        {
          ...getRoute('network-info'),
          items: [
            getRoute('network-map'),
            getRoute('network-channels'),
            getRoute('network-ip-address'),
            getRoute('network-mailbox'),
            getRoute('network-statistics')
          ]
        },
        {
          ...getRoute('helpdesk-live-log'),
          items: [getRoute('helpdesk-live-log-requests'), getRoute('helpdesk-live-log-statistics')]
        },
        {
          ...getRoute('pc-sys-inspector'),
          items: [getRoute('pc-sys-inspector-reports'), getRoute('pc-sys-inspector-statistics')]
        },
        {
          ...getRoute('onmap-scanner'),
          items: [getRoute('onmap-scanner-reports'), getRoute('onmap-scanner-statistics')]
        },
        getRoute('ping-icmp')
      ]
    },
    {
      title: t('HD Reports'),
      separator: false,
      items: [getRoute('reports')]
    },
    {
      title: t('Administration'),
      separator: false,
      items: [
        getRoute('core-dashboard'),
        getRoute('core-log-audit'),
        getRoute('core-options'),
        getRoute('core-users')
      ]
    }
  ]);

  function getRoute(name) {
    const routes = Router.getRoutes();
    const route = routes.find(item => item.name === name);
    return { title: t(route.meta.title), name: route.name, icon: route.name };
  }

  return { links, getRoute };
});
