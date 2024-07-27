# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

ARG NODE_VERSION=18.17.1

# Building layer
FROM node:${NODE_VERSION}-alpine AS development

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

# Install global dependecies
RUN npm i -g http-server

# Install runtime dependecies (without dev/test dependecies)
RUN npm i --omit=dev

# Copy production build
COPY --from=development /app/dist/ ./dist/

# Expose application port
EXPOSE 5173

# Start application
CMD [ "http-server", "dist -p 5173 -a 0.0.0.0 -g --cors --log-ip" ]