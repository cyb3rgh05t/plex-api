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

# Create data directory
RUN mkdir -p src/data

# Create initial format-config.json
RUN echo '{"variables":["title","subtitle","progress","type"],"outputFormat":"{title} - {subtitle} ({progress}%)"}' > src/data/format-config.json

# Copy source files
COPY src ./src

# Build the application
RUN npm run build

# Production image alpine
FROM node:18-alpine AS runner

WORKDIR /app

# Create necessary directories
RUN mkdir -p src/data

# Copy built assets
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create volume directory and set permissions
VOLUME /app/src/data
RUN chown -R node:node /app

# Switch to non-root user
USER node

# Expose the port
EXPOSE 3008

# Start the application
CMD ["npm", "start"]
