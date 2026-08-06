# Stage 1: Build
FROM node:lts-alpine AS builder

WORKDIR /app
# Install build tools for native modules (SQLite) and latest pnpm
RUN apk add --no-cache python3 make g++ && npm install -g pnpm@latest

# Skip puppeteer chromium download in CI/Docker
ENV PUPPETEER_SKIP_DOWNLOAD=true

# Copy package management files
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source and build
COPY . .
RUN pnpm build

# Stage 2: Runner
FROM node:lts-alpine

WORKDIR /app

# Install latest pnpm as root, prep directory, install build tools for native compile
RUN apk add --no-cache python3 make g++ && \
    npm install -g pnpm@latest && \
    chown -R node:node /app
# Copy package files for prod install (chowned to node)
COPY --chown=node:node --from=builder /app/package.json /app/pnpm-workspace.yaml /app/pnpm-lock.yaml ./
COPY --chown=node:node --from=builder /app/apps/api/package.json apps/api/
COPY --chown=node:node --from=builder /app/apps/web/package.json apps/web/

# Skip puppeteer, run install AS NODE USER, then cleanup build tools AS ROOT
ENV PUPPETEER_SKIP_DOWNLOAD=true
RUN su node -c "pnpm install --prod --frozen-lockfile" && \
    apk del python3 make g++

# Switch to non-root user permanently for all remaining operations and runtime
USER node

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