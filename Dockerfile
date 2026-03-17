# ============================================================
# 7X National Logistics Platform — Production Dockerfile
# Multi-stage build for Azure K8s deployment
# ============================================================

# ── Base ──
FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# ── Dependencies (all, for build) ──
FROM base AS deps
COPY package.json package-lock.json ./
COPY prisma ./prisma/
RUN npm ci
RUN npx prisma generate

# ── Builder ──
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npx next build

# ── Production dependencies only ──
FROM base AS proddeps
COPY package.json package-lock.json ./
COPY prisma ./prisma/
RUN npm ci --omit=dev
RUN npx prisma generate

# ── Runner ──
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public assets
COPY --from=builder /app/public ./public

# Copy standalone output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy Prisma client + schema (needed for runtime DB access)
COPY --from=builder /app/prisma ./prisma
COPY --from=proddeps /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=proddeps /app/node_modules/@prisma ./node_modules/@prisma

# Copy Prisma CLI (needed for migrate deploy at startup)
COPY --from=proddeps /app/node_modules/prisma ./node_modules/prisma

# Copy startup script
COPY --from=builder /app/start.sh ./start.sh

USER nextjs

EXPOSE 3000

CMD ["sh", "start.sh"]
