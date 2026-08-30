# SihFlow ERP — REST API Specification (v1)

## 1. Global API Standards

All API routes are versioned under the `/api/v1` prefix.

### Success Response Format (HTTP 200 / 201)
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response Format (HTTP 4xx / 5xx)
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request payload"
  }
}
```

---

## 2. Endpoint Catalog

### System & Health
- `GET /api/v1/health` — Returns system health status, uptime, and timestamp.

### Authentication (`/api/v1/auth`)
- `POST /api/v1/auth/register` — Register a new team member with assigned team role.
- `POST /api/v1/auth/login` — Authenticate member credentials and issue JWT Bearer token.
- `POST /api/v1/auth/logout` — Invalidate user session.
- `GET /api/v1/auth/me` — Retrieve active authenticated user profile.

### Project & Team (`/api/v1/projects` & `/api/v1/team`)
- `GET /api/v1/projects` — List all tracked projects.
- `GET /api/v1/projects/:id` — Retrieve AcadShield details with workstreams and members.
- `GET /api/v1/team` — List all 6 team members with assigned tasks and performance stats.
- `GET /api/v1/team/:id` — Detailed member profile with activity history.

### Tasks & Kanban (`/api/v1/tasks`)
- `GET /api/v1/tasks` — Filterable task list (by status, priority, assignee, search).
- `GET /api/v1/tasks/:id` — Detailed task view with subtasks and comments.
- `POST /api/v1/tasks` — Create a new task (Zod validated).
- `PATCH /api/v1/tasks/:id/status` — Transition task status (`TODO`, `IN_PROGRESS`, `IN_REVIEW`, `COMPLETED`).
- `POST /api/v1/tasks/:id/subtasks` — Add subtask item.
- `PATCH /api/v1/subtasks/:id/toggle` — Toggle subtask completion and recalculate progress.

### Milestones & Sprints (`/api/v1/milestones` & `/api/v1/sprints`)
- `GET /api/v1/milestones` — List M1 through M11 roadmap gates.
- `PATCH /api/v1/milestones/:id` — Update milestone progress and completion status.
- `GET /api/v1/sprints` — List Sprints 1, 2, 3 with velocity metrics.

### Blockers (`/api/v1/blockers`)
- `GET /api/v1/blockers` — List active and resolved blockers.
- `POST /api/v1/blockers` — Log a new blocker dependency.
- `PATCH /api/v1/blockers/:id/resolve` — Resolve a blocker with resolution notes.

### Quality Assurance & Assurance (`/api/v1/testing`, `/api/v1/bugs`, `/api/v1/risks`)
- `GET /api/v1/testing/test-cases` — List automated Vitest/Supertest test catalog.
- `PATCH /api/v1/testing/test-cases/:id` — Update test execution result.
- `GET /api/v1/testing/metrics` — Aggregate test pass rate.
- `GET /api/v1/bugs` — List open and resolved defects.
- `POST /api/v1/bugs` — Report defect with severity and steps.
- `GET /api/v1/risks` — List risk matrix items.
- `POST /api/v1/risks` — Log new threat with mitigation plan.

### SIH & Demo Readiness (`/api/v1/readiness`)
- `GET /api/v1/readiness/sih` — Calculate composite 14-parameter SIH readiness index.
- `PATCH /api/v1/readiness/sih/:id` — Update readiness item score.
- `GET /api/v1/readiness/demo-checklist` — Retrieve 5-step live jury demo checklist.
- `PATCH /api/v1/readiness/demo-checklist/:id` — Mark live demo scenario as PASS/FAIL.

### Mission Control & Analytics (`/api/v1/analytics`, `/api/v1/ai`, `/api/v1/reports`)
- `GET /api/v1/analytics/dashboard` — Holistic project telemetry and recommended lead actions.
- `POST /api/v1/ai/query` — Grounded AI copilot answering blocker and priority queries.
- `GET /api/v1/reports` — Retrieve compiled SIH jury executive summaries.
