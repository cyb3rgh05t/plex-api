# Build stage
FROM node:23-alpine as build

LABEL maintainer=cyb3rgh05t
LABEL org.opencontainers.image.source=https://github.com/cyb3rgh05t/plex-api

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM node:23-alpine

WORKDIR /app

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm install --omit=dev
RUN npm install node-fetch

# Copy built app and server files
COPY --from=build /app/build ./build
COPY --from=build /app/src/server ./src/server

# Create config directory
RUN mkdir -p /app/config

EXPOSE 3005

CMD ["node", "src/server/server.js"]