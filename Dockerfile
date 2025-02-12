# Dockerfile
FROM node:18-alpine

LABEL maintainer=cyb3rgh05t
LABEL org.opencontainers.image.source=https://github.com/cyb3rgh05t/plex-api

# Add tini for proper process management
RUN apk add --no-cache tini wget

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
RUN npm install

# Copy rest of the files
COPY . .

# Build with environment variable support
RUN npm run build

EXPOSE 3005

# Use tini as entrypoint
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["npm", "run", "preview"]