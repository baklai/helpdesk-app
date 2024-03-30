import { createApp, defineAsyncComponent } from 'vue';
import { createPinia } from 'pinia';
import { createI18n } from 'vue-i18n';

import App from './App.vue';
import router from './router';
import { version, author } from '@@/package.json';

import ErrorPlugin from '@/plugins/error.plugin';
import AuthPlugin from '@/plugins/auth.plugin';
import AxiosPlugin from '@/plugins/axios.plugin';
import HelpdeskPlugin from '@/plugins/helpdesk.plugin';

import AppIcons from '@/components/AppIcons.vue';

import PrimeVue from 'primevue/config';
import Avatar from 'primevue/avatar';
import BadgeDirective from 'primevue/badgedirective';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Checkbox from 'primevue/checkbox';
import TriStateCheckbox from 'primevue/tristatecheckbox';
import Chip from 'primevue/chip';
import Column from 'primevue/column';
import ConfirmationService from 'primevue/confirmationservice';
import DialogService from 'primevue/dialogservice';
import Divider from 'primevue/divider';
import InputText from 'primevue/inputtext';
import InputSwitch from 'primevue/inputswitch';
import InputMask from 'primevue/inputmask';
import Password from 'primevue/password';
import ProgressBar from 'primevue/progressbar';
import ProgressSpinner from 'primevue/progressspinner';
import SelectButton from 'primevue/selectbutton';
import ScrollTop from 'primevue/scrolltop';
import SplitButton from 'primevue/splitbutton';
import Textarea from 'primevue/textarea';
import ToastService from 'primevue/toastservice';
import Tag from 'primevue/tag';
import Tooltip from 'primevue/tooltip';

import '@/assets/base.css';

import '@/assets/styles.scss';

import Lara from '@/presets/lara';

import en from '@/locales/en-US';
import uk from '@/locales/uk-UA';
import ru from '@/locales/ru-RU';

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  globalInjection: true,
  messages: { en, uk, ru }
});

const app = createApp(App);

app.use(i18n);
app.use(router);
app.use(createPinia());

app.use(PrimeVue, {
  locale: en.primevue,
  unstyled: true,
  ripple: false,
  pt: Lara
});

app.use(ToastService);
app.use(DialogService);
app.use(ConfirmationService);

app.directive('tooltip', Tooltip);
app.directive('badge', BadgeDirective);

app.component('AppIcons', AppIcons);
app.component('Avatar', Avatar);
app.component('Button', Button);
app.component('Card', Card);
app.component('Checkbox', Checkbox);
app.component('TriStateCheckbox', TriStateCheckbox);
app.component('Chip', Chip);
app.component('Column', Column);
app.component('Divider', Divider);
app.component('InputMask', InputMask);
app.component('InputText', InputText);
app.component('InputSwitch', InputSwitch);
app.component('Password', Password);
app.component('ProgressBar', ProgressBar);
app.component('ProgressSpinner', ProgressSpinner);
app.component('SelectButton', SelectButton);
app.component('ScrollTop', ScrollTop);
app.component('SplitButton', SplitButton);
app.component('Tag', Tag);
app.component('Textarea', Textarea);

app.component(
  'Calendar',
  defineAsyncComponent(() => import('primevue/calendar'))
);

app.component(
  'Listbox',
  defineAsyncComponent(() => import('primevue/listbox'))
);

app.component(
  'Dropdown',
  defineAsyncComponent(() => import('primevue/dropdown'))
);

app.component(
  'MultiSelect',
  defineAsyncComponent(() => import('primevue/multiselect'))
);

app.component(
  'Menu',
  defineAsyncComponent(() => import('primevue/menu'))
);

app.component(
  'OverlayPanel',
  defineAsyncComponent(() => import('primevue/overlaypanel'))
);

app.component(
  'Sidebar',
  defineAsyncComponent(() => import('primevue/sidebar'))
);

app.component(
  'Toast',
  defineAsyncComponent(() => import('primevue/toast'))
);

app.component(
  'Dialog',
  defineAsyncComponent(() => import('primevue/dialog'))
);

app.component(
  'ConfirmDialog',
  defineAsyncComponent(() => import('primevue/confirmdialog'))
);

app.component(
  'Chart',
  defineAsyncComponent(() => import('primevue/chart'))
);

app.component(
  'DataView',
  defineAsyncComponent(() => import('primevue/dataview'))
);

app.component(
  'DataTable',
  defineAsyncComponent(() => import('primevue/datatable'))
);

app.use(ErrorPlugin, { life: 5000 });

app.use(AxiosPlugin, {
  baseURL: import.meta.env.VITE_API_BASE_URL,
  prefixAPI: '/api/v1',
  options: {
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' }
  },
  refresh: { url: '/auth/refresh', method: 'get' }
});

app.use(AuthPlugin, {
  endpoints: {
    user: { url: '/auth/me', method: 'get' },
    signin: { url: '/auth/signin', method: 'post' },
    signup: { url: '/auth/signup', method: 'post' },
    signout: { url: '/auth/signout', method: 'get' },
    refresh: { url: '/auth/refresh', method: 'get' }
  }
});

app.use(HelpdeskPlugin, {
  version: version,
  authorName: author.name,
  authorEmail: author.email,
  authorUrl: author.url,
  authorSocial: {
    facebook: author.social.facebook,
    github: author.social.github,
    linkedin: author.social.linkedin
  },
  ftpUrl: import.meta.env.VITE_FTP_BASE_URL || null,
  copyright: `Copyright © ${new Date().getFullYear()} ${author.name}. All rights reserved.`
});

app.config.errorHandler = function (err, vm, info) {
  console.error('errorHandler', err);
};

app.config.warnHandler = (msg, instance, trace) => {
  console.error('warnHandler', msg);
};

app.mount('#app');
