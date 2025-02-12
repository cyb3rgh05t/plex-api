# Build stage
FROM node:18-alpine as build

LABEL maintainer=cyb3rgh05t
LABEL org.opencontainers.image.source=https://github.com/cyb3rgh05t/plex-api

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY --from=build /app/build ./build
COPY --from=build /app/src/server ./src/server

EXPOSE 3005
CMD ["node", "src/server/server.js"]