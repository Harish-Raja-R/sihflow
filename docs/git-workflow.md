# SihFlow ERP — Git Branching & Merge Strategy

## 1. Branch Hierarchy

To ensure 6 developers work in parallel without code collisions or broken builds:

- **`main`**: Production stable branch. Only tagged releases are merged here via Team Lead approval.
- **`develop`**: Central integration branch. All completed feature branches merge into develop.
- **Feature Branches**:
  - `feature/integration` (Member 1: Team Lead / Integration)
  - `feature/github` (Member 2: GitHub / Developer Activity)
  - `feature/auth-security` (Member 3: Authentication / Security)
  - `feature/backend` (Member 4: Backend / Database)
  - `feature/frontend` (Member 5: Frontend)
  - `feature/qa-docs` (Member 6: QA / UI-UX / Documentation)

---

## 2. Commit Message Convention

Follow Conventional Commits format:
```
<type>(<scope>): <short summary>

[optional body]
```

### Allowed Types:
- `feat`: New feature or user story implementation
- `fix`: Bug or defect fix
- `docs`: Documentation updates
- `style`: Formatting, missing semi colons, CSS styling
- `refactor`: Code refactoring without behavioral change
- `test`: Adding or updating test cases
- `chore`: Build tasks, package updates

### Examples:
- `feat(auth): implement W3C DID cryptographic credential issuer`
- `test(qa): add tamper proof verification test suite`
- `fix(blockchain): resolve peer TLS certificate mount path`

---

## 3. Pull Request & Review Rules

1. **Self-Review**: Developer runs tests locally (`npm test`) before submitting PR.
2. **Target Branch**: PRs must target `develop`.
3. **Approval Gate**: Team Lead (Member 1) or QA Reviewer (Member 6) must approve before merge.
4. **Zero Secrets Policy**: Never commit `.env` or API credentials. Use `.env.example`.
