import { PrismaClient, RoleType, TaskPriority, TaskStatus, MilestoneStatus, SprintStatus, BlockerPriority, BlockerStatus, RiskProbability, RiskImpact, RiskStatus, BugSeverity, BugPriority, BugStatus, TestStatus, DocumentReviewStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting SihFlow ERP Database Seeding...');

  // 1. Password Hashing (Universal Demo Password: Demo@123)
  const passwordHash = await bcrypt.hash('Demo@123', 10);

  // 2. Roles & Permissions
  const roleLead = await prisma.role.upsert({
    where: { name: 'TEAM_LEAD' },
    update: {},
    create: { name: 'TEAM_LEAD', description: 'Full architectural, administrative and project management control' },
  });

  const roleMember = await prisma.role.upsert({
    where: { name: 'TEAM_MEMBER' },
    update: {},
    create: { name: 'TEAM_MEMBER', description: 'Development and task execution access' },
  });

  const roleReviewer = await prisma.role.upsert({
    where: { name: 'REVIEWER' },
    update: {},
    create: { name: 'REVIEWER', description: 'Code review, test verification and documentation approval' },
  });

  // 3. Seed 6 Team Members
  const membersData = [
    {
      id: 'usr-lead-001',
      name: 'Member 1',
      email: 'lead@sihflow.io',
      role: RoleType.TEAM_LEAD,
      teamRole: 'Team Lead',
      githubUsername: 'member1-lead',
      phone: '+91 98765 43210',
      responsibilities: 'Overall system architecture, integration coordination, dashboard integration, pull request reviews, final demo presentation, and SIH jury coordination.',
    },
    {
      id: 'usr-github-002',
      name: 'Member 2',
      email: 'github@sihflow.io',
      role: RoleType.TEAM_MEMBER,
      teamRole: 'GitHub / Developer Activity',
      githubUsername: 'member2-github',
      phone: '+91 98765 43211',
      responsibilities: 'GitHub API integration, webhook ingestion, repository sync, commit logs, pull requests tracking, issues triage, and developer activity metrics.',
    },
    {
      id: 'usr-sec-003',
      name: 'Member 3',
      email: 'security@sihflow.io',
      role: RoleType.TEAM_MEMBER,
      teamRole: 'Authentication / Security',
      githubUsername: 'member3-security',
      phone: '+91 98765 43212',
      responsibilities: 'Authentication, registration, JWT/session management, RBAC, protected routes, audit logging, security validation, and threat modeling.',
    },
    {
      id: 'usr-backend-004',
      name: 'Member 4',
      email: 'backend@sihflow.io',
      role: RoleType.TEAM_MEMBER,
      teamRole: 'Backend / Database',
      githubUsername: 'member4-backend',
      phone: '+91 98765 43213',
      responsibilities: 'PostgreSQL database design, Prisma ORM schema & migrations, REST APIs, projects, tasks, subtasks, milestones, sprints, dependencies, and blocker engines.',
    },
    {
      id: 'usr-front-005',
      name: 'Member 5',
      email: 'frontend@sihflow.io',
      role: RoleType.TEAM_MEMBER,
      teamRole: 'Frontend',
      githubUsername: 'member5-frontend',
      phone: '+91 98765 43214',
      responsibilities: 'React 18 + Vite + Tailwind CSS web interface, responsive dashboard, interactive Kanban board, team roster, milestones roadmap, sprints, activity feed, and notifications.',
    },
    {
      id: 'usr-qa-006',
      name: 'Member 6',
      email: 'qa@sihflow.io',
      role: RoleType.REVIEWER,
      teamRole: 'QA / UI-UX / Documentation',
      githubUsername: 'member6-qa',
      phone: '+91 98765 43215',
      responsibilities: 'Automated test suites (Vitest/Supertest), test case catalog, defect tracking, E2E testing, UI/UX audit, Software Requirements (SRS), SIH readiness assessment, and live demo checklist.',
    },
  ];

  const createdUsers: Record<string, string> = {};
  for (const m of membersData) {
    const user = await prisma.user.upsert({
      where: { email: m.email },
      update: {
        name: m.name,
        teamRole: m.teamRole,
        role: m.role,
        responsibilities: m.responsibilities,
        passwordHash,
      },
      create: {
        id: m.id,
        name: m.name,
        email: m.email,
        passwordHash,
        role: m.role,
        teamRole: m.teamRole,
        githubUsername: m.githubUsername,
        phone: m.phone,
        responsibilities: m.responsibilities,
      },
    });
    createdUsers[m.email] = user.id;

    // Link user roles
    const targetRoleId = m.role === RoleType.TEAM_LEAD ? roleLead.id : m.role === RoleType.REVIEWER ? roleReviewer.id : roleMember.id;
    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: user.id, roleId: targetRoleId } },
      update: {},
      create: { userId: user.id, roleId: targetRoleId },
    });
  }

  // 4. Seed Project: AcadShield
  const project = await prisma.project.upsert({
    where: { projectId: 'proj-acadshield-001' },
    update: {
      name: 'AcadShield',
      sihProblemStatement: 'SIH Problem Statement #1422: Tamper-proof academic credential issuance and verification ecosystem leveraging decentralized blockchain ledgers and zero-knowledge identity proofs.',
      problemStatementNumber: '1422',
      description: 'AcadShield is a decentralized academic credential platform that enables universities to issue tamper-proof certificates, students to maintain verifiable credential wallets, and employers to verify authentic credentials in sub-seconds.',
      objective: 'Eliminate academic degree forgery through cryptographic hashing, W3C Decentralized Identifiers (DIDs), Hyperledger Fabric private ledgers, and automated fraud scoring.',
      repositoryUrl: 'https://github.com/vishanth11/AcadShield.git',
      progress: 72,
      status: ProjectStatus.ACTIVE,
      currentPhase: 'Phase 2 - Core Integration & UI Hardening',
      targetCompletionDate: new Date('2026-09-15T18:00:00.000Z'),
    },
    create: {
      projectId: 'proj-acadshield-001',
      name: 'AcadShield',
      sihProblemStatement: 'SIH Problem Statement #1422: Tamper-proof academic credential issuance and verification ecosystem leveraging decentralized blockchain ledgers and zero-knowledge identity proofs.',
      problemStatementNumber: '1422',
      description: 'AcadShield is a decentralized academic credential platform that enables universities to issue tamper-proof certificates, students to maintain verifiable credential wallets, and employers to verify authentic credentials in sub-seconds.',
      objective: 'Eliminate academic degree forgery through cryptographic hashing, W3C Decentralized Identifiers (DIDs), Hyperledger Fabric private ledgers, and automated fraud scoring.',
      repositoryUrl: 'https://github.com/vishanth11/AcadShield.git',
      progress: 72,
      status: ProjectStatus.ACTIVE,
      currentPhase: 'Phase 2 - Core Integration & UI Hardening',
      startDate: new Date('2026-08-01T09:00:00.000Z'),
      targetCompletionDate: new Date('2026-09-15T18:00:00.000Z'),
    },
  });

  // Link Project Members
  for (const m of membersData) {
    const userId = createdUsers[m.email];
    await prisma.projectMember.upsert({
      where: { projectId_userId: { projectId: project.id, userId } },
      update: {},
      create: {
        projectId: project.id,
        userId,
        roleInProject: m.teamRole,
        responsibilities: m.responsibilities,
        isLead: m.role === RoleType.TEAM_LEAD,
      },
    });
  }

  // 5. Seed 17 Workstreams
  const workstreamsData = [
    { code: 'WS-01', name: 'Research & Problem Understanding', desc: 'Requirements analysis and SIH Problem Statement #1422 decomposition.' },
    { code: 'WS-02', name: 'Architecture', desc: 'System component topology, sequence flows, and API boundary definitions.' },
    { code: 'WS-03', name: 'DID & Identity', desc: 'W3C Decentralized Identifiers (DIDs), key pairs, and verifiable credential schemas.' },
    { code: 'WS-04', name: 'RBAC & Security', desc: 'Role-based access control, cryptographic hashing, and fraud detection engine.' },
    { code: 'WS-05', name: 'Backend', desc: 'Express.js REST APIs, business services, and storage providers.' },
    { code: 'WS-06', name: 'Database', desc: 'PostgreSQL relational schema, indexing, and Prisma data models.' },
    { code: 'WS-07', name: 'Blockchain', desc: 'Hyperledger Fabric network orchestration, peer nodes, and channel setup.' },
    { code: 'WS-08', name: 'Smart Contracts', desc: 'Chaincode business logic for credential anchoring and revocation.' },
    { code: 'WS-09', name: 'Frontend', desc: 'React 18 + Vite responsive single-page web application.' },
    { code: 'WS-10', name: 'Wallet', desc: 'Student verifiable credential wallet and selective disclosure sharing.' },
    { code: 'WS-11', name: 'QR Verification', desc: 'Cryptographic QR code generator, scanner, and instant verification widget.' },
    { code: 'WS-12', name: 'Testing', desc: 'Unit, integration, security tamper, and Supertest automated test suites.' },
    { code: 'WS-13', name: 'Integration', desc: 'End-to-end integration between Frontend, Backend, and Blockchain ledger.' },
    { code: 'WS-14', name: 'Documentation', desc: 'System architecture, SRS, API docs, user manuals, and threat models.' },
    { code: 'WS-15', name: 'Presentation', desc: 'SIH Grand Finale pitch deck, architectural slides, and business model.' },
    { code: 'WS-16', name: 'Demo Preparation', desc: 'Live jury presentation dry-run scripts and failover fallback datasets.' },
    { code: 'WS-17', name: 'Deployment', desc: 'Docker containerization, environment configs, and multi-service compose.' },
  ];

  const workstreamMap: Record<string, string> = {};
  for (let i = 0; i < workstreamsData.length; i++) {
    const ws = workstreamsData[i];
    const created = await prisma.workstream.upsert({
      where: { id: `ws-acad-${i + 1}` },
      update: { name: ws.name, description: ws.desc, code: ws.code },
      create: {
        id: `ws-acad-${i + 1}`,
        projectId: project.id,
        code: ws.code,
        name: ws.name,
        description: ws.desc,
        progress: 75,
        orderIndex: i + 1,
      },
    });
    workstreamMap[ws.code] = created.id;
  }

  // 6. Seed 11 Milestones (M1–M11)
  const milestonesData = [
    { code: 'M1', name: 'Problem Understanding', desc: 'Deep dive into SIH Problem Statement #1422 requirements, stakeholders, and workflow.', prog: 100, status: MilestoneStatus.COMPLETED, date: '2026-08-05' },
    { code: 'M2', name: 'Architecture', desc: 'System architecture freeze, sequence diagrams, database schemas, and threat modeling.', prog: 100, status: MilestoneStatus.COMPLETED, date: '2026-08-10' },
    { code: 'M3', name: 'Core Development', desc: 'Implementation of core credential issuance, hashing, and database storage.', prog: 90, status: MilestoneStatus.IN_PROGRESS, date: '2026-08-18' },
    { code: 'M4', name: 'Blockchain Integration', desc: 'Hyperledger Fabric network setup, chaincode smart contract deployment, and adapter.', prog: 75, status: MilestoneStatus.IN_PROGRESS, date: '2026-08-25' },
    { code: 'M5', name: 'Frontend + Backend Integration', desc: 'Issuer dashboard, Student credential wallet, and public verification UI integration.', prog: 70, status: MilestoneStatus.IN_PROGRESS, date: '2026-08-30' },
    { code: 'M6', name: 'Testing', desc: 'Unit testing, integration testing, Supertest suites, and load test scripts.', prog: 80, status: MilestoneStatus.IN_PROGRESS, date: '2026-09-02' },
    { code: 'M7', name: 'Security Validation', desc: 'Tamper proof tests, replay attack prevention, RBAC audit, and Merkle root verification.', prog: 65, status: MilestoneStatus.PLANNED, date: '2026-09-05' },
    { code: 'M8', name: 'Deployment', desc: 'Docker containerization, Docker-Compose multi-container orchestration, and reverse proxy.', prog: 85, status: MilestoneStatus.IN_PROGRESS, date: '2026-09-08' },
    { code: 'M9', name: 'Documentation', desc: 'Software Requirements Specification (SRS), API documentation, User Guide, and Demo script.', prog: 90, status: MilestoneStatus.IN_PROGRESS, date: '2026-09-10' },
    { code: 'M10', name: 'Final Demo', desc: 'End-to-end dry runs of live jury evaluation scenarios with zero fail rates.', prog: 50, status: MilestoneStatus.PLANNED, date: '2026-09-12' },
    { code: 'M11', name: 'SIH Presentation', desc: 'Grand Finale pitch deck, value proposition slides, and architectural presentation.', prog: 40, status: MilestoneStatus.PLANNED, date: '2026-09-15' },
  ];

  const milestoneMap: Record<string, string> = {};
  for (const m of milestonesData) {
    const created = await prisma.milestone.upsert({
      where: { projectId_milestoneCode: { projectId: project.id, milestoneCode: m.code } },
      update: { name: m.name, description: m.desc, progress: m.prog, status: m.status },
      create: {
        projectId: project.id,
        milestoneCode: m.code,
        name: m.name,
        description: m.desc,
        progress: m.prog,
        status: m.status,
        deadline: new Date(`${m.date}T18:00:00.000Z`),
        startDate: new Date('2026-08-01T09:00:00.000Z'),
        endDate: new Date(`${m.date}T18:00:00.000Z`),
      },
    });
    milestoneMap[m.code] = created.id;
  }

  // 7. Seed Sprints (1, 2, 3)
  const sprintsData = [
    { number: 1, name: 'Sprint 1 — Core Prototype', goal: 'Establish PostgreSQL schemas, credential issuance hashing, and mock ledger.', prog: 100, status: SprintStatus.COMPLETED, start: '2026-08-01', end: '2026-08-10' },
    { number: 2, name: 'Sprint 2 — Blockchain & UI Integration', goal: 'Integrate Fabric chaincode, student wallet, QR code verification, and fraud scoring.', prog: 70, status: SprintStatus.ACTIVE, start: '2026-08-11', end: '2026-08-25' },
    { number: 3, name: 'Sprint 3 — Demo Polish & Hardening', goal: 'Complete test automation, load testing, SRS documentation, and SIH jury rehearsal.', prog: 25, status: SprintStatus.PLANNED, start: '2026-08-26', end: '2026-09-15' },
  ];

  const sprintMap: Record<number, string> = {};
  for (const s of sprintsData) {
    const created = await prisma.sprint.upsert({
      where: { projectId_number: { projectId: project.id, number: s.number } },
      update: { name: s.name, goal: s.goal, progress: s.prog, status: s.status },
      create: {
        projectId: project.id,
        number: s.number,
        name: s.name,
        goal: s.goal,
        progress: s.prog,
        status: s.status,
        velocity: 38,
        startDate: new Date(`${s.start}T09:00:00.000Z`),
        endDate: new Date(`${s.end}T18:00:00.000Z`),
      },
    });
    sprintMap[s.number] = created.id;
  }

  // 8. Seed Sample Tasks
  const tasksData = [
    {
      taskId: 'TASK-101',
      title: 'Finalize System Architecture & Sequence Diagrams',
      description: 'Define microservices boundaries, Fabric ledger adapter interface, and PostgreSQL storage fallbacks.',
      workstreamCode: 'WS-02',
      milestoneCode: 'M2',
      sprintNumber: 1,
      assigneeEmail: 'lead@sihflow.io',
      priority: TaskPriority.CRITICAL,
      status: TaskStatus.COMPLETED,
      progress: 100,
      estimatedHours: 16,
      actualHours: 14,
      githubBranch: 'feature/integration',
      githubPrNumber: 1,
    },
    {
      taskId: 'TASK-102',
      title: 'Implement Hyperledger Fabric Chaincode (credentialContract.js)',
      description: 'Develop chaincode methods for issueCredential, verifyCredential, revokeCredential, and queryHistory.',
      workstreamCode: 'WS-08',
      milestoneCode: 'M4',
      sprintNumber: 2,
      assigneeEmail: 'github@sihflow.io',
      priority: TaskPriority.CRITICAL,
      status: TaskStatus.IN_PROGRESS,
      progress: 80,
      estimatedHours: 24,
      actualHours: 18,
      githubBranch: 'feature/github',
      githubPrNumber: 4,
    },
    {
      taskId: 'TASK-103',
      title: 'Implement W3C DID Resolution & Merkle Hash Engine',
      description: 'Generate institutional did:acad identifiers, calculate certificate Merkle root hashes, and detect alterations.',
      workstreamCode: 'WS-03',
      milestoneCode: 'M3',
      sprintNumber: 2,
      assigneeEmail: 'security@sihflow.io',
      priority: TaskPriority.HIGH,
      status: TaskStatus.IN_REVIEW,
      progress: 90,
      estimatedHours: 18,
      actualHours: 16,
      githubBranch: 'feature/auth-security',
      githubPrNumber: 5,
    },
    {
      taskId: 'TASK-104',
      title: 'Build Express.js REST API & PostgreSQL Models',
      description: 'Create endpoints for /api/credentials/issue, /api/verify, /api/students, and multi-tenant DB schema.',
      workstreamCode: 'WS-05',
      milestoneCode: 'M3',
      sprintNumber: 2,
      assigneeEmail: 'backend@sihflow.io',
      priority: TaskPriority.HIGH,
      status: TaskStatus.IN_PROGRESS,
      progress: 75,
      estimatedHours: 20,
      actualHours: 15,
      githubBranch: 'feature/backend',
      githubPrNumber: 2,
    },
    {
      taskId: 'TASK-105',
      title: 'Develop Student Wallet & Public QR Verification UI',
      description: 'Build React 18 responsive interfaces for certificate viewer, QR code scanner, and drag-and-drop verification.',
      workstreamCode: 'WS-09',
      milestoneCode: 'M5',
      sprintNumber: 2,
      assigneeEmail: 'frontend@sihflow.io',
      priority: TaskPriority.HIGH,
      status: TaskStatus.IN_PROGRESS,
      progress: 70,
      estimatedHours: 22,
      actualHours: 16,
      githubBranch: 'feature/frontend',
      githubPrNumber: 3,
    },
    {
      taskId: 'TASK-106',
      title: 'Create Vitest QA Automation & Tamper-Proof Test Cases',
      description: 'Author unit & integration test suites covering happy path issuance, hash tampering, and unauthorized access.',
      workstreamCode: 'WS-12',
      milestoneCode: 'M6',
      sprintNumber: 2,
      assigneeEmail: 'qa@sihflow.io',
      priority: TaskPriority.HIGH,
      status: TaskStatus.IN_PROGRESS,
      progress: 85,
      estimatedHours: 18,
      actualHours: 15,
      githubBranch: 'feature/qa-docs',
    },
  ];

  for (const t of tasksData) {
    const task = await prisma.task.upsert({
      where: { taskId: t.taskId },
      update: {
        title: t.title,
        description: t.description,
        priority: t.priority,
        status: t.status,
        progress: t.progress,
      },
      create: {
        taskId: t.taskId,
        projectId: project.id,
        workstreamId: workstreamMap[t.workstreamCode],
        milestoneId: milestoneMap[t.milestoneCode],
        sprintId: sprintMap[t.sprintNumber],
        assigneeId: createdUsers[t.assigneeEmail],
        reporterId: createdUsers['lead@sihflow.io'],
        title: t.title,
        description: t.description,
        priority: t.priority,
        status: t.status,
        estimatedHours: t.estimatedHours,
        actualHours: t.actualHours,
        progress: t.progress,
        githubBranch: t.githubBranch,
        githubPrNumber: t.githubPrNumber,
        dueDate: new Date('2026-09-05T18:00:00.000Z'),
      },
    });

    // Seed Subtasks
    await prisma.subtask.createMany({
      data: [
        { taskId: task.id, title: 'Draft specification and interface design', completed: true, orderIndex: 1 },
        { taskId: task.id, title: 'Implement functional logic and validations', completed: t.progress >= 70, orderIndex: 2 },
        { taskId: task.id, title: 'Run local test harness and verify assertions', completed: t.progress >= 90, orderIndex: 3 },
      ],
      skipDuplicates: true,
    });
  }

  // 9. Seed Blockers
  await prisma.blocker.upsert({
    where: { blockerId: 'BLK-001' },
    update: {},
    create: {
      blockerId: 'BLK-001',
      projectId: project.id,
      title: 'Awaiting Fabric Peer Gateway Endorsement TLS Config',
      description: 'Backend cannot submit transaction blocks to channel mychannel until TLS client certs are mounted.',
      reportedById: createdUsers['backend@sihflow.io'],
      blockedUserId: createdUsers['github@sihflow.io'],
      priority: BlockerPriority.HIGH,
      status: BlockerStatus.OPEN,
      impact: 'Delays end-to-end credential anchoring test runs.',
    },
  });

  // 10. Seed SIH Readiness Items (14 Grand Finale Categories)
  const readinessData = [
    { cat: 'Architecture & Scalability', name: 'Decentralized Multi-Peer Topology', desc: 'Fabric network can scale across multiple universities.', wt: 10, prog: 85 },
    { cat: 'Identity & DIDs', name: 'W3C Compliant DID Resolution', desc: 'DIDs resolve institutional and student keys deterministically.', wt: 10, prog: 90 },
    { cat: 'Smart Contract Logic', name: 'Immutability & Revocation Hooks', desc: 'Revocation status recorded with cryptographic proof.', wt: 10, prog: 80 },
    { cat: 'Data Security & Integrity', name: 'SHA-256 Merkle Verification', desc: 'Certificate tamper detection with byte-level verification.', wt: 10, prog: 95 },
    { cat: 'Fraud Detection Engine', name: 'Real-Time Heuristic Scoring', desc: 'Flag duplicate certificates and unauthorized issuers.', wt: 10, prog: 75 },
    { cat: 'Student Wallet UX', name: 'Selective Disclosure & QR Export', desc: 'Students can share specific transcript sections securely.', wt: 10, prog: 85 },
    { cat: 'Verifier Experience', name: 'Sub-Second QR Code Scanner', desc: 'Public verifier validates authenticity in under 1 second.', wt: 10, prog: 90 },
    { cat: 'Automated QA & Testing', name: 'Vitest/Supertest 100% Pass Rate', desc: 'Automated test suite validates all critical paths.', wt: 10, prog: 100 },
    { cat: 'Containerization & DevOps', name: 'Docker Compose Local Orchestration', desc: 'Single command spin-up for complete system.', wt: 10, prog: 90 },
    { cat: 'SIH Pitch & Presentation', name: 'Jury Deck & Problem Statement Alignment', desc: 'Addresses all evaluation parameters of SIH #1422.', wt: 10, prog: 70 },
  ];

  for (let i = 0; i < readinessData.length; i++) {
    const r = readinessData[i];
    await prisma.readinessItem.upsert({
      where: { id: `readiness-acad-${i + 1}` },
      update: { progress: r.prog },
      create: {
        id: `readiness-acad-${i + 1}`,
        projectId: project.id,
        category: r.cat,
        categoryNumber: i + 1,
        name: r.name,
        description: r.desc,
        weight: r.wt,
        progress: r.prog,
        status: r.prog === 100 ? 'COMPLETED' : 'IN_PROGRESS',
        evidence: 'Verified against AcadShield codebase and seed test harness.',
        orderIndex: i + 1,
      },
    });
  }

  // 11. Seed Demo Checklist Items
  const demoItems = [
    { code: 'DEMO-01', cat: 'ISSUANCE', title: 'University Issues Credential', desc: 'Admin issues B.Tech Degree with SHA-256 hash and metadata.', exp: 'HTTP 201 Created + Block Hash generated on ledger', status: 'PASS' },
    { code: 'DEMO-02', cat: 'WALLET', title: 'Student Receives in Wallet', desc: 'Student logs in, views verifiable credential, and generates QR code.', exp: 'QR code rendered with signed payload', status: 'PASS' },
    { code: 'DEMO-03', cat: 'VERIFICATION', title: 'Public QR Verification', desc: 'Employer scans QR code to verify authenticity in sub-seconds.', exp: 'Instant Green Verified Badge displayed', status: 'PASS' },
    { code: 'DEMO-04', cat: 'TAMPER_DETECTION', title: 'Tamper Detection Rehearsal', desc: 'Upload altered PDF certificate with modified GPA or student name.', exp: 'Instant Red Tampered Warning + Fraud Alert logged', status: 'PASS' },
    { code: 'DEMO-05', cat: 'REVOCATION', title: 'Credential Revocation', desc: 'Issuer revokes certificate due to administrative request.', exp: 'Status updates to REVOKED on ledger verification', status: 'NOT_TESTED' },
  ];

  for (let i = 0; i < demoItems.length; i++) {
    const d = demoItems[i];
    await prisma.demoChecklistItem.upsert({
      where: { id: `demo-acad-${i + 1}` },
      update: { status: d.status },
      create: {
        id: `demo-acad-${i + 1}`,
        projectId: project.id,
        stepNumber: i + 1,
        category: d.cat,
        itemCode: d.code,
        title: d.title,
        description: d.desc,
        expectedResult: d.exp,
        status: d.status,
        orderIndex: i + 1,
      },
    });
  }

  // 12. Seed GitHub Repository & Demo Commits
  const githubRepo = await prisma.githubRepository.upsert({
    where: { projectId_repoOwner_repoName: { projectId: project.id, repoOwner: 'vishanth11', repoName: 'AcadShield' } },
    update: {},
    create: {
      projectId: project.id,
      repoOwner: 'vishanth11',
      repoName: 'AcadShield',
      repoUrl: 'https://github.com/vishanth11/AcadShield.git',
      isPrivate: false,
    },
  });

  const commits = [
    { sha: '7f9c2d1', msg: 'feat(blockchain): integrate Hyperledger Fabric smart contract interface', author: 'Member 2', email: 'github@sihflow.io', branch: 'feature/github', date: new Date('2026-08-28T14:20:00Z') },
    { sha: '3a4b5c6', msg: 'feat(auth): implement W3C DID resolution & JWT role middleware', author: 'Member 3', email: 'security@sihflow.io', branch: 'feature/auth-security', date: new Date('2026-08-28T16:45:00Z') },
    { sha: '8d7e6f5', msg: 'feat(api): implement credential issuance & verification endpoints', author: 'Member 4', email: 'backend@sihflow.io', branch: 'feature/backend', date: new Date('2026-08-29T10:15:00Z') },
    { sha: '2c1b0a9', msg: 'feat(ui): clean light theme SaaS layout & Kanban board', author: 'Member 5', email: 'frontend@sihflow.io', branch: 'feature/frontend', date: new Date('2026-08-29T18:30:00Z') },
    { sha: '9e8d7c6', msg: 'test(qa): add automated integration tests for tamper detection', author: 'Member 6', email: 'qa@sihflow.io', branch: 'feature/qa-docs', date: new Date('2026-08-30T11:00:00Z') },
  ];

  for (const c of commits) {
    await prisma.githubCommit.upsert({
      where: { sha: c.sha },
      update: {},
      create: {
        repositoryId: githubRepo.id,
        sha: c.sha,
        message: c.msg,
        authorName: c.author,
        authorEmail: c.email,
        branch: c.branch,
        committedAt: c.date,
        url: `https://github.com/vishanth11/AcadShield/commit/${c.sha}`,
      },
    });
  }

  // 13. Seed Activities
  await prisma.activity.createMany({
    data: [
      { projectId: project.id, userId: createdUsers['lead@sihflow.io'], eventType: 'PROJECT_INITIALIZED', entityType: 'PROJECT', summary: 'SihFlow ERP initialized for 6-member SIH team' },
      { projectId: project.id, userId: createdUsers['backend@sihflow.io'], eventType: 'SCHEMA_MIGRATED', entityType: 'DATABASE', summary: 'PostgreSQL relational schema synchronized with Prisma' },
      { projectId: project.id, userId: createdUsers['frontend@sihflow.io'], eventType: 'UI_THEME_UPDATED', entityType: 'FRONTEND', summary: 'Minimalist light theme design system active across all 20+ routes' },
      { projectId: project.id, userId: createdUsers['qa@sihflow.io'], eventType: 'TESTS_PASSED', entityType: 'QA', summary: '12/12 automated integration tests verified successfully' },
    ],
    skipDuplicates: true,
  });

  console.log('✅ SihFlow ERP Database Seeding Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
