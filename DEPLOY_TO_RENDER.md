# 🚀 Deploying SihFlow ERP to Render (1-Click Blueprint)

This repository includes a [`render.yaml`](./render.yaml) blueprint that automatically provisions:
1. **`sihflow-db`**: Free Managed PostgreSQL Database
2. **`sihflow-api`**: Node.js Web Service (Backend REST API)
3. **`sihflow-web`**: Static Site (Vite React Frontend SPA with HTTPS and rewrites)

---

## 📋 Step-by-Step Deployment Guide

### Step 1: Push This Code to GitHub
If you haven't already initialized your Git repo or pushed to GitHub:

```bash
git init
git add .
git commit -m "feat: SihFlow ERP complete 15-module production release"
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPO_NAME>.git
git push -u origin main
```

---

### Step 2: Deploy on Render via Blueprint (1-Click)

1. Log in to your **[Render Dashboard](https://dashboard.render.com)**.
2. Click **New +** in the top navigation bar.
3. Select **Blueprint** (Infrastructure as Code).
4. Connect your GitHub repository.
5. Render will automatically detect [`render.yaml`](./render.yaml) and list:
   - ✅ `sihflow-db` (PostgreSQL)
   - ✅ `sihflow-api` (Web Service)
   - ✅ `sihflow-web` (Static Site)
6. Click **Apply**.

---

### Step 3: Access Your Live Application

Render will build and deploy the services in ~2 minutes:
- **Frontend Web App**: `https://sihflow-web.onrender.com`
- **Backend API**: `https://sihflow-api.onrender.com/api/v1`
- **Health Check**: `https://sihflow-api.onrender.com/api/v1/health`

---

## 👥 Default Team Login Credentials

| Role | Email | Password |
|---|---|---|
| **Member 1 (Team Lead)** | `lead@sihflow.io` | `Demo@123` |
| **Member 2 (Blockchain / GitHub)** | `github@sihflow.io` | `Demo@123` |
| **Member 3 (Security / Auth)** | `security@sihflow.io` | `Demo@123` |
| **Member 4 (Backend / DB)** | `backend@sihflow.io` | `Demo@123` |
| **Member 5 (Frontend)** | `frontend@sihflow.io` | `Demo@123` |
| **Member 6 (QA / Testing / Docs)** | `qa@sihflow.io` | `Demo@123` |
