# SihFlow ERP — 6-Member Parallel Team Workflow

## 1. Team Composition & Boundaries

| Member | System Role | Primary Ownership | Assigned Branch | Email |
| :--- | :--- | :--- | :--- | :--- |
| **Member 1** | Team Lead | Architecture, Integration, Lead Mission Control, PR Approvals, SIH Jury Rehearsal | `feature/integration` | `lead@sihflow.io` |
| **Member 2** | GitHub / Activity | GitHub SCM sync, PR tracking, commit telemetry, contributor analytics | `feature/github` | `github@sihflow.io` |
| **Member 3** | Security | Auth, JWT, RBAC, W3C DIDs, tamper detection, security threat modeling | `feature/auth-security` | `security@sihflow.io` |
| **Member 4** | Backend | PostgreSQL, Prisma ORM, REST API endpoints, task/sprint/blocker engines | `feature/backend` | `backend@sihflow.io` |
| **Member 5** | Frontend | React 18, Tailwind CSS, Kanban board, team UI, live activity streams | `feature/frontend` | `frontend@sihflow.io` |
| **Member 6** | QA & Docs | Vitest automated tests, bug triage, SRS v1.0 specifications, SIH readiness index | `feature/qa-docs` | `qa@sihflow.io` |

---

## 2. Daily Workflow Protocol

1. **Morning Standup (15 mins)**:
   - Log standup in SihFlow ERP (`/meetings`).
   - Identify active blockers in the Blocker Registry (`/blockers`).
   - Review AI Copilot daily recommendations (`/lead-center`).

2. **Sprint Execution**:
   - Move assigned tasks to `IN_PROGRESS` on the Kanban board (`/board`).
   - Commit code to isolated feature branch.

3. **Code Review & Blocker Clearance**:
   - Create PR to `develop`.
   - Team Lead or Reviewer verifies diff and triggers automated tests.
   - On approval, PR merges into `develop`.

4. **Evening QA Verification**:
   - Member 6 executes Vitest test suite (`/testing`).
   - Updates SIH Readiness Index (`/sih-readiness`) and Live Demo Checklist (`/demo-readiness`).
