# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

ARG NODE_VERSION=18.17.1

# Building layer
FROM node:${NODE_VERSION}-alpine AS build

WORKDIR /app

# Copy configuration files
COPY index.html ./
COPY package*.json ./
COPY postcss.config.js ./
COPY pwa-assets.config.js ./
COPY tailwind.config.js ./
COPY vite.config.js ./


# Install dependecies from package.json
RUN npm install

# Copy application sources (.ts, .tsx, js)
COPY src/ src/

# Copy public sources (.ts, .tsx, js)
COPY public/ public/

# Copy docs sources (.ts, .tsx, js, md)
COPY docs/ /docs

# Build application (produces dist/ folder)
RUN npm run build

# Runtime (production) layer
FROM node:${NODE_VERSION}-alpine AS production

WORKDIR /app

# Copy dependecies files
COPY package*.json ./
COPY postcss.config.js ./
COPY pwa-assets.config.js ./
COPY tailwind.config.js ./
COPY vite.config.js ./

# Install runtime dependecies (without dev/test dependecies)
RUN npm i --omit=dev

# Copy production build
COPY --from=build /app/dist/ ./dist/

# Используем nginx для сервировки собранных файлов
FROM nginx:stable-alpine AS application

# Копируем собранные файлы в nginx
COPY --from=production /app/dist /usr/share/nginx/html

# Копируем nginx конфигурацию
COPY nginx.conf /etc/nginx/nginx.conf

# Открываем порт
EXPOSE 80

# Запускаем nginx
CMD ["nginx", "-g", "daemon off;"]