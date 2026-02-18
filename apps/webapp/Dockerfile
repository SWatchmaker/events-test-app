# Stage 1: Builder
FROM node:20-alpine AS builder

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy root configuration files for workspace management
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy application package.json
COPY apps/webapp/package.json ./apps/webapp/package.json

# Install dependencies (frozen lockfile for reproducibility)
RUN pnpm install --frozen-lockfile

# Copy the full source code
COPY . .

# Build the application
# "events-webapp" is the name of the package in apps/webapp/package.json
WORKDIR /app
RUN pnpm --filter events-webapp build

# Stage 2: Runner
FROM nginx:alpine

# Copy custom Nginx configuration to handle SPA routing
COPY apps/webapp/nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built static files from the builder stage to the Nginx html directory
COPY --from=builder /app/apps/webapp/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
