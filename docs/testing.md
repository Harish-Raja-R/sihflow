# SihFlow ERP — Quality Assurance & Testing Strategy

## 1. Testing Strategy

Quality Assurance in SihFlow ERP is managed under **Workstream 12 (WS-12)** and owned by **Member 6 (QA Engineer)**.

The testing strategy spans:
1. **Unit Testing**: Isolated verification of utility algorithms, Zod validation schemas, and response helpers.
2. **Integration Testing**: Supertest HTTP execution against versioned `/api/v1` routes with database validation.
3. **Tamper Detection Tests**: Cryptographic verification of SHA-256 certificate hashing and rejection of modified byte payloads.
4. **End-to-End Build Audits**: Zero-error compilation across all monorepo packages.

---

## 2. Running Automated Tests

```bash
# Run backend integration test suite
npm test -w @sihflow/api

# Run tests in watch mode
npm run test:watch -w @sihflow/api
```

---

## 3. Core Test Scenarios Covered

1. `GET /api/v1/health` — Confirms service availability and uptime.
2. `POST /api/v1/auth/login` — Verifies JWT generation on valid credentials.
3. `POST /api/v1/auth/login (Invalid)` — Rejects incorrect credentials with HTTP 401.
4. `GET /api/v1/auth/me (Unauthorized)` — Validates bearer token requirement.
5. `GET /api/v1/projects` — Verifies AcadShield project entity integrity.
6. `GET /api/v1/team` — Validates 6 team members with assigned roles.
7. `POST /api/v1/tasks` — Validates task creation, automatic ID sequencing (`TASK-107`), and status transitions.
8. `GET /api/v1/milestones` — Confirms M1 through M11 roadmap gates.
9. `POST /api/v1/blockers` — Validates blocker reporting and activity logging.
10. `GET /api/v1/readiness/sih` — Validates 14-parameter weighted scoring calculation.
11. `GET /api/v1/analytics/dashboard` — Validates holistic KPI telemetry aggregation.
