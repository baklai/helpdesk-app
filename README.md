# HELPDESK APP

Веб-додаток технічної підтримки

![GitHub package.json dependency version (subfolder of monorepo)](https://img.shields.io/github/package-json/dependency-version/baklai/helpdesk-app-v1/vue)
![GitHub package.json dependency version (subfolder of monorepo)](https://img.shields.io/github/package-json/dependency-version/baklai/helpdesk-app-v1/pinia)
![GitHub package.json dependency version (subfolder of monorepo)](https://img.shields.io/github/package-json/dependency-version/baklai/helpdesk-app-v1/vue-router)
![GitHub package.json dependency version (subfolder of monorepo)](https://img.shields.io/github/package-json/dependency-version/baklai/helpdesk-app-v1/primevue)
![GitHub package.json dependency version (subfolder of monorepo)](https://img.shields.io/github/package-json/dependency-version/baklai/helpdesk-app-v1/primeicons)
![GitHub package.json dependency version (subfolder of monorepo)](https://img.shields.io/github/package-json/dependency-version/baklai/helpdesk-app-v1/axios)
![GitHub package.json dependency version (subfolder of monorepo)](https://img.shields.io/github/package-json/dependency-version/baklai/helpdesk-app-v1/html2pdf.js)

## Передумови

- Git - [Завантажте та встановіть Git](https://git-scm.com/downloads).
- Node.js - [Завантажте та встановіть Node.js](https://nodejs.org/en/download/) і менеджер пакетів npm.
- Docker - [Завантажте та встановіть Docker](https://docs.docker.com/engine/install/).

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

## Швидкий старт з Docker

```bash
# Створіть спеціальний файл компонування докера compose.yaml
services:
  app:
    image: baklai/helpdesk-app:latest
    env_file: .env
    environment:
      - NODE_ENV=production
    ports:
      - 5173:5173
    restart: unless-stopped
    container_name: helpdesk-app
```

```bash
# Запустіть додаток
docker compose up -d
```

```bash
# Журнали програми
docker logs --tail 30 -f helpdesk-app
```

```bash
# Перезапустіть програму
docker compose down && docker rmi baklai/helpdesk-app && docker compose up -d && docker logs -f helpdesk-app
```

```bash
# Видалити програму
docker compose down
```

Після запуску програми на порту (5173 за замовчуванням) ви можете відкрити
у службу підтримки браузера, ввівши http://localhost:5173/.

## Створення зображень Docker

```bash
# Створення образу докера
docker compose build

# Створюйте мультиплатформенні образи докерів і надсилайте зображення до репозиторію
docker compose build --builder multibuilder --no-cache --push
```

Якщо у вас використовується інша архітектура процесора, ніж на вашій машині для розробки
(наприклад, ви працюєте на Mac M1, а ваш хмарний провайдер використовує amd64), вам потрібно буде
зібрати образ для цієї платформи, наприклад:

```bash
# Переконайтеся, що у вас встановлено buildx. Якщо він не встановлений, встановіть його наступним чином
docker buildx install

# Збірка та перехід на buildx builder
docker buildx create --platform linux/amd64,linux/i386,linux/arm/v5,linux/arm/v6,linux/arm/v7,linux/arm64,linux/ppc64le,linux/s390x --name multibuilder --use

# Запустіть екземпляр конструктора
docker buildx inspect --bootstrap
```

```bash
# Використовуйте реєстр Docker
docker login
```
