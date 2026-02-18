# Stage 1: Builder
FROM node:20-alpine AS builder

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN apk add --no-cache openssl

WORKDIR /app

# Copy root configuration files for workspace management
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy application package.json (and any other potential shared packages)
COPY apps/svs-events/package.json ./apps/svs-events/package.json

# Install dependencies (frozen lockfile for reproducibility)
RUN pnpm install --frozen-lockfile

# Copy the full source code
COPY . .

# Generate Prisma Client
# We run this before build because the application code depends on the generated client.
# The binary target will default to the builder's platform (linux-musl for alpine),
# which matches the runner's platform.
WORKDIR /app/apps/svs-events
RUN pnpm prisma generate

# Build the application using Nx/NestJS CLI
WORKDIR /app
RUN pnpm --filter svs-events build

# Stage 2: Runner
FROM node:20-alpine AS runner

# Install OpenSSL (Required for Prisma Client at runtime)
RUN apk add --no-cache openssl

WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy configuration files for production install
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/svs-events/package.json ./apps/svs-events/package.json

# Install only production dependencies for the specific app
RUN pnpm install --prod --frozen-lockfile --filter svs-events

# Copy the compiled application from the builder
COPY --from=builder /app/apps/svs-events/dist ./apps/svs-events/dist

# Copy the generated Prisma Client and binaries
# We specifically copy to dist/src/generated because the compiled code expects it there
COPY --from=builder /app/apps/svs-events/src/generated/prisma ./apps/svs-events/dist/src/generated/prisma

# Set working directory to the application folder
WORKDIR /app/apps/svs-events

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["node", "dist/src/main.js"]
