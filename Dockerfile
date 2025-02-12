# Build stage
FROM node:18-alpine as build

LABEL maintainer=cyb3rgh05t
LABEL org.opencontainers.image.source=https://github.com/cyb3rgh05t/plex-api

WORKDIR /app

# Define build arguments
ARG REACT_APP_PLEX_SERVER_URL
ARG REACT_APP_PLEX_TOKEN

# Set as environment variables for the build
ENV REACT_APP_PLEX_SERVER_URL=$REACT_APP_PLEX_SERVER_URL
ENV REACT_APP_PLEX_TOKEN=$REACT_APP_PLEX_TOKEN

# Copy package files
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the app with environment variables
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy built app and server files
COPY --from=build /app/build ./build
COPY --from=build /app/src/server ./src/server

EXPOSE 3005
CMD ["node", "src/server/server.js"]