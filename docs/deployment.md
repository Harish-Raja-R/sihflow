# SihFlow ERP — Deployment & DevOps Guide

## 1. Overview

SihFlow ERP provides single-command containerized deployment using **Docker Compose** and multi-stage production Dockerfiles.

---

## 2. Docker Compose Deployment

### Prerequisites:
- Docker Desktop or Docker Engine 24+
- Docker Compose v2+

### Spin-Up Command:
```bash
docker-compose up -d --build
```

### Services Deployed:
- **`sihflow-postgres`**: PostgreSQL 16 Alpine on port `5432` with persistent volume `postgres_data`.
- **`sihflow-api`**: Node.js 20 Alpine Express API on port `5000`.
- **`sihflow-web`**: NGINX Alpine serving React 18 SPA on port `80` (with reverse proxy to API).

---

## 3. Local Development Setup

```bash
# 1. Install all dependencies across monorepo
npm install

# 2. Build shared packages
npm run build -w @sihflow/types
npm run build -w @sihflow/validation
npm run build -w @sihflow/config

# 3. Synchronize database schema & seed data
npx prisma db push
npx prisma db seed

# 4. Start backend API in watch mode
npm run dev -w @sihflow/api

# 5. Start frontend web client in watch mode
npm run dev -w @sihflow/web
```

---

## 4. Production Build Verification

```bash
# Verify zero errors across entire monorepo
npm run build
```
