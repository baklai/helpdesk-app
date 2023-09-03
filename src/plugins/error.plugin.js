const DEFAULT_LIFE = 3000;

export default {
  install: async (app, { life }) => {
    const { $toast, $t } = app.config.globalProperties;

    app.config.globalProperties.$error = (error) => {
      let message = $t('Unspecified error');
      if (typeof error === 'string') {
        message = $t(error);
      } else if (typeof error?.message === 'string') {
        message = $t(error.message);
      } else if (error?.message?.isArray) {
        message = error.message.map((msg) => $t(msg)).split('\n');
      }
      $toast.add({ severity: 'error', summary: $t('HD Error'), detail: message, life: life || DEFAULT_LIFE });
    };

    app.provide('error', app.config.globalProperties.$error);
  }
};
