import { useApp } from '@/stores/app';

export default {
  install: async (app, options) => {
    const { $auth, $router, $toast, $t } = app.config.globalProperties;

    const store = useApp();

    app.config.globalProperties.$helpdesk = {
      ...options,

      get user() {
        return store?.user;
      },

      get usersCount() {
        return store?.users?.length;
      },

      get timeout() {
        return store?.timeout;
      },

      get loggedIn() {
        return store?.user != null;
      },

      get isAdmin() {
        return store?.user?.isAdmin;
      },

      get isActive() {
        return store?.user?.isActive;
      },

      hasScope(scope) {
        if (store?.user?.isAdmin) return true;
        if (options?.unless?.includes(scope)) return true;
        return store?.user?.scope?.includes(scope);
      }
    };

    $router.beforeEach(async (to, from, next) => {
      if (to?.meta?.auth && !store?.user) next({ name: 'signin' });
      else if (to?.meta?.admin && !store?.user?.isAdmin) next({ name: 'access-denied' });
      else next();
    });

    await $auth.user();

    app.provide('helpdesk', app.config.globalProperties.$helpdesk);
  }
};
