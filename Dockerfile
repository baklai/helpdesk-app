# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

ARG NODE_VERSION=18.17.1

# Building layer
FROM node:${NODE_VERSION}-alpine AS development

WORKDIR /app

# Copy configuration files
COPY index.html ./
COPY tailwind.config.js ./
COPY package*.json ./

# Install dependecies from package.json
RUN npm install

# Copy application sources (.ts, .tsx, js)
COPY src/ src/

# Build application (produces dist/ folder)
RUN npm run build

# Runtime (production) layer
FROM node:${NODE_VERSION}-alpine AS production

WORKDIR /app

# Copy dependecies files
COPY package*.json ./

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