# HELPDESK APP

Helpdesk — сервіс підтримки, що надає оперативну допомогу користувачам у вирішенні ІТ-інцидентів та запитів, забезпечуючи швидке відновлення роботи систем і сервісів

## Передумови

- Docker - [Завантажте та встановіть Docker](https://docs.docker.com/engine/install/).

## Змінні проекту `.env`

| Key                  | Comment                                |
| -------------------- | -------------------------------------- |
| `VITE_APP_BASE_URL`  | Базова URL-адреса додатку              |
| `VITE_API_BASE_URL`  | Базова URL-адреса API додатку          |
| `VITE_DOCS_BASE_URL` | Базова URL-адреса документації додатку |

### Перевікра з [ESLint](https://eslint.org/)

```bash
npm run lint
```

### Формат з [Prettier](https://prettier.io/)

```bash
npm run format
```

## Конфігураційний файл для Docker Compose `compose.yaml`

```bash
services:
  helpdesk-app:
    image: baklai/helpdesk-app:latest
    container_name: helpdesk-app
    environment:
      - NODE_ENV=production
    ports:
      - '80:80'
    restart: unless-stopped
```

### Запустіть додаток

```bash
docker compose up -d
```

### Логи додатку

```bash
docker logs --tail 50 -f helpdesk-app
```

### Перезапустити додаток

```bash
docker compose down && docker rmi baklai/helpdesk-app && docker compose up -d && docker logs -f helpdesk-app
```

### Видалити додаток

```bash
docker compose down
```

Після запуску програми на порту (5173 за замовчуванням) ви можете відкрити
у службу підтримки, ввівши http://localhost:5173/.

## Створюйте образи Docker

### Використовуйте реєстр Docker

```bash
docker login
```

### Створення образу Docker

```bash
docker compose build
```

### Створюйте мультиплатформенні образи докерів і надсилайте зображення до репозиторію

```bash
docker compose build --builder multibuilder --no-cache --push
```

Якщо ваша середовище використовує іншу архітектуру ЦП, ніж ваша розробка
(наприклад, ви використовуєте Mac M1, а ваш хмарний постачальник amd64),
ви захочете створити образ для цієї платформи, наприклад:

```bash
# Переконайтеся, що у вас встановлено buildx. Якщо він не встановлений, встановіть його наступним чином
docker buildx install

# Збірка та перехід на buildx builder
docker buildx create --platform linux/amd64,linux/i386,linux/arm/v5,linux/arm/v6,linux/arm/v7,linux/arm64,linux/ppc64le,linux/s390x --name multibuilder --use

# Запустіть екземпляр конструктора
docker buildx inspect --bootstrap
```
