import { createRouter, createWebHashHistory } from 'vue-router';
import { inject } from 'vue';

import PrivateLayout from '@/layout/PrivateLayout.vue';
import PublicLayout from '@/layout/PublicLayout.vue';

import { useApp } from '@/stores/app';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      meta: {
        title: 'Helpdesk service',
        description: 'Helpdesk of the technical support'
      },
      component: () => import('@/views/Index.vue'),
      beforeEnter: (to, from) => {
        const store = useApp();
        if (!store.loggedIn) {
          return { path: '/auth/signin' };
        } else {
          return true;
        }
      }
    },

    {
      path: '/app',
      meta: { auth: true },
      redirect: { name: 'home' },
      children: [
        {
          name: 'calendar-events',
          path: 'calendar-events',
          meta: {
            title: 'Calendar of events',
            description: 'Сalendar of events of the technical support'
          },
          component: () => import('@/views/app/CalendarEvents.vue')
        },
        {
          path: 'network-info',
          name: 'network-info',
          meta: {
            title: 'Network information',
            description: 'Network information of the technical support'
          },
          redirect: { name: 'network-statistics' },
          children: [
            {
              path: 'channels',
              name: 'network-channels',
              meta: {
                title: 'Network channels',
                description: 'Network channels of the technical support'
              },
              component: () => import('@/views/app/network-info/Channels.vue')
            },
            {
              path: 'ipaddress',
              name: 'network-ipaddress',
              meta: {
                title: 'Network IP Address',
                description: 'Network IP Address of the technical support'
              },
              component: () => import('@/views/app/network-info/IPAddress.vue')
            },
            {
              path: 'mailbox',
              name: 'network-mailbox',
              meta: {
                title: 'Mailbox addresses',
                description: 'Mailbox of the technical support'
              },
              component: () => import('@/views/app/network-info/Mailbox.vue')
            },
            {
              path: 'network-map',
              name: 'network-map',
              meta: {
                title: 'Network map',
                description: 'Network map of the technical support'
              },
              component: () => import('@/views/app/network-info/NetworkMap.vue')
            },
            {
              path: 'statistics',
              name: 'network-statistics',
              meta: {
                title: 'Service statistics',
                description: 'Statistics of network information'
              },
              component: () => import('@/views/app/network-info/NetworkStatistics.vue')
            }
          ]
        },
        {
          path: 'technical-support',
          name: 'technical-support',
          meta: {
            title: 'Technical support',
            description: 'Technical support log of the clients'
          },
          redirect: { name: 'technical-support-statistics' },
          children: [
            {
              path: 'requests',
              name: 'technical-support-requests',
              meta: {
                title: 'Technical support',
                description: 'Technical support log of the clients'
              },
              component: () => import('@/views/app/technical-support/TechnicalSupport.vue')
            },
            {
              path: 'statistics',
              name: 'technical-support-statistics',
              meta: {
                title: 'Service statistics',
                description: 'Statistics of technical support'
              },
              component: () =>
                import('@/views/app/technical-support/TechnicalSupportStatistics.vue')
            }
          ]
        },
        {
          path: 'pc-sys-inspector',
          name: 'pc-sys-inspector',
          meta: {
            title: 'PC SysInspector',
            description: 'PC SysInspector service of the technical support'
          },
          redirect: { name: 'pc-sys-inspector-statistics' },
          children: [
            {
              path: 'reports',
              name: 'pc-sys-inspector-reports',
              meta: {
                title: 'PC SysInspector',
                description: 'PC SysInspector service of the technical support'
              },
              component: () => import('@/views/app/pc-sys-inspector/PCSysInspector.vue')
            },
            {
              path: 'statistics',
              name: 'pc-sys-inspector-statistics',
              meta: {
                title: 'Service statistics',
                description: 'Statistics of PC SysInspector'
              },
              component: () => import('@/views/app/pc-sys-inspector/PCSysInspectorStatistics.vue')
            }
          ]
        },
        {
          path: 'onmap-scanner',
          name: 'onmap-scanner',
          meta: {
            title: 'ONMAP Scanner',
            description: 'Online network mapper scanner of the technical support'
          },
          redirect: { name: 'onmap-scanner-statistics' },
          children: [
            {
              path: 'reports',
              name: 'onmap-scanner-reports',
              meta: {
                title: 'ONMAP Scanner',
                description: 'Online network mapper scanner of the technical support'
              },
              component: () => import('@/views/app/onmap-scanner/ONMAPScanner.vue')
            },
            {
              path: 'statistics',
              name: 'onmap-scanner-statistics',
              meta: {
                title: 'Service statistics',
                description: 'Statistics of online network mapper service'
              },
              component: () => import('@/views/app/onmap-scanner/ONMAPStatistics.vue')
            }
          ]
        },
        {
          path: 'ping-icmp',
          name: 'ping-icmp',
          meta: {
            title: 'ICMP Ping',
            description: 'ICMP Ping service of the technical support'
          },
          component: () => import('@/views/app/PingICMP.vue')
        },
        {
          path: 'ftp-client',
          name: 'ftp-client',
          meta: {
            title: 'FTP Client',
            description: 'FTP Client of the technical support'
          },
          component: () => import('@/views/app/FTPClient.vue')
        },
        {
          path: 'reports',
          name: 'reports',
          meta: {
            title: 'Reports of service',
            description: 'Reports of the technical support'
          },
          component: () => import('@/views/app/Reports.vue')
        }
      ]
    },

    {
      path: '/core',
      meta: { auth: true, admin: true },
      redirect: { name: 'home' },
      children: [
        {
          path: 'dashboard',
          name: 'core-dashboard',
          meta: {
            title: 'Dashboard',
            description: 'Dashboard of the helpdesk service'
          },
          component: () => import('@/views/core/Dashboard.vue')
        },
        {
          path: 'log-audit',
          name: 'core-log-audit',
          meta: {
            title: 'Activity audit',
            description: 'Audit log of the helpdesk service'
          },
          component: () => import('@/views/core/LogAudit.vue')
        },
        {
          path: 'users',
          name: 'core-users',
          meta: {
            title: 'User accounts',
            description: 'User accounts of the helpdesk service'
          },
          component: () => import('@/views/core/Users.vue')
        }
      ]
    },

    {
      path: '/auth',
      redirect: { name: 'signin' },
      children: [
        {
          path: 'signin',
          name: 'signin',
          component: () => import('@/views/auth/Signin.vue')
        },
        {
          path: 'signup',
          name: 'signup',
          component: () => import('@/views/auth/Signup.vue')
        }
      ]
    },

    {
      path: '/access-denied',
      name: 'access-denied',
      component: () => import('@/views/error/AccessDenied.vue')
    },

    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/error/NotFound.vue')
    }
  ]
});

router.beforeEach((to, from) => {
  const title = to?.meta?.title;
  if (title) {
    document.title = `HD • ${title}`;
  } else {
    document.title = `HD • Helpdesk service`;
  }

  const description = to.meta.description;
  if (description) {
    const metaDescriptionTag = document.querySelector('meta[name="description"]');
    if (metaDescriptionTag) {
      metaDescriptionTag.setAttribute('content', description);
    }
  }

  return;
});

router.beforeEach(async (to, from) => {
  const store = useApp();
  const $auth = inject('auth');

  if (!store.loggedIn && store.getRefreshToken()) {
    await $auth.me();
  }

  if (store.loggedIn && to.name !== 'signin' && to.name !== 'signup') {
    to.meta.layout = PrivateLayout;
  } else {
    to.meta.layout = PublicLayout;
  }

  if (to.name !== 'signin' && to.name !== 'signup' && to?.meta?.auth && !store.loggedIn) {
    return { name: 'signin' };
  } else if (to?.meta?.admin && !store?.user?.isAdmin) {
    return { name: 'access-denied' };
  } else {
    return;
  }
});

export default router;
