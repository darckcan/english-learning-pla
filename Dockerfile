# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Copy workspace packages
COPY packages ./packages

# Install ALL dependencies (including devDependencies for build)
RUN npm ci

# Copy all source files
COPY index.html ./
COPY tsconfig.json ./
COPY vite.config.ts ./
COPY tailwind.config.js ./
COPY theme.json ./
COPY components.json ./
COPY runtime.config.json ./
COPY src ./src

# Build the application
RUN npm run build

# Verify build output
RUN ls -la /app/dist

# Production stage
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built static files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Create a simple health check endpoint
RUN echo '<!DOCTYPE html><html><body>OK</body></html>' > /usr/share/nginx/html/health

# Expose port 80 (EasyPanel default)
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
