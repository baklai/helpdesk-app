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

### Compile and Minify for Production

```bash
# build for production
npm run build
```

```bash
# build docs for production
$ npm run docs:build
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

### Lint with [ESLint](https://eslint.org/)

```bash
npm run lint
```

### Format with [Prettier](https://prettier.io/)

```bash
npm run format
```

After starting the app on port (5173 as default) you can open
in your browser helpdesk by typing http://localhost:5173/.

## Docker Quick Start

```bash
# Create custom docker compose file compose.yaml
services:
  app:
    image: baklai/helpdesk-app:latest
    volumes:
      - ${STORAGE_PATH}:${STORAGE_PATH}
    env_file: .env
    environment:
      - NODE_ENV=production
    ports:
      - 3000:3000
    restart: unless-stopped
    container_name: helpdesk-app
```

```bash
# Start application
docker compose up -d
```

```bash
# Logs application
docker logs --tail 30 -f helpdesk-app
```

```bash
# Restart application
docker compose down && docker rmi baklai/helpdesk-app && docker compose up -d && docker logs -f helpdesk-app
```

In the terminal, run the following command to stop the application.

```bash
# Delete application
docker compose down
```

After starting the app on port (5173 as default) you can open
in your browser helpdesk by typing http://localhost:5173/.

## Build Docker images

```bash
# Build docker image
docker compose build

# Build docker multiplatform images and Pushes images to the repository
docker compose build --builder multibuilder --no-cache --push
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
