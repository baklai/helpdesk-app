import { capitalizeFirstLetter } from '@/service/DataFilters';

const DEFAULT_LIFE = 5000;

export default {
  install: async (app, { life }) => {
    const { $toast, $t } = app.config.globalProperties;

    app.config.globalProperties.$error = error => {
      let message = $t('Helpdesk system error');
      if (typeof error === 'string') {
        message = $t(capitalizeFirstLetter(error));
      } else if (typeof error?.message === 'string') {
        message = $t(capitalizeFirstLetter(error.message));
      } else if (Array.isArray(error?.message)) {
        message = error.message.map(msg => $t(capitalizeFirstLetter(msg))).join('\n');
      }
      $toast.add({
        severity: 'error',
        summary: $t('HD Error'),
        detail: message,
        life: life || DEFAULT_LIFE
      });
    };

    app.provide('error', app.config.globalProperties.$error);
  }
};
