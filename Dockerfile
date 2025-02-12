# Dockerfile
FROM node:18-alpine

LABEL maintainer=cyb3rgh05t
LABEL org.opencontainers.image.source=https://github.com/cyb3rgh05t/plex-api

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# The build step happens at runtime to allow for environment variables
RUN npm run build

EXPOSE 3005

# Copy and make the server script executable
COPY server.js .
CMD ["npm", "start"]