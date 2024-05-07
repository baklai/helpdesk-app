import { useApp } from '@/stores/app';

export default {
  install: async (app, options) => {
    const { $toast, $t } = app.config.globalProperties;

    const store = useApp();

    app.config.globalProperties.$helpdesk = {
      ...options,

      get user() {
        return store?.user;
      },

      get loggedIn() {
        return store?.loggedIn;
      },

      get isAdmin() {
        return store?.isActive;
      },

      get isActive() {
        return store?.isActive;
      },

      hasScope(scope) {
        if (store?.isAdmin) return true;
        if (options?.unless?.includes(scope)) return true;
        return store?.user?.scope?.includes(scope);
      },

      notImplemented() {
        $toast.add({
          severity: 'info',
          summary: $t('Information'),
          detail: $t('This functionality has not yet been implemented'),
          life: 5000
        });
      }
    };

    app.provide('helpdesk', app.config.globalProperties.$helpdesk);
  }
};
