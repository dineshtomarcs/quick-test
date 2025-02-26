FROM node:22.12.0-alpine AS builder

WORKDIR /app/builder

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install Python and other dependencies required by node-gyp
RUN apk add --update python3 py3-pip build-base g++ && rm -rf /var/cache/apk/*

# Install dependencies, including Nx
RUN npm ci

# Copy the rest of the application code
COPY apps/frontend/public ./public
COPY . .


# Install Nx globally
RUN npm install -g nx

# Build the application without using cache
RUN nx reset && nx build quick-test-frontend --skip-nx-cache

CMD ["nx", "run", "quick-test-frontend:dev"]
