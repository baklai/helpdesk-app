# HELPDESK APP

Веб-додаток технічної підтримки

![GitHub package.json dependency version (subfolder of monorepo)](https://img.shields.io/github/package-json/dependency-version/baklai/helpdesk-app/vue)
![GitHub package.json dependency version (subfolder of monorepo)](https://img.shields.io/github/package-json/dependency-version/baklai/helpdesk-app/pinia)
![GitHub package.json dependency version (subfolder of monorepo)](https://img.shields.io/github/package-json/dependency-version/baklai/helpdesk-app/vue-router)
![GitHub package.json dependency version (subfolder of monorepo)](https://img.shields.io/github/package-json/dependency-version/baklai/helpdesk-app/primevue)
![GitHub package.json dependency version (subfolder of monorepo)](https://img.shields.io/github/package-json/dependency-version/baklai/helpdesk-app/primeicons)
![GitHub package.json dependency version (subfolder of monorepo)](https://img.shields.io/github/package-json/dependency-version/baklai/helpdesk-app/axios)
![GitHub package.json dependency version (subfolder of monorepo)](https://img.shields.io/github/package-json/dependency-version/baklai/helpdesk-app/html2pdf.js)

## Передумови

- Git - [Завантажте та встановіть Git](https://git-scm.com/downloads).
- Node.js - [Завантажте та встановіть Node.js](https://nodejs.org/en/download/) і менеджер пакетів npm.

## Завантаження

```bash
git clone
```

## Встановлення NPM модулів

```bash
$ npm install
```

## Змінні проекту

| Ключ                 | Коментар                       |
| -------------------- | ------------------------------ |
| `VITE_APP_BASE_URL`  | Базова URL-адреса додатку      |
| `VITE_API_BASE_URL`  | Базова URL-адреса API додатку  |
| `VITE_DOCS_BASE_URL` | Базова URL-адреса документації |

### Компіляція та гаряче перезавантаження для розробки

```bash
npm run dev
```

### Компіляція та мінімізація для виробництва

```bash
npm run build
```

## Запустити додаток

```bash
$ npm run preview
```

### Перевікра з [ESLint](https://eslint.org/)

```bash
npm run lint
```

### Формат з [Prettier](https://prettier.io/)

```bash
npm run format
```

Після запуску програми на порту (5173 за замовчуванням) ви можете відкрити
у службу підтримки браузера, ввівши http://localhost:5173/.
