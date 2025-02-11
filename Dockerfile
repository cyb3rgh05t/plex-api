# Dockerfile
FROM node:18-alpine AS builder

LABEL maintainer=cyb3rgh05t
LABEL org.opencontainers.image.source=https://github.com/cyb3rgh05t/plex-api

WORKDIR /app

# Copy package files
COPY package.json ./
COPY next.config.js postcss.config.js tailwind.config.js tsconfig.json ./

# Install dependencies
RUN npm install

# Copy source files
COPY src ./src

# Build the application
RUN npm run build

# Production image
FROM node:18-alpine AS runner

WORKDIR /app

# Copy built assets
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/src/data ./src/data

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create data directory and set permissions
RUN mkdir -p /app/src/data && chown -R node:node /app

# Switch to non-root user
USER node

# Expose the port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]