# Stage 1: Builder
FROM node:20-alpine AS builder

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy root configuration files for workspace management
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy application package.json
COPY apps/webapp-bff/package.json ./apps/webapp-bff/package.json

# Install dependencies (frozen lockfile for reproducibility)
RUN pnpm install --frozen-lockfile

# Copy the full source code
COPY . .

# Build the application
WORKDIR /app
RUN pnpm --filter webapp-bff build

# Stage 2: Runner
FROM node:20-alpine AS runner

WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy configuration files for production install
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/webapp-bff/package.json ./apps/webapp-bff/package.json

# Install only production dependencies for the specific app
RUN pnpm install --prod --frozen-lockfile --filter webapp-bff

# Copy the compiled application from the builder
COPY --from=builder /app/apps/webapp-bff/dist ./apps/webapp-bff/dist

# Set working directory to the application folder
WORKDIR /app/apps/webapp-bff

# Expose the application port
EXPOSE 4000

# Start the application
CMD ["node", "dist/index.js"]
