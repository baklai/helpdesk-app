import { createRouter, createWebHashHistory } from 'vue-router';

import AppLayout from '@/layout/AppLayout.vue';
import PublicLayout from '@/layout/PublicLayout.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: AppLayout,
      meta: { auth: true },
      children: [
        {
          name: 'home',
          path: '/',
          component: () => import('@/views/Index.vue'),
          meta: {
            title: 'Helpdesk service',
            description: 'Helpdesk of the technical support'
          }
        },

        {
          name: 'app',
          path: '/app',
          children: [
            {
              name: 'calendar-events',
              path: '/app/calendar-events',
              component: () => import('@/views/app/CalendarEvents.vue'),
              meta: {
                title: 'Calendar of events',
                description: 'Сalendar of events of the technical support'
              }
            },
            {
              name: 'network-info',
              path: '/app/network-info',
              meta: {
                title: 'Network information',
                description: 'Network information of the technical support'
              },
              children: [
                {
                  name: 'network-channels',
                  path: '/app/network-info/channels',
                  component: () => import('@/views/app/network-info/Channels.vue'),
                  meta: {
                    title: 'Network channels',
                    description: 'Network channels of the technical support'
                  }
                },
                {
                  name: 'network-ip-address',
                  path: '/app/network-info/ip-address',
                  component: () => import('@/views/app/network-info/IPAddress.vue'),
                  meta: {
                    title: 'Network IP Address',
                    description: 'Network IP Address of the technical support'
                  }
                },
                {
                  name: 'network-statistics',
                  path: '/app/network-info/statistics',
                  component: () => import('@/views/app/network-info/NetworkInfo.vue'),
                  meta: {
                    title: 'Service statistics',
                    description: 'Statistics of network information'
                  }
                }
              ]
            },
            {
              name: 'helpdesk-live-log',
              path: '/app/helpdesk-live-log',
              meta: {
                title: 'Help Desk Live Log',
                description: 'HD Live Log of the technical support'
              },
              children: [
                {
                  name: 'helpdesk-live-log-requests',
                  path: '/app/helpdesk-live-log/requests',
                  component: () => import('@/views/app/hd-live-log/HDLiveLogRequests.vue'),
                  meta: {
                    title: 'Help Desk Live Log',
                    description: 'HD Live Log of the technical support'
                  }
                },
                {
                  name: 'helpdesk-live-log-statistics',
                  path: '/app/helpdesk-live-log/statistics',
                  component: () => import('@/views/app/hd-live-log/HDLiveLog.vue'),
                  meta: {
                    title: 'Service statistics',
                    description: 'Statistics of Helpdesk Live Log'
                  }
                }
              ]
            },
            {
              name: 'pc-sys-inspector',
              path: '/app/pc-sys-inspector',
              meta: {
                title: 'PC SysInspector',
                description: 'PC SysInspector service of the technical support'
              },
              children: [
                {
                  name: 'pc-sys-inspector-reports',
                  path: '/app/pc-sys-inspector/reports',
                  component: () => import('@/views/app/pc-sys-inspector/PCSysInspectorReports.vue'),
                  meta: {
                    title: 'PC SysInspector',
                    description: 'PC SysInspector service of the technical support'
                  }
                },
                {
                  name: 'pc-sys-inspector-statistics',
                  path: '/app/pc-sys-inspector/statistics',
                  component: () => import('@/views/app/pc-sys-inspector/PCSysInspector.vue'),
                  meta: {
                    title: 'Service statistics',
                    description: 'Statistics of PC SysInspector'
                  }
                }
              ]
            },
            {
              name: 'ping-icmp',
              path: '/app/ping-icmp',
              component: () => import('@/views/app/PingICMP.vue'),
              meta: {
                title: 'ICMP Ping',
                description: 'ICMP Ping service of the technical support'
              }
            },
            {
              name: 'reports',
              path: '/app/reports',
              component: () => import('@/views/app/Reports.vue'),
              meta: {
                title: 'Reports of service',
                description: 'Reports of the technical support'
              }
            }
          ]
        },

        {
          name: 'core',
          path: '/core',
          meta: { admin: true },
          children: [
            {
              name: 'core-dashboard',
              path: '/core/dashboard',
              component: () => import('@/views/core/Dashboard.vue'),
              meta: {
                title: 'Dashboard',
                description: 'Dashboard of the helpdesk service'
              }
            },
            {
              name: 'core-log-audit',
              path: '/core/log-audit',
              component: () => import('@/views/core/LogAudit.vue'),
              meta: {
                title: 'Activity audit',
                description: 'Audit log of the helpdesk service'
              }
            },
            {
              name: 'core-options',
              path: '/core/options',
              component: () => import('@/views/core/Options.vue'),
              meta: {
                title: 'Configuration',
                description: 'Configuration of the helpdesk service'
              }
            },
            {
              name: 'core-users',
              path: '/core/users',
              component: () => import('@/views/core/Users.vue'),
              meta: {
                title: 'User accounts',
                description: 'User accounts of the helpdesk service'
              }
            }
          ]
        }
      ]
    },

    {
      path: '/auth',
      redirect: '/auth/signin',
      component: PublicLayout,
      children: [
        {
          name: 'signin',
          path: '/auth/signin',
          component: () => import('@/views/auth/Signin.vue')
        },
        {
          name: 'signup',
          path: '/auth/signup',
          component: () => import('@/views/auth/Signup.vue')
        }
      ]
    },

    {
      path: '/',
      component: PublicLayout,
      children: [
        {
          name: 'not-found',
          path: '/error/not-found',
          component: () => import('@/views/error/NotFound.vue')
        },
        {
          name: 'access-denied',
          path: '/error/access-denied',
          component: () => import('@/views/error/AccessDenied.vue')
        },
        {
          name: 'error-occured',
          path: '/error/error-occured',
          component: () => import('@/views/error/ErrorOccured.vue')
        }
      ]
    },

    {
      name: 'not-router',
      path: '/:pathMatch(.*)*',
      component: PublicLayout,
      children: [
        {
          name: 'not-router',
          path: '/:pathMatch(.*)*',
          component: () => import('@/views/error/NotFound.vue')
        }
      ]
    }
  ]
});

export default router;
