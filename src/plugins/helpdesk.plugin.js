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

    app.provide('helpdesk', app.config.globalProperties.$helpdesk);
  }
};
