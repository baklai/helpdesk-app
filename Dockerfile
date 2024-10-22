# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

ARG NODE_VERSION=20

# Building layer API
FROM node:${NODE_VERSION}-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Build the application (produces dist/folder)
RUN npm run build

# Set the working directory for the final image
FROM node:${NODE_VERSION}-alpine AS production

WORKDIR /app

# Copy configuration files and dependencies
COPY --from=build /app/package*.json ./
COPY --from=build /app/dist ./dist/

# We install only production dependencies
RUN npm install --omit=dev