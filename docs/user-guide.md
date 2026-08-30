# SihFlow ERP — User & Operational Guide

## 1. Getting Started

### 1.1 Fast Launch (Local Development)
```bash
# 1. Install dependencies across root workspaces
npm install --legacy-peer-deps

# 2. Seed PostgreSQL database with AcadShield dataset
npm run seed -w backend

# 3. Start Backend & Frontend Dev Servers
npm run dev
```
- **Backend API**: `http://localhost:5000`
- **Frontend Mission Control**: `http://localhost:5173`

---

## 2. Team Member Logins & Fast Switcher
All default accounts use password: `Demo@123`.

| Member Name | Hackathon Role | Email | Key Focus Area |
| :--- | :--- | :--- | :--- |
| **Harish R** | Team Lead & Lead Architect | `lead@sihflow.io` | Mission control, sprint priorities, GitHub, live demo |
| **Vikas Sharma** | Blockchain Engineer | `blockchain@sihflow.io` | Hyperledger Fabric, chaincode, ledger query adapter |
| **Ananya Roy** | Identity & Security Engineer | `security@sihflow.io` | DID resolution, SHA-256 hashes, anti-tamper, fraud engine |
| **Rohan Patel** | Backend Engineer | `backend@sihflow.io` | Express REST routes, Prisma schemas, IPFS/storage |
| **Sneha Kulkarni** | Frontend Engineer | `frontend@sihflow.io` | React 18, Student Wallet UI, QR Code scanner, verification |
| **Kavya Nair** | QA + UI/UX + Documentation | `qa@sihflow.io` | Automated test suites, SRS, jury pitch deck, demo script |

> **Pro Tip**: Use the top-right role switcher in the navigation bar to instantly switch perspectives and test ERP permissions across all 6 members with one click.

---

## 3. Key Feature Walkthrough

### 3.1 Mission Control Dashboard (`/`)
Provides real-time visibility into overall project health, active sprint progress, open blockers, and SIH readiness scores.

### 3.2 Team Lead Center (`/lead-center`)
Answers the question **"What should I do now?"** by automatically highlighting critical path blockers, overdue tasks, code review requests, and upcoming milestones.

### 3.3 Interactive Kanban Board (`/board`)
Drag-and-drop tasks across workflow columns: `BACKLOG`, `TODO`, `IN_PROGRESS`, `BLOCKED`, `IN_REVIEW`, and `DONE`.

### 3.4 SIH Readiness Tracker (`/sih-readiness`)
14-category evaluation matrix mapping directly to SIH Grand Finale scoring rubrics.

### 3.5 Live Demo Execution Checklist (`/demo-readiness`)
14-step scenario checklist ensuring all live demo flows (issuance, student wallet, QR scanning, tampering detection, revocation) pass cleanly before the jury presentation.

### 3.6 SIH AI Project Assistant
Click the **AI Assistant** button in the top navbar to interact with the real-time project assistant. Ask questions like:
- *"What is delaying us?"*
- *"Who is blocked right now?"*
- *"What are today's top priorities?"*
