import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';
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
        title: 'Техпідтримка',
        description: 'Веб-додаток технічної підтримки'
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
          name: 'events-calendar',
          path: 'events-calendar',
          meta: {
            title: 'Календар подій',
            description: 'Календар подій технічної підтримки'
          },
          component: () => import('@/views/app/EventsCalendar.vue')
        },
        {
          path: 'network-info',
          name: 'network-info',
          meta: {
            title: 'Мережева інформація',
            description: 'Мережева інформація технічної підтримки'
          },
          redirect: { name: 'network-statistics' },
          children: [
            {
              path: 'channels',
              name: 'network-channels',
              meta: {
                title: 'Мережеві канали',
                description: 'Мережеві канали технічної підтримки'
              },
              component: () => import('@/views/app/network-info/Channels.vue')
            },
            {
              path: 'ipaddress',
              name: 'network-ipaddress',
              meta: {
                title: 'IP-адреси мережі',
                description: 'Мережеві IP-адреси технічної підтримки'
              },
              component: () => import('@/views/app/network-info/IPAddress.vue')
            },
            {
              path: 'mailbox',
              name: 'network-mailbox',
              meta: {
                title: 'Поштові скриньки',
                description: 'Електронні скриньки технічної підтримки'
              },
              component: () => import('@/views/app/network-info/Mailbox.vue')
            },
            {
              path: 'network-map',
              name: 'network-map',
              meta: {
                title: 'Мережеві мапи',
                description: 'Мапи мережі технічної підтримки'
              },
              component: () => import('@/views/app/network-info/NetworkMap.vue')
            },
            {
              path: 'statistics',
              name: 'network-statistics',
              meta: {
                title: 'Статистика сервісу',
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
            title: 'Технічна підтримка',
            description: 'Журнал технічної підтримки клієнтів'
          },
          redirect: { name: 'technical-support-statistics' },
          children: [
            {
              path: 'requests',
              name: 'technical-support-requests',
              meta: {
                title: 'Технічна підтримка',
                description: 'Журнал технічної підтримки клієнтів'
              },
              component: () => import('@/views/app/technical-support/TechnicalSupport.vue')
            },
            {
              path: 'statistics',
              name: 'technical-support-statistics',
              meta: {
                title: 'Статистика сервісу',
                description: 'Статистика технічної підтримки'
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
            title: 'ПК SysInspector',
            description: 'ПК SysInspector сервіс технічної підтримки'
          },
          redirect: { name: 'pc-sys-inspector-statistics' },
          children: [
            {
              path: 'reports',
              name: 'pc-sys-inspector-reports',
              meta: {
                title: 'ПК SysInspector',
                description: 'ПК SysInspector сервіс технічної підтримки'
              },
              component: () => import('@/views/app/pc-sys-inspector/PCSysInspector.vue')
            },
            {
              path: 'statistics',
              name: 'pc-sys-inspector-statistics',
              meta: {
                title: 'Статистика сервісу',
                description: 'Статистика сервісу ПК SysInspector технічної підтримки'
              },
              component: () => import('@/views/app/pc-sys-inspector/PCSysInspectorStatistics.vue')
            }
          ]
        },
        {
          path: 'ping-icmp',
          name: 'ping-icmp',
          meta: {
            title: 'ICMP Пінг',
            description: 'ICMP Пінг-сервіс технічної підтримки'
          },
          component: () => import('@/views/app/PingICMP.vue')
        },
        {
          path: 'storage',
          name: 'storage',
          meta: {
            title: 'Файлове сховище',
            description: 'Файлове сховища технічної підтримки'
          },
          component: () => import('@/views/app/Storage.vue')
        },
        {
          path: 'reports',
          name: 'reports',
          meta: {
            title: 'Звіти техпідтримки',
            description: 'Звіти технічної підтримки'
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
            title: 'Панель інструментів',
            description: 'Інформаційна панель технічної підтримки'
          },
          component: () => import('@/views/core/Dashboard.vue')
        },
        {
          path: 'log-audit',
          name: 'core-log-audit',
          meta: {
            title: 'Аудит активності',
            description: 'Журнал аудиту технічної підтримки'
          },
          component: () => import('@/views/core/LogAudit.vue')
        },
        {
          path: 'profiles',
          name: 'core-profiles',
          meta: {
            title: 'Користувачі',
            description: 'Профільні акаунти технічної підтримки'
          },
          component: () => import('@/views/core/Profiles.vue')
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
        },
        {
          path: 'resetpassword',
          name: 'resetpassword',
          component: () => import('@/views/auth/ResetPass.vue')
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
    document.title = `HD • Служба технічної підтримки`;
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
  } else if (to?.meta?.admin && !store.isAdmin) {
    return { name: 'access-denied' };
  } else {
    return;
  }
});

export default router;
