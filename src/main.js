import { createPinia } from 'pinia';
import { createApp, defineAsyncComponent } from 'vue';

import { author, version } from '@@/package.json';
import App from './App.vue';
import router from './router';

import AuthPlugin from '@/plugins/auth.plugin';
import AxiosPlugin from '@/plugins/axios.plugin';
import ErrorPlugin from '@/plugins/error.plugin';
import HelpdeskPlugin from '@/plugins/helpdesk.plugin';

import AppIcons from '@/components/AppIcons.vue';

import Avatar from 'primevue/avatar';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Checkbox from 'primevue/checkbox';
import Chip from 'primevue/chip';
import Column from 'primevue/column';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import DialogService from 'primevue/dialogservice';
import Divider from 'primevue/divider';
import InputMask from 'primevue/inputmask';
import InputSwitch from 'primevue/inputswitch';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import ProgressBar from 'primevue/progressbar';
import ProgressSpinner from 'primevue/progressspinner';
import ScrollTop from 'primevue/scrolltop';
import SelectButton from 'primevue/selectbutton';
import SplitButton from 'primevue/splitbutton';
import Tag from 'primevue/tag';
import Textarea from 'primevue/textarea';
import ToastService from 'primevue/toastservice';
import Tooltip from 'primevue/tooltip';
import TriStateCheckbox from 'primevue/tristatecheckbox';

import '@/assets/base.css';
import '@/assets/fonts.css';
import 'primeicons/primeicons.css';

import Presets from '@/presets';

const app = createApp(App);

app.use(router);
app.use(createPinia());

app.use(PrimeVue, {
  locale: {
    startsWith: 'Починається з',
    contains: 'Містить',
    notContains: 'Не містить',
    endsWith: 'Закінчується на',
    equals: 'Рівно',
    notEquals: 'Не рівно',
    noFilter: 'Без фільтра',
    lt: 'Менше ніж',
    lte: 'Менше або дорівнює',
    gt: 'Більше ніж',
    gte: 'Більше або дорівнює',
    dateIs: 'Дата є',
    dateIsNot: 'Дата не є',
    dateBefore: 'Дата до',
    dateAfter: 'Дата після',
    clear: 'Очистити',
    apply: 'Застосувати',
    matchAll: 'Співпадає з усіма',
    matchAny: 'Співпадає з будь-яким',
    addRule: 'Додати правило',
    removeRule: 'Видалити правило',
    accept: 'Так',
    reject: 'Ні',
    choose: 'Вибрати',
    upload: 'Завантажити',
    cancel: 'Скасувати',
    completed: 'Завершено',
    pending: 'В очікуванні',
    fileSizeTypes: ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    dayNames: ['Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П’ятниця', 'Субота'],
    dayNamesShort: ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    dayNamesMin: ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    monthNames: [
      'Січень',
      'Лютий',
      'Березень',
      'Квітень',
      'Травень',
      'Червень',
      'Липень',
      'Серпень',
      'Вересень',
      'Жовтень',
      'Листопад',
      'Грудень'
    ],
    monthNamesShort: [
      'Січ',
      'Лют',
      'Бер',
      'Квіт',
      'Трав',
      'Чер',
      'Лип',
      'Сер',
      'Вер',
      'Жов',
      'Лис',
      'Груд'
    ],
    chooseYear: 'Вибрати рік',
    chooseMonth: 'Вибрати місяць',
    chooseDate: 'Вибрати дату',
    prevDecade: 'Попереднє десятиліття',
    nextDecade: 'Наступне десятиліття',
    prevYear: 'Попередній рік',
    nextYear: 'Наступний рік',
    prevMonth: 'Попередній місяць',
    nextMonth: 'Наступний місяць',
    prevHour: 'Попередня година',
    nextHour: 'Наступна година',
    prevMinute: 'Попередня хвилина',
    nextMinute: 'Наступна хвилина',
    prevSecond: 'Попередня секунда',
    nextSecond: 'Наступна секунда',
    am: 'дп',
    pm: 'пп',
    today: 'Сьогодні',
    weekHeader: 'Тиждень',
    firstDayOfWeek: 0,
    showMonthAfterYear: false,
    dateFormat: 'dd/mm/yy',
    weak: 'Слабкий',
    medium: 'Середній',
    strong: 'Сильний',
    passwordPrompt: 'Введіть пароль',
    searchMessage: 'Доступно {0} результатів',
    selectionMessage: 'Вибрано {0} елементів',
    emptySelectionMessage: 'Немає вибраних елементів',
    emptySearchMessage: 'Не знайдено результатів',
    fileChosenMessage: '{0} файлів',
    noFileChosenMessage: 'Файл не вибрано',
    emptyMessage: 'Немає доступних опцій',
    aria: {
      trueLabel: 'Так',
      falseLabel: 'Ні',
      nullLabel: 'Не вибрано',
      star: '1 зірка',
      stars: '{star} зірки',
      selectAll: 'Вибрано всі елементи',
      unselectAll: 'Вибрано всі елементи',
      close: 'Закрити',
      previous: 'Попередній',
      next: 'Наступний',
      navigation: 'Навігація',
      scrollTop: 'Прокрутка вгору',
      moveTop: 'Перемістити вгору',
      moveUp: 'Перемістити вгору',
      moveDown: 'Перемістити вниз',
      moveBottom: 'Перемістити вниз',
      moveToTarget: 'Перемістити до цілі',
      moveToSource: 'Перемістити до джерела',
      moveAllToTarget: 'Перемістити все до цілі',
      moveAllToSource: 'Перемістити все до джерела',
      pageLabel: 'Сторінка {page}',
      firstPageLabel: 'Перша сторінка',
      lastPageLabel: 'Остання сторінка',
      nextPageLabel: 'Наступна сторінка',
      prevPageLabel: 'Попередня сторінка',
      rowsPerPageLabel: 'Рядків на сторінку',
      jumpToPageDropdownLabel: 'Перейти до сторінки',
      jumpToPageInputLabel: 'Перейти до сторінки',
      selectRow: 'Рядок вибрано',
      unselectRow: 'Рядок не вибрано',
      expandRow: 'Рядок розгорнуто',
      collapseRow: 'Рядок згруповано',
      showFilterMenu: 'Показати меню фільтрації',
      hideFilterMenu: 'Сховати меню фільтрації',
      filterOperator: 'Оператор фільтра',
      filterConstraint: 'Умова фільтра',
      editRow: 'Редагувати рядок',
      saveEdit: 'Зберегти редагування',
      cancelEdit: 'Скасувати редагування',
      listView: 'Список',
      gridView: 'Сітка',
      slide: 'Слайд',
      slideNumber: '{slideNumber}',
      zoomImage: 'Збільшити зображення',
      zoomIn: 'Збільшити',
      zoomOut: 'Зменшити',
      rotateRight: 'Повернути вправо',
      rotateLeft: 'Повернути вліво'
    }
  },
  unstyled: true,
  ripple: false,
  pt: Presets
});

app.use(ToastService);
app.use(DialogService);
app.use(ConfirmationService);

app.directive('tooltip', Tooltip);

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

app.use(ErrorPlugin, { life: 5000 });

app.use(AxiosPlugin, {
  baseURL:
    import.meta.env.VITE_API_BASE_URL || `${window.location.protocol}//${window.location.host}`,
  prefixAPI: '/api',
  options: {
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' }
  },
  refresh: { url: '/auth/refresh', method: 'get' }
});

app.use(AuthPlugin, {
  endpoints: {
    profile: { url: '/auth/me', method: 'get' },
    signin: { url: '/auth/signin', method: 'post' },
    signup: { url: '/auth/signup', method: 'post' },
    signout: { url: '/auth/signout', method: 'get' },
    reset: { url: '/auth/reset', method: 'post' },
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
  copyright: `Copyright © 2022-${new Date().getFullYear()} ${author.name}. Всі права захищені.`
});

app.config.errorHandler = function (err, vm, info) {
  console.error('errorHandler', err);
};

app.config.warnHandler = (msg, instance, trace) => {
  console.error('warnHandler', msg);
};

app.mount('#app');
