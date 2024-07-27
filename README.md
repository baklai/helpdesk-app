# HELPDESK APP V1

Web application of technical support

![GitHub package.json dependency version (subfolder of monorepo)](https://img.shields.io/github/package-json/dependency-version/baklai/helpdesk-app-v1/vue)
![GitHub package.json dependency version (subfolder of monorepo)](https://img.shields.io/github/package-json/dependency-version/baklai/helpdesk-app-v1/pinia)
![GitHub package.json dependency version (subfolder of monorepo)](https://img.shields.io/github/package-json/dependency-version/baklai/helpdesk-app-v1/vue-router)
![GitHub package.json dependency version (subfolder of monorepo)](https://img.shields.io/github/package-json/dependency-version/baklai/helpdesk-app-v1/vue-i18n)
![GitHub package.json dependency version (subfolder of monorepo)](https://img.shields.io/github/package-json/dependency-version/baklai/helpdesk-app-v1/primevue)
![GitHub package.json dependency version (subfolder of monorepo)](https://img.shields.io/github/package-json/dependency-version/baklai/helpdesk-app-v1/primeicons)
![GitHub package.json dependency version (subfolder of monorepo)](https://img.shields.io/github/package-json/dependency-version/baklai/helpdesk-app-v1/axios)
![GitHub package.json dependency version (subfolder of monorepo)](https://img.shields.io/github/package-json/dependency-version/baklai/helpdesk-app-v1/dayjs)
![GitHub package.json dependency version (subfolder of monorepo)](https://img.shields.io/github/package-json/dependency-version/baklai/helpdesk-app-v1/html2pdf.js)

## Demo application: [Helpdesk service](https://helpdesk-service.netlify.app)

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.
- Docker - [Download & Install Docker](https://docs.docker.com/engine/install/).

## Downloading

```bash
git clone
```

## Installing NPM modules

```bash
# install dependencies
$ npm install
```

## Project variables

| Key                 | Comment      |
| ------------------- | ------------ |
| `VITE_APP_BASE_URL` | APP Base url |
| `VITE_API_BASE_URL` | API Base url |

## Project Setup

### Compile and Hot-Reload for Development

```bash
# client with hot reload at localhost:5173
npm run dev
```

```bash
# docs with hot reload at localhost:5174
$ npm run docs:dev
```

### Lint with [ESLint](https://eslint.org/)

```bash
npm run lint
```

### Format with [Prettier](https://prettier.io/)

```bash
npm run format
```

### Compile and Minify for Production

```bash
# build for production
npm run build
```

```bash
# build docs for production
$ npm run docs:build
```

### Build Docker images

```bash
# Build docker image
docker compose build

# Build docker multiplatform images and Pushes images to the repository
docker compose build --builder multibuilder --push
```

If your cloud uses a different CPU architecture than your development
machine (e.g., you are on a Mac M1 and your cloud provider is amd64),
you'll want to build the image for that platform, e.g.:

```bash
# Make sure you have buildx installed. If it is not installed, install it as follows
docker buildx install

# Build and switch to buildx builder
docker buildx create --platform linux/amd64,linux/i386,linux/arm/v5,linux/arm/v6,linux/arm/v7,linux/arm64,linux/ppc64le,linux/s390x --name multibuilder --use

# Start the builder instance
docker buildx inspect --bootstrap
```

```bash
# Use Docker registry
docker login
```

## Running application

```bash
# run preview production
$ npm run preview
```

```bash
# run docs preview production
$ npm run docs:preview
```

### PM2 Quick Start

```bash
# Start application
pm2 start ecosystem.json

# Stop application
pm2 stop ecosystem.json

# Restart application
pm2 restart ecosystem.json

# Reload application
pm2 reload ecosystem.json

# Delete application
pm2 delete ecosystem.json

# Logs application
pm2 logs helpdesk-app
```

### Docker Quick Start

```bash
# Create custom docker compose file compose.yaml
services:
  app:
    image: baklai/helpdesk-app-v1:latest
    ports:
      - 80:80
    volumes:
      - ./env.config.js:/usr/share/nginx/html/env.config.js
    restart: unless-stopped
    container_name: helpdesk-app
```

```js
// Create custom config file env.config.js
window.env = {
  APP_BASE_URL: 'http://localhost',
  API_BASE_URL: 'http://localhost:8080'
};
```

```bash
# Start application
docker compose up -d
```

```bash
# Logs application
docker logs -f helpdesk-app
```

```bash
# Restart application
docker compose down && docker rmi baklai/helpdesk-app-v1 && docker compose up -d && docker logs -f helpdesk-app
```

In the terminal, run the following command to stop the application.

```bash
# Delete application
docker compose down
```

## Default email to the application

The service administrator is created during the first registration on the service

After starting the app on port (5173 as default) you can open
in your browser helpdesk by typing http://localhost:5173/.
