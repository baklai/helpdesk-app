# HELPDESK APP V1

Web application of technical support

## Demo application: [Helpdesk service](https://helpdesk-service.netlify.app)

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

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

| Key               | Comment            |
| ----------------- | ------------------ |
| `VITE_SERVER_API` | APP Connection url |

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

## Default login to the application

The service administrator is created during the first registration on the service

After starting the app on port (5173 as default) you can open
in your browser helpdesk by typing http://localhost:5173/.
