# Stage 1: Build
FROM node:lts-alpine AS builder

WORKDIR /app

# Install latest pnpm
RUN npm install -g pnpm@latest

# Copy package management files
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Stage 2: Runner
FROM node:lts-alpine

WORKDIR /app

# Install latest pnpm as root, then hand over ownership
RUN npm install -g pnpm@latest && chown -R node:node /app

# Switch to non-root user for all remaining operations and runtime
USER node

# Copy package files for prod install
COPY --chown=node:node --from=builder /app/package.json /app/pnpm-workspace.yaml /app/pnpm-lock.yaml ./
COPY --chown=node:node --from=builder /app/apps/api/package.json apps/api/
COPY --chown=node:node --from=builder /app/apps/web/package.json apps/web/

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile

# Copy built artifacts and start script
COPY --chown=node:node --from=builder /app/tools tools/
COPY --chown=node:node --from=builder /app/apps/api/dist apps/api/dist/
COPY --chown=node:node --from=builder /app/apps/web/dist apps/web/dist/

# Create data directory for SQLite
RUN mkdir -p apps/api/data

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "tools/start-prod.mjs"]