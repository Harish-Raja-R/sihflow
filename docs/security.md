# SihFlow ERP — Security Architecture & Threat Model

## 1. Security Principles

SihFlow ERP enforces enterprise-grade security standards across authentication, authorization, and data access:

1. **Password Hashing**: BCrypt with work factor 10. Passwords are never stored in plaintext.
2. **Stateless JWT Tokens**: Signed with HMAC-SHA256 and configured with 7-day expiration.
3. **Role-Based Access Control (RBAC)**: Fine-grained permission guards (`requireRole`, `requireTeamLead`, `requireReviewer`).
4. **Input Validation**: All request bodies and queries are strictly sanitized and parsed using Zod schemas (`@sihflow/validation`).
5. **No Stack Traces in Production**: Centralized error middleware ensures internal stack traces are stripped before sending HTTP 500 errors.
6. **Audit Trail**: All critical operations (user creation, blocker resolution, task status changes, document approvals) emit persistent activity records.

---

## 2. RBAC Permission Matrix

| Role | Mission Control | Create Tasks | Status Update | Log Blockers | Resolve Blockers | Approve PRs / SRS | Run Tests |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **TEAM_LEAD** | ✅ Full | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **TEAM_MEMBER** | 👁️ View | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| **REVIEWER (QA)** | 👁️ View | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| **ADMIN** | ✅ Full | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
