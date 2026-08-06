# Stage 1: Build
FROM node:22-slim AS builder

WORKDIR /app
# Install latest pnpm (no C++ build tools needed on Debian slim due to prebuilt binaries)
RUN npm install -g pnpm@latest
# Set CI mode and skip puppeteer chromium download
ENV CI=true
ENV PUPPETEER_SKIP_DOWNLOAD=true

# Copy package management files
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
COPY packages/shared/package.json packages/shared/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source and build
COPY . .
RUN pnpm build

# Stage 2: Runner
FROM node:22-slim

WORKDIR /app

# Install latest pnpm and prep directory
RUN npm install -g pnpm@latest && \
    chown -R node:node /app

# Copy package files for prod install (chowned to node)
COPY --chown=node:node --from=builder /app/package.json /app/pnpm-workspace.yaml /app/pnpm-lock.yaml ./
COPY --chown=node:node --from=builder /app/apps/api/package.json apps/api/
COPY --chown=node:node --from=builder /app/apps/web/package.json apps/web/
COPY --chown=node:node --from=builder /app/packages/shared/package.json packages/shared/

# Skip puppeteer, run install AS NODE USER, then nuke pnpm cache
ENV PUPPETEER_SKIP_DOWNLOAD=true
RUN su node -c "pnpm install --prod --frozen-lockfile && rm -rf ~/.local/share/pnpm/store /home/node/.local/share/pnpm/store"

# Switch to non-root user permanently for all remaining operations and runtime
USER node

# Copy built artifacts and start script
COPY --chown=node:node --from=builder /app/tools tools/
COPY --chown=node:node --from=builder /app/apps/api/dist apps/api/dist/
COPY --chown=node:node --from=builder /app/apps/api/drizzle apps/api/drizzle/
COPY --chown=node:node --from=builder /app/apps/web/dist apps/web/dist/

# Copy shared source explicitly avoiding node_modules from builder
COPY --chown=node:node --from=builder /app/packages/shared/src packages/shared/src/
COPY --chown=node:node --from=builder /app/packages/shared/tsconfig.json packages/shared/

# Create data directory for SQLite
RUN mkdir -p apps/api/data

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "tools/start-prod.mjs"]
