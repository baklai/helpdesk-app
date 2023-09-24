import { useApp } from '@/stores/app';

export default {
  install: async (app, { endpoints }) => {
    const { $error, $axios, $router, $toast, $t } = app.config.globalProperties;

    const store = useApp();

    app.config.globalProperties.$auth = {
      async me() {
        try {
          const user = await $axios({ method: endpoints.user.method, url: endpoints.user.url });
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

          //     if (remember) localStorage.setItem('access_token', token);

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
        store.resetAccessRefreshToken();
        $router.push({ name: 'signin' });
      }
    };

    app.provide('auth', app.config.globalProperties.$auth);
  }
};
