import { useApp } from '@/stores/app';

export default {
  install: async (app, { endpoints }) => {
    const { $error, $axios, $router, $toast, $t } = app.config.globalProperties;

    const store = useApp();

    app.config.globalProperties.$auth = {
      async me() {
        try {
          const user = await $axios({
            method: endpoints.user.method,
            url: endpoints.user.url
          });
          store.setUser(user);
        } catch (err) {
          $error(err);
        }
      },

      async signin({ login, password, remember = false }) {
        try {
          const { accessToken, refreshToken } = await $axios({
            method: endpoints.signin.method,
            url: endpoints.signin.url,
            data: { login, password }
          });

          store.setAccessToken(accessToken);
          store.setRefreshToken(refreshToken);

          await this.me();
          $router.push({ name: 'home' });
        } catch (err) {
          $error(err);
          throw err;
        }
      },

      async signup({ login, password, fullname, email, phone }) {
        try {
          await $axios({
            method: endpoints.signup.method,
            url: endpoints.signup.url,
            data: { login, password, fullname, email, phone }
          });
          $router.push({ name: 'home' });
        } catch (err) {
          $error(err);
          throw err;
        }
      },

      async signout() {
        await $axios({ method: endpoints.signout.method, url: endpoints.signout.url });
        store.resetAccessRefreshToken();
        $router.push({ name: 'signin' });
        $toast.add({
          severity: 'info',
          summary: $t('HD Information'),
          detail: $t('Logout successfully completed'),
          life: 3000
        });
      },

      async refresh() {
        try {
          const token = store.getRefreshToken();
          if (!token) {
            throw new Error('Unauthorized');
          }
          store.setAccessToken(token);
          const { accessToken, refreshToken } = await $axios({
            method: endpoints.refresh.method,
            url: endpoints.refresh.url
          });
          store.setAccessToken(accessToken);
          store.setRefreshToken(refreshToken);
          return accessToken;
        } catch (error) {
          store.resetAccessRefreshToken();
          $router.push({ name: 'signin' });
          throw error;
        }
      }
    };

    app.provide('auth', app.config.globalProperties.$auth);
  }
};
