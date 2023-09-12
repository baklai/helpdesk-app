import { createRouter, createWebHashHistory } from 'vue-router';

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
      //    redirect: '/',
      meta: { auth: true },
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
          //   redirect: '/app/network-info/statistics',
          meta: {
            title: 'Network information',
            description: 'Network information of the technical support'
          },
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
              path: 'ip-address',
              name: 'network-ip-address',
              meta: {
                title: 'Network IP Address',
                description: 'Network IP Address of the technical support'
              },
              component: () => import('@/views/app/network-info/IPAddress.vue')
            },
            {
              path: 'statistics',
              name: 'network-statistics',
              meta: {
                title: 'Service statistics',
                description: 'Statistics of network information'
              },
              component: () => import('@/views/app/network-info/NetworkInfo.vue')
            }
          ]
        },
        {
          path: 'helpdesk-live-log',
          name: 'helpdesk-live-log',
          //  redirect: '/app/helpdesk-live-log/statistics',
          meta: {
            title: 'Help Desk Live Log',
            description: 'HD Live Log of the technical support'
          },
          children: [
            {
              path: 'requests',
              name: 'helpdesk-live-log-requests',
              meta: {
                title: 'Help Desk Live Log',
                description: 'HD Live Log of the technical support'
              },
              component: () => import('@/views/app/hd-live-log/HDLiveLogRequests.vue')
            },
            {
              path: 'statistics',
              name: 'helpdesk-live-log-statistics',
              meta: {
                title: 'Service statistics',
                description: 'Statistics of Helpdesk Live Log'
              },
              component: () => import('@/views/app/hd-live-log/HDLiveLog.vue')
            }
          ]
        },
        {
          path: 'pc-sys-inspector',
          name: 'pc-sys-inspector',
          //   redirect: '/app/pc-sys-inspector/statistics',
          meta: {
            title: 'PC SysInspector',
            description: 'PC SysInspector service of the technical support'
          },
          children: [
            {
              path: 'reports',
              name: 'pc-sys-inspector-reports',
              meta: {
                title: 'PC SysInspector',
                description: 'PC SysInspector service of the technical support'
              },
              component: () => import('@/views/app/pc-sys-inspector/PCSysInspectorReports.vue')
            },
            {
              path: 'statistics',
              name: 'pc-sys-inspector-statistics',
              meta: {
                title: 'Service statistics',
                description: 'Statistics of PC SysInspector'
              },
              component: () => import('@/views/app/pc-sys-inspector/PCSysInspector.vue')
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
      redirect: '/',
      meta: { auth: true, admin: true },
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
          path: 'options',
          name: 'core-options',
          meta: {
            title: 'Configuration',
            description: 'Configuration of the helpdesk service'
          },
          component: () => import('@/views/core/Options.vue')
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
      redirect: '/auth/signin',
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

router.beforeEach(async (to, from) => {
  const store = useApp();

  if (store.loggedIn) {
    to.meta.layout = PrivateLayout;
  } else {
    to.meta.layout = PublicLayout;
  }

  return;

  // if (to.name !== 'signin' && !store.loggedIn) next({ name: 'signin' });
  // else next();

  //   // if ((to.name !== 'signin' || to.name !== 'signup') && to?.meta?.auth && !store?.user) {
  //   //   next({ name: 'signin' });
  //   // } else if (to?.meta?.admin && !store?.user?.isAdmin) {
  //   //   next({ name: 'access-denied' });
  //   // } else {
  //   //   next();
  //   // }
});

export default router;

// router.beforeEach(async (to, from, next) => {
//   // next({ name: 'signin' });

//   to.meta.layout = await import(`'@/layout/PrivateLayout.vue`);

//   next();

//   // if (!store?.user && store.getAccessToken()) {
//   //   await $auth.me();
//   // }

//   // if ((to.name !== 'signin' || to.name !== 'signup') && to?.meta?.auth && !store?.user) {
//   //   next({ name: 'signin' });
//   // } else if (to?.meta?.admin && !store?.user?.isAdmin) {
//   //   next({ name: 'access-denied' });
//   // } else {
//   //   next();
//   // }
// });
