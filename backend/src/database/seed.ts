import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding SihFlow ERP database for AcadShield SIH team...');

  // 1. Clean existing tables in reverse dependency order
  await prisma.activityLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.report.deleteMany();
  await prisma.demoChecklistItem.deleteMany();
  await prisma.readinessItem.deleteMany();
  await prisma.gitHubReview.deleteMany();
  await prisma.gitHubPullRequest.deleteMany();
  await prisma.gitHubIssue.deleteMany();
  await prisma.gitHubCommit.deleteMany();
  await prisma.gitHubRepo.deleteMany();
  await prisma.testRun.deleteMany();
  await prisma.testCase.deleteMany();
  await prisma.bug.deleteMany();
  await prisma.risk.deleteMany();
  await prisma.document.deleteMany();
  await prisma.meetingActionItem.deleteMany();
  await prisma.meeting.deleteMany();
  await prisma.blocker.deleteMany();
  await prisma.taskComment.deleteMany();
  await prisma.taskAttachment.deleteMany();
  await prisma.subtask.deleteMany();
  await prisma.task.deleteMany();
  await prisma.sprint.deleteMany();
  await prisma.milestone.deleteMany();
  await prisma.workstream.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  const salt = await bcrypt.genSalt(10);
  const defaultPasswordHash = await bcrypt.hash('Demo@123', salt);

  // 2. Create the 6 SIH Team Members
  const userLead = await prisma.user.create({
    data: {
      id: 'usr-lead-001',
      name: 'Harish R (Lead)',
      email: 'lead@sihflow.io',
      passwordHash: defaultPasswordHash,
      role: 'TEAM_LEAD',
      teamRole: 'TEAM LEAD',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      phone: '+91 98765 43210',
      githubUsername: 'vishanth11',
      responsibilities: 'Overall System Architecture, Cross-module Integration, GitHub Flow, SIH Presentation, Live Demo Coordination, Code Reviews',
    }
  });

  const userBlockchain = await prisma.user.create({
    data: {
      id: 'usr-bc-002',
      name: 'Vikas Sharma',
      email: 'blockchain@sihflow.io',
      passwordHash: defaultPasswordHash,
      role: 'TEAM_MEMBER',
      teamRole: 'BLOCKCHAIN ENGINEER',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      phone: '+91 98765 43211',
      githubUsername: 'vikas-blockchain',
      responsibilities: 'Hyperledger Fabric Chaincode, Smart Contract Logic, Ledger Adapters, Asset Minting, Revocation & Proof Verification',
    }
  });

  const userSecurity = await prisma.user.create({
    data: {
      id: 'usr-sec-003',
      name: 'Ananya Roy',
      email: 'security@sihflow.io',
      passwordHash: defaultPasswordHash,
      role: 'TEAM_MEMBER',
      teamRole: 'IDENTITY + SECURITY ENGINEER',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      phone: '+91 98765 43212',
      githubUsername: 'ananya-sec',
      responsibilities: 'W3C DID Specification, RBAC Authorization, SHA-256 Hashing Pipeline, Fraud Risk Heuristics Engine, Cryptographic Audit',
    }
  });

  const userBackend = await prisma.user.create({
    data: {
      id: 'usr-be-004',
      name: 'Rohan Patel',
      email: 'backend@sihflow.io',
      passwordHash: defaultPasswordHash,
      role: 'REVIEWER',
      teamRole: 'BACKEND ENGINEER',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      phone: '+91 98765 43213',
      githubUsername: 'rohan-backend',
      responsibilities: 'Node.js Express REST APIs, PostgreSQL & Prisma ORM, Storage Adapters (Local FS / IPFS), Multer Ingestion Pipeline',
    }
  });

  const userFrontend = await prisma.user.create({
    data: {
      id: 'usr-fe-005',
      name: 'Sneha Kulkarni',
      email: 'frontend@sihflow.io',
      passwordHash: defaultPasswordHash,
      role: 'TEAM_MEMBER',
      teamRole: 'FRONTEND ENGINEER',
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
      phone: '+91 98765 43214',
      githubUsername: 'sneha-frontend',
      responsibilities: 'React 18 + Vite SPA, Tailwind CSS Design System, Student Wallet, Dynamic QR Generator, Employer Verification Portal',
    }
  });

  const userQA = await prisma.user.create({
    data: {
      id: 'usr-qa-006',
      name: 'Kavya Nair',
      email: 'qa@sihflow.io',
      passwordHash: defaultPasswordHash,
      role: 'REVIEWER',
      teamRole: 'QA + UI/UX + DOCUMENTATION',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      phone: '+91 98765 43215',
      githubUsername: 'kavya-qa',
      responsibilities: 'Automated Test Suites (Jest/Supertest/Playwright), UI/UX Usability Polish, SRS & Technical Docs, Live Demo Checklist',
    }
  });

  // 3. Create Project: AcadShield
  const project = await prisma.project.create({
    data: {
      id: 'proj-acadshield-001',
      projectId: 'PROJ-ACADSHIELD',
      name: 'AcadShield',
      sihProblemStatement: 'Decentralized Blockchain-Based Academic Credential Verification System (Tamper-Proof & Instant Verification)',
      problemStatementNumber: 'SIH-1422',
      description: 'Enterprise blockchain infrastructure enabling accredited universities to issue verifiable cryptographic degrees, students to selectively disclose credentials via digital wallets, and employers to instantly verify authenticity with fraud detection heuristics.',
      objective: 'Eliminate academic credential fraud, enable sub-second QR verification, guarantee data privacy via zero-PII ledger storage, and deliver a production-ready SIH winning solution.',
      startDate: new Date('2026-08-01'),
      targetCompletionDate: new Date('2026-09-15'),
      currentPhase: 'ACTIVE',
      status: 'ACTIVE',
      progress: 72,
      repositoryUrl: 'https://github.com/vishanth11/AcadShield.git',
      demoUrl: 'http://localhost:5173/demo',
      deploymentUrl: 'https://acadshield.demo.sih.gov.in',
    }
  });

  // 4. Link Members to Project
  const memberRecords = [
    { userId: userLead.id, roleInProject: 'Team Lead & Architect', isLead: true },
    { userId: userBlockchain.id, roleInProject: 'Blockchain Engineer', isLead: false },
    { userId: userSecurity.id, roleInProject: 'Identity & Security Engineer', isLead: false },
    { userId: userBackend.id, roleInProject: 'Backend Engineer', isLead: false },
    { userId: userFrontend.id, roleInProject: 'Frontend Engineer', isLead: false },
    { userId: userQA.id, roleInProject: 'QA & Documentation Lead', isLead: false },
  ];

  for (const m of memberRecords) {
    await prisma.projectMember.create({
      data: {
        projectId: project.id,
        userId: m.userId,
        roleInProject: m.roleInProject,
        isLead: m.isLead,
      }
    });
  }

  // 5. Create 17 Workstreams
  const workstreamsData = [
    { code: 'WS-01', name: 'Research & Problem Understanding', desc: 'Domain analysis of fake degree fraud and UGC/AICTE compliance', ownerId: userLead.id, progress: 100, status: 'COMPLETED' },
    { code: 'WS-02', name: 'Architecture & System Design', desc: '4-tier layered architecture specification and ledger boundary models', ownerId: userLead.id, progress: 100, status: 'COMPLETED' },
    { code: 'WS-03', name: 'DID & Identity Management', desc: 'W3C Decentralized Identifier schemas and selective disclosure tokens', ownerId: userSecurity.id, progress: 85, status: 'ACTIVE' },
    { code: 'WS-04', name: 'RBAC & Cryptographic Security', desc: 'JWT authorization, SHA-256 hash digest pipeline, and fraud risk scoring', ownerId: userSecurity.id, progress: 85, status: 'ACTIVE' },
    { code: 'WS-05', name: 'Backend REST APIs & Services', desc: 'Express API endpoints for issuance, revocation, and verification', ownerId: userBackend.id, progress: 90, status: 'ACTIVE' },
    { code: 'WS-06', name: 'Database & Prisma Migrations', desc: 'PostgreSQL schema design, indexing, and migration pipelines', ownerId: userBackend.id, progress: 95, status: 'COMPLETED' },
    { code: 'WS-07', name: 'Hyperledger Fabric Infrastructure', desc: 'Network peer, orderer, and channel orchestration configs', ownerId: userBlockchain.id, progress: 70, status: 'ACTIVE' },
    { code: 'WS-08', name: 'Smart Contracts & Chaincode Logic', desc: '`credentialContract.js` issuance, verification, and revocation smart contracts', ownerId: userBlockchain.id, progress: 80, status: 'ACTIVE' },
    { code: 'WS-09', name: 'Frontend UI & Component Library', desc: 'React 18, Vite, Tailwind CSS modular component system', ownerId: userFrontend.id, progress: 80, status: 'ACTIVE' },
    { code: 'WS-10', name: 'Student Wallet Subsystem', desc: 'Digital credential wallet with selective attribute disclosure controls', ownerId: userFrontend.id, progress: 75, status: 'ACTIVE' },
    { code: 'WS-11', name: 'QR Verification Portal', desc: 'Public and Employer QR scanner with real-time verification status engine', ownerId: userFrontend.id, progress: 85, status: 'ACTIVE' },
    { code: 'WS-12', name: 'QA & Automated Testing', desc: 'Jest unit tests, Supertest API tests, and Playwright verification flows', ownerId: userQA.id, progress: 65, status: 'ACTIVE' },
    { code: 'WS-13', name: 'End-to-End System Integration', desc: 'Connecting frontend wallet and verifier to blockchain and IPFS adapters', ownerId: userLead.id, progress: 70, status: 'ACTIVE' },
    { code: 'WS-14', name: 'Technical Documentation & SRS', desc: 'Software Requirements Specification, API specs, and Architecture blueprints', ownerId: userQA.id, progress: 70, status: 'ACTIVE' },
    { code: 'WS-15', name: 'SIH Presentation & Pitch Deck', desc: '10-slide high-impact pitch deck, business viability, and scalability story', ownerId: userLead.id, progress: 60, status: 'ACTIVE' },
    { code: 'WS-16', name: 'Live Demo Script & Rehearsals', desc: 'End-to-end live demonstration scenarios (Valid, Tampered, Revoked)', ownerId: userLead.id, progress: 75, status: 'ACTIVE' },
    { code: 'WS-17', name: 'Docker & Cloud Deployment', desc: 'Multi-stage Dockerfiles and docker-compose deployment configuration', ownerId: userBackend.id, progress: 70, status: 'ACTIVE' },
  ];

  const workstreamMap = new Map<string, string>();
  for (let i = 0; i < workstreamsData.length; i++) {
    const ws = workstreamsData[i];
    const created = await prisma.workstream.create({
      data: {
        projectId: project.id,
        code: ws.code,
        name: ws.name,
        description: ws.desc,
        ownerId: ws.ownerId,
        progress: ws.progress,
        status: ws.status,
        orderIndex: i,
        deadline: new Date('2026-09-10'),
      }
    });
    workstreamMap.set(ws.code, created.id);
  }

  // 6. Create 11 Milestones
  const milestonesData = [
    { code: 'M1', name: 'Problem Understanding & UGC Specs', desc: 'Comprehensive requirement mapping against UGC/AICTE guidelines', ownerId: userLead.id, progress: 100, status: 'COMPLETED', start: '2026-08-01', end: '2026-08-05' },
    { code: 'M2', name: 'Architecture & Specification Freeze', desc: 'System architecture, API contracts, and schema designs locked', ownerId: userLead.id, progress: 100, status: 'COMPLETED', start: '2026-08-05', end: '2026-08-10' },
    { code: 'M3', name: 'Core Backend & Database Infrastructure', desc: 'Express REST APIs, PostgreSQL schema, and Prisma models live', ownerId: userBackend.id, progress: 95, status: 'COMPLETED', start: '2026-08-10', end: '2026-08-18' },
    { code: 'M4', name: 'Blockchain Chaincode & Ledger Adapter', desc: 'Hyperledger Fabric chaincode logic and mock ledger service operational', ownerId: userBlockchain.id, progress: 80, status: 'ON_TRACK', start: '2026-08-18', end: '2026-08-25' },
    { code: 'M5', name: 'Frontend UI & Wallet Integration', desc: 'React components, wallet UI, and QR verification views connected', ownerId: userFrontend.id, progress: 75, status: 'ON_TRACK', start: '2026-08-20', end: '2026-08-28' },
    { code: 'M6', name: 'Comprehensive QA & Testing Suite', desc: 'Full automated test coverage for issuance, verification, and tamper detection', ownerId: userQA.id, progress: 65, status: 'AT_RISK', start: '2026-08-25', end: '2026-09-02' },
    { code: 'M7', name: 'Security Audit & DID Validation', desc: 'Cryptographic hash checks, fraud scoring rules, and penetration review', ownerId: userSecurity.id, progress: 50, status: 'ON_TRACK', start: '2026-08-28', end: '2026-09-05' },
    { code: 'M8', name: 'Docker & Multi-Cloud Deployment', desc: 'Containerization, orchestration scripts, and staging deployment', ownerId: userBackend.id, progress: 40, status: 'ON_TRACK', start: '2026-09-01', end: '2026-09-07' },
    { code: 'M9', name: 'Technical SRS & Compliance Documentation', desc: 'Complete software documentation, user manuals, and API swagger specs', ownerId: userQA.id, progress: 45, status: 'ON_TRACK', start: '2026-09-03', end: '2026-09-09' },
    { code: 'M10', name: 'Live End-to-End Demo Readiness', desc: 'Flawless 5-minute live demo execution with pre-tested credentials', ownerId: userLead.id, progress: 60, status: 'ON_TRACK', start: '2026-09-06', end: '2026-09-12' },
    { code: 'M11', name: 'SIH Grand Finale Presentation Ready', desc: 'Final pitch deck, judge Q&A preparation, and team rehearsals', ownerId: userLead.id, progress: 40, status: 'ON_TRACK', start: '2026-09-08', end: '2026-09-15' },
  ];

  const milestoneMap = new Map<string, string>();
  for (let i = 0; i < milestonesData.length; i++) {
    const m = milestonesData[i];
    const created = await prisma.milestone.create({
      data: {
        projectId: project.id,
        milestoneCode: m.code,
        name: m.name,
        description: m.desc,
        ownerId: m.ownerId,
        progress: m.progress,
        status: m.status,
        startDate: new Date(m.start),
        endDate: new Date(m.end),
        orderIndex: i,
      }
    });
    milestoneMap.set(m.code, created.id);
  }

  // 7. Create Sprints
  const sprint1 = await prisma.sprint.create({
    data: {
      projectId: project.id,
      name: 'Sprint 1: Architecture & Foundation',
      goal: 'Establish baseline repository, architecture specs, Express API structure, and database schema.',
      startDate: new Date('2026-08-01'),
      endDate: new Date('2026-08-14'),
      status: 'COMPLETED',
      progress: 100,
      velocity: 45,
    }
  });

  const sprint2 = await prisma.sprint.create({
    data: {
      projectId: project.id,
      name: 'Sprint 2: Core Integration & Verification',
      goal: 'Deliver smart contract chaincode, student wallet, QR verification portal, and tamper detection heuristics.',
      startDate: new Date('2026-08-15'),
      endDate: new Date('2026-08-31'),
      status: 'ACTIVE',
      progress: 74,
      velocity: 55,
      burndownData: JSON.stringify([
        { day: 'Day 1', remainingPoints: 55, idealPoints: 55 },
        { day: 'Day 3', remainingPoints: 48, idealPoints: 46 },
        { day: 'Day 6', remainingPoints: 36, idealPoints: 34 },
        { day: 'Day 9', remainingPoints: 24, idealPoints: 23 },
        { day: 'Day 12', remainingPoints: 16, idealPoints: 12 },
        { day: 'Day 15', remainingPoints: 12, idealPoints: 0 },
      ]),
    }
  });

  const sprint3 = await prisma.sprint.create({
    data: {
      projectId: project.id,
      name: 'Sprint 3: Hardening, Demo & SIH Pitch',
      goal: 'Finalize automated test suite, execute live demo rehearsals, polish UI aesthetics, and prepare presentation.',
      startDate: new Date('2026-09-01'),
      endDate: new Date('2026-09-15'),
      status: 'PLANNED',
      progress: 0,
      velocity: 40,
    }
  });

  // 8. Create Realistic Tasks with Subtasks & GitHub Links
  const tasksData = [
    {
      taskId: 'TASK-001',
      title: 'Design 4-tier System Architecture Specification',
      desc: 'Define presentation, service, blockchain adapter, and database boundaries for AcadShield.',
      ws: 'WS-02', m: 'M2', sprint: sprint1.id,
      assignee: userLead.id, reporter: userLead.id, reviewer: userBackend.id,
      priority: 'HIGH', status: 'COMPLETED', progress: 100,
      hours: 12, actual: 11, githubPr: 1, githubBranch: 'feature/architecture-spec',
      subtasks: ['Define API boundary', 'Define blockchain adapter interface', 'Review with team']
    },
    {
      taskId: 'TASK-002',
      title: 'Design PostgreSQL Database Schema with Prisma',
      desc: 'Model User, Institution, Student, Credential, Share, VerificationLog, and AuditLog tables.',
      ws: 'WS-06', m: 'M3', sprint: sprint1.id,
      assignee: userBackend.id, reporter: userLead.id, reviewer: userLead.id,
      priority: 'HIGH', status: 'COMPLETED', progress: 100,
      hours: 8, actual: 9, githubPr: 3, githubBranch: 'feature/prisma-schema',
      subtasks: ['Write schema.prisma', 'Create migration script', 'Seed initial institutions']
    },
    {
      taskId: 'TASK-003',
      title: 'Implement JWT Authentication & Role-Based Access Control',
      desc: 'Create secure login endpoints, password hashing with bcrypt, and role middleware for 4 actor roles.',
      ws: 'WS-04', m: 'M3', sprint: sprint1.id,
      assignee: userSecurity.id, reporter: userLead.id, reviewer: userBackend.id,
      priority: 'CRITICAL', status: 'COMPLETED', progress: 100,
      hours: 10, actual: 10, githubPr: 5, githubBranch: 'feature/jwt-rbac',
      subtasks: ['Password hashing helper', 'JWT sign & verify', 'RBAC role middleware']
    },
    {
      taskId: 'TASK-004',
      title: 'Implement Hyperledger Fabric Credential Smart Contract',
      desc: 'Author `credentialContract.js` with `issueCredential`, `verifyCredential`, and `revokeCredential` methods.',
      ws: 'WS-08', m: 'M4', sprint: sprint2.id,
      assignee: userBlockchain.id, reporter: userLead.id, reviewer: userLead.id,
      priority: 'CRITICAL', status: 'IN_PROGRESS', progress: 85,
      hours: 16, actual: 14, githubPr: 12, githubIssue: 24, githubBranch: 'feature/chaincode-contract',
      subtasks: ['Contract initialization', 'issueCredential() logic', 'verifyCredential() hash lookup', 'revokeCredential() state update']
    },
    {
      taskId: 'TASK-005',
      title: 'Build BlockchainService Mock & Gateway Adapters',
      desc: 'Provide seamless in-memory mock ledger mode and pluggable Fabric network gateway connector.',
      ws: 'WS-07', m: 'M4', sprint: sprint2.id,
      assignee: userBlockchain.id, reporter: userBackend.id, reviewer: userBackend.id,
      priority: 'HIGH', status: 'IN_REVIEW', progress: 90,
      hours: 12, actual: 11, githubPr: 15, githubIssue: 25, githubBranch: 'feature/fabric-adapter',
      subtasks: ['Mock ledger memory store', 'Fabric gateway stub', 'Error mapping']
    },
    {
      taskId: 'TASK-006',
      title: 'Develop Credential Issuance Pipeline with SHA-256 Hashing',
      desc: 'Multipart file upload (PDF/PNG), cryptographic SHA-256 digest computation, local/IPFS storage, and blockchain minting.',
      ws: 'WS-05', m: 'M3', sprint: sprint2.id,
      assignee: userBackend.id, reporter: userLead.id, reviewer: userSecurity.id,
      priority: 'CRITICAL', status: 'COMPLETED', progress: 100,
      hours: 14, actual: 13, githubPr: 8, githubIssue: 18, githubBranch: 'feature/issuance-pipeline',
      subtasks: ['Multer upload configuration', 'SHA-256 stream hash computation', 'Storage CID generation', 'Chaincode transaction dispatch']
    },
    {
      taskId: 'TASK-007',
      title: 'Build Multi-Outcome Credential Verification Engine',
      desc: 'Verify credentials via QR token or certificate file, returning VALID, TAMPERED, REVOKED, or NOT_FOUND.',
      ws: 'WS-05', m: 'M5', sprint: sprint2.id,
      assignee: userBackend.id, reporter: userLead.id, reviewer: userLead.id,
      priority: 'CRITICAL', status: 'COMPLETED', progress: 100,
      hours: 10, actual: 9, githubPr: 10, githubIssue: 21, githubBranch: 'feature/verify-api',
      subtasks: ['Hash comparison logic', 'Revocation check', 'Audit trail recording', 'Fraud trigger logging']
    },
    {
      taskId: 'TASK-008',
      title: 'Implement Rule-Based Fraud Detection Heuristics',
      desc: 'Score suspicious verification attempts, repetitive anomalies, tampered hash alerts, and unauthorized issuers.',
      ws: 'WS-04', m: 'M7', sprint: sprint2.id,
      assignee: userSecurity.id, reporter: userLead.id, reviewer: userBackend.id,
      priority: 'HIGH', status: 'IN_PROGRESS', progress: 80,
      hours: 10, actual: 8, githubPr: 14, githubIssue: 29, githubBranch: 'feature/fraud-engine',
      subtasks: ['Risk scoring algorithm', 'Severity classification', 'Admin fraud dashboard feed']
    },
    {
      taskId: 'TASK-009',
      title: 'Develop Student Digital Credential Wallet UI',
      desc: 'Build wallet interface displaying issued degrees, cryptographic badges, and selective sharing token generator.',
      ws: 'WS-10', m: 'M5', sprint: sprint2.id,
      assignee: userFrontend.id, reporter: userLead.id, reviewer: userQA.id,
      priority: 'HIGH', status: 'IN_PROGRESS', progress: 75,
      hours: 14, actual: 10, githubPr: 16, githubIssue: 32, githubBranch: 'feature/student-wallet',
      subtasks: ['Credential card grid', 'Details modal with QR view', 'Selective disclosure toggle form', 'Share link generator']
    },
    {
      taskId: 'TASK-010',
      title: 'Build Employer & Public QR Verification Interface',
      desc: 'Responsive web scanner supporting drag-and-drop certificate verification and instant cryptographic result rendering.',
      ws: 'WS-11', m: 'M5', sprint: sprint2.id,
      assignee: userFrontend.id, reporter: userLead.id, reviewer: userQA.id,
      priority: 'CRITICAL', status: 'IN_PROGRESS', progress: 85,
      hours: 12, actual: 10, githubPr: 18, githubIssue: 35, githubBranch: 'feature/verification-ui',
      subtasks: ['Certificate dropzone', 'QR scanner camera support', 'Color-coded result badge (VALID/TAMPERED/REVOKED)', 'Metadata breakdown table']
    },
    {
      taskId: 'TASK-011',
      title: 'Automated Jest & Supertest Verification Suite',
      desc: 'Comprehensive API unit and integration tests for login, RBAC, valid verification, tamper detection, and revocation.',
      ws: 'WS-12', m: 'M6', sprint: sprint2.id,
      assignee: userQA.id, reporter: userLead.id, reviewer: userLead.id,
      priority: 'HIGH', status: 'BLOCKED', progress: 60,
      hours: 16, actual: 10, githubPr: 19, githubIssue: 38, githubBranch: 'feature/automated-tests',
      subtasks: ['Auth unit tests', 'Issuance integration test', 'Tamper detection assertions', 'Revocation flow assertions']
    },
    {
      taskId: 'TASK-012',
      title: 'Author Comprehensive Software Requirements Specification (SRS)',
      desc: 'Draft IEEE-format SRS with functional and non-functional requirements, data dictionaries, and sequence diagrams.',
      ws: 'WS-14', m: 'M9', sprint: sprint3.id,
      assignee: userQA.id, reporter: userLead.id, reviewer: userLead.id,
      priority: 'MEDIUM', status: 'TODO', progress: 40,
      hours: 14, actual: 5,
      subtasks: ['Introduction & problem scope', 'Use case specifications', 'Data flow architecture diagrams']
    },
    {
      taskId: 'TASK-013',
      title: 'Prepare 10-Slide SIH Final Presentation Deck',
      desc: 'Create pitch presentation covering problem statement, blockchain innovation, market size, business model, and live demo hook.',
      ws: 'WS-15', m: 'M11', sprint: sprint3.id,
      assignee: userLead.id, reporter: userLead.id, reviewer: userQA.id,
      priority: 'CRITICAL', status: 'IN_PROGRESS', progress: 60,
      hours: 12, actual: 7,
      subtasks: ['Problem & Market slide', 'Technical Architecture slide', 'Live Demo roadmap', 'Competitive differentiation']
    },
    {
      taskId: 'TASK-014',
      title: 'Execute Live Demo Script & Edge-Case Rehearsals',
      desc: 'Run end-to-end rehearsal showing certificate issuance, wallet receipt, valid verification, tampered certificate detection, and revocation.',
      ws: 'WS-16', m: 'M10', sprint: sprint3.id,
      assignee: userLead.id, reporter: userLead.id, reviewer: userQA.id,
      priority: 'HIGH', status: 'TODO', progress: 50,
      hours: 8, actual: 4,
      subtasks: ['Issue test certificate', 'Verify valid credential CRD-2026-0001', 'Verify tampered credential CRD-2026-0003', 'Verify revoked credential CRD-2025-0099']
    },
  ];

  const taskMap = new Map<string, string>();
  for (const t of tasksData) {
    const task = await prisma.task.create({
      data: {
        taskId: t.taskId,
        projectId: project.id,
        workstreamId: workstreamMap.get(t.ws),
        milestoneId: milestoneMap.get(t.m),
        sprintId: t.sprint,
        title: t.title,
        description: t.desc,
        assigneeId: t.assignee,
        reporterId: t.reporter,
        reviewerId: t.reviewer,
        priority: t.priority,
        status: t.status,
        progress: t.progress,
        estimatedHours: t.hours,
        actualHours: t.actual,
        githubPrNumber: t.githubPr,
        githubIssueNumber: t.githubIssue,
        githubBranch: t.githubBranch,
        startDate: new Date('2026-08-10'),
        dueDate: t.status === 'COMPLETED' ? new Date('2026-08-20') : new Date('2026-08-31'),
      }
    });
    taskMap.set(t.taskId, task.id);

    if (t.subtasks && t.subtasks.length > 0) {
      for (let sIdx = 0; sIdx < t.subtasks.length; sIdx++) {
        const isComp = t.progress === 100 || (t.progress > 50 && sIdx < 2);
        await prisma.subtask.create({
          data: {
            taskId: task.id,
            title: t.subtasks[sIdx],
            completed: isComp,
            completedAt: isComp ? new Date() : null,
            orderIndex: sIdx,
          }
        });
      }
    }
  }

  // 9. Create Active Blockers
  const blockedTask = await prisma.task.findUnique({ where: { taskId: 'TASK-011' } });
  if (blockedTask) {
    await prisma.blocker.create({
      data: {
        blockerId: 'BLK-001',
        projectId: project.id,
        taskId: blockedTask.id,
        title: 'Verification API test blocked on Fabric mock adapter edge-case',
        description: 'Supertest assertions for concurrent revocation state sync in mock BlockchainService are failing due to async lock timing.',
        reportedById: userQA.id,
        blockingUserId: userBlockchain.id,
        priority: 'CRITICAL',
        status: 'OPEN',
        expectedResolution: 'Patch async lock mutex in BlockchainService.mock.js',
      }
    });
  }

  // 10. Create GitHub Repository & Mock/Live Activity
  const ghRepo = await prisma.gitHubRepo.create({
    data: {
      projectId: project.id,
      repoName: 'vishanth11/AcadShield',
      repoUrl: 'https://github.com/vishanth11/AcadShield.git',
      defaultBranch: 'main',
      isSyncing: false,
      lastSyncedAt: new Date(),
    }
  });

  const commitsData = [
    { sha: '040034f8a129', msg: 'feat: initial AcadShield prototype with blockchain & storage adapters', author: 'vishanth11', email: 'lead@sihflow.io', date: new Date('2026-08-12T10:30:00Z') },
    { sha: 'b712fa90e341', msg: 'feat(chaincode): add issueCredential, verifyCredential, revokeCredential logic', author: 'vikas-blockchain', email: 'blockchain@sihflow.io', date: new Date('2026-08-18T14:15:00Z') },
    { sha: 'e89a31bc4789', msg: 'feat(auth): implement JWT token signing & RBAC role guards', author: 'ananya-sec', email: 'security@sihflow.io', date: new Date('2026-08-20T11:45:00Z') },
    { sha: 'c45b892e1098', msg: 'feat(api): connect SHA-256 certificate hashing to multer upload stream', author: 'rohan-backend', email: 'backend@sihflow.io', date: new Date('2026-08-22T16:20:00Z') },
    { sha: 'f901123da456', msg: 'feat(wallet): build student wallet view and selective sharing tokens', author: 'sneha-frontend', email: 'frontend@sihflow.io', date: new Date('2026-08-25T09:10:00Z') },
    { sha: 'a34890ef1234', msg: 'test(api): add unit and integration test assertions for tamper detection', author: 'kavya-qa', email: 'qa@sihflow.io', date: new Date('2026-08-27T13:40:00Z') },
  ];

  for (const c of commitsData) {
    await prisma.gitHubCommit.create({
      data: {
        repoId: ghRepo.id,
        sha: c.sha,
        message: c.msg,
        authorName: c.author,
        authorEmail: c.email,
        commitDate: c.date,
        branch: 'main',
        url: `https://github.com/vishanth11/AcadShield/commit/${c.sha}`,
        stats: JSON.stringify({ additions: 85, deletions: 12 }),
      }
    });
  }

  // Pull Requests
  const pr1 = await prisma.gitHubPullRequest.create({
    data: {
      repoId: ghRepo.id,
      prNumber: 15,
      title: 'feat(blockchain): implement Fabric network adapter and mock ledger boundary',
      body: 'Closes #25. Adds isolated adapter boundary allowing switching between mock memory ledger and live Fabric Gateway.',
      state: 'OPEN',
      authorName: 'vikas-blockchain',
      headBranch: 'feature/fabric-adapter',
      baseBranch: 'main',
      url: 'https://github.com/vishanth11/AcadShield/pull/15',
      reviewsCount: 1,
    }
  });

  await prisma.gitHubReview.create({
    data: {
      pullRequestId: pr1.id,
      reviewerName: 'Harish R (Lead)',
      state: 'APPROVED',
      body: 'Architecture boundary looks solid. Ready for test suite integration.',
    }
  });

  const pr2 = await prisma.gitHubPullRequest.create({
    data: {
      repoId: ghRepo.id,
      prNumber: 16,
      title: 'feat(wallet): student credential wallet and selective sharing UI',
      body: 'Closes #32. Adds React components for credential display, QR modal, and selective attribute token generator.',
      state: 'OPEN',
      authorName: 'sneha-frontend',
      headBranch: 'feature/student-wallet',
      baseBranch: 'main',
      url: 'https://github.com/vishanth11/AcadShield/pull/16',
      reviewsCount: 0,
    }
  });

  // Issues
  await prisma.gitHubIssue.create({
    data: {
      repoId: ghRepo.id,
      issueNumber: 24,
      title: 'Implement revokeCredential() in smart contract with reason code',
      body: 'Universities need the capability to invalidate compromised or fake degrees with immutable audit records.',
      state: 'OPEN',
      authorName: 'Harish R (Lead)',
      url: 'https://github.com/vishanth11/AcadShield/issues/24',
    }
  });

  await prisma.gitHubIssue.create({
    data: {
      repoId: ghRepo.id,
      issueNumber: 38,
      title: 'Fix concurrent mock blockchain transaction race condition during Supertest runs',
      body: 'Associated with Blocker BLK-001. Multiple parallel test cases occasionally read stale mock ledger state.',
      state: 'OPEN',
      authorName: 'Kavya Nair',
      url: 'https://github.com/vishanth11/AcadShield/issues/38',
    }
  });

  // 11. Meetings
  const meeting = await prisma.meeting.create({
    data: {
      projectId: project.id,
      title: 'SIH Team Sync #8: Blockchain Integration & Live Demo Prep',
      date: new Date('2026-08-28T18:00:00Z'),
      time: '6:00 PM IST',
      durationMinutes: 50,
      agenda: '1. Hyperledger Fabric adapter readiness\n2. Verification UI performance\n3. Resolving test blockage\n4. Rehearsal schedule',
      notes: 'Team agreed to freeze the credential schema and focus on completing the automated test suite before the weekend demo rehearsal.',
      decisions: 'Freeze JSON and Prisma credential models. Prioritize unblocking QA test assertions.',
      meetingLink: 'https://meet.google.com/sih-acadshield-sync',
      actionItems: {
        create: [
          { title: 'Patch mock ledger mutex lock in BlockchainService', assigneeId: userBlockchain.id, dueDate: new Date('2026-08-30') },
          { title: 'Complete employer verification QR scanning tests', assigneeId: userQA.id, dueDate: new Date('2026-08-31') },
          { title: 'Review and merge PR #16 for Student Wallet', assigneeId: userLead.id, dueDate: new Date('2026-08-29') },
        ]
      }
    }
  });

  // 12. Documents
  const docsData = [
    { name: 'AcadShield - Software Requirements Specification (SRS)', cat: 'SRS', ver: 'v1.2', url: '/docs/srs.pdf', size: 1450000, owner: userQA.id, status: 'IN_REVIEW', revStatus: 'PENDING' },
    { name: 'System Architecture & Security Blueprint', cat: 'Architecture', ver: 'v1.0', url: '/docs/architecture.pdf', size: 2100000, owner: userLead.id, status: 'APPROVED', revStatus: 'APPROVED' },
    { name: 'Hyperledger Fabric Chaincode Specification', cat: 'Smart Contract', ver: 'v1.1', url: '/docs/smart-contracts.pdf', size: 890000, owner: userBlockchain.id, status: 'APPROVED', revStatus: 'APPROVED' },
    { name: 'SIH Grand Finale Presentation Pitch Deck', cat: 'PPT', ver: 'v2.0', url: '/docs/pitch-deck.pdf', size: 5400000, owner: userLead.id, status: 'DRAFT', revStatus: 'PENDING' },
    { name: 'Live Demonstration Step-by-Step Script', cat: 'Demo Script', ver: 'v1.0', url: '/docs/demo-script.pdf', size: 450000, owner: userLead.id, status: 'APPROVED', revStatus: 'APPROVED' },
  ];

  for (const d of docsData) {
    await prisma.document.create({
      data: {
        projectId: project.id,
        name: d.name,
        category: d.cat,
        version: d.ver,
        fileUrl: d.url,
        fileSize: d.size,
        ownerId: d.owner,
        status: d.status,
        reviewStatus: d.revStatus,
      }
    });
  }

  // 13. Risks
  const risksData = [
    { title: 'Hyperledger Fabric latency under high concurrent verifications', desc: 'Real peer consensus roundtrip might exceed 2 seconds during peak employer verifications.', prob: 'HIGH', imp: 'HIGH', sev: 'HIGH', owner: userBlockchain.id, mit: 'Implement Redis caching for verified immutable certificate root hashes.', status: 'MITIGATING' },
    { title: 'Offline demo environment connectivity constraints during SIH evaluation', desc: 'Venue WiFi may be congested or unstable during final judging rounds.', prob: 'HIGH', imp: 'CRITICAL', sev: 'CRITICAL', owner: userLead.id, mit: 'Provide zero-dependency containerized local demo mode with seeded certificates.', status: 'RESOLVED' },
    { title: 'Selective disclosure token tampering vulnerability', desc: 'Attacker altering URL hash parameters to reveal unshared attributes.', prob: 'LOW', imp: 'HIGH', sev: 'MEDIUM', owner: userSecurity.id, mit: 'Sign selective disclosure tokens with HMAC-SHA256 and 1-hour expiration.', status: 'RESOLVED' },
  ];

  for (const r of risksData) {
    await prisma.risk.create({
      data: {
        projectId: project.id,
        title: r.title,
        description: r.desc,
        probability: r.prob,
        impact: r.imp,
        severity: r.sev,
        ownerId: r.owner,
        mitigation: r.mit,
        status: r.status,
      }
    });
  }

  // 14. Bugs
  await prisma.bug.create({
    data: {
      bugId: 'BUG-001',
      projectId: project.id,
      title: 'QR camera scanner freezes on low-light camera feeds in Firefox',
      description: 'The html5-qrcode video stream fails to decode inverted QR codes in dark environments.',
      severity: 'MEDIUM',
      priority: 'HIGH',
      reporterId: userQA.id,
      assigneeId: userFrontend.id,
      environment: 'Frontend / Firefox 128',
      stepsToReproduce: '1. Open /verify on Firefox with webcam in dim lighting. 2. Present QR code.',
      expectedResult: 'Instant credential ID decode.',
      actualResult: 'Video stream pauses without emitting decode event.',
      status: 'IN_PROGRESS',
    }
  });

  // 15. Test Cases
  const testCasesData = [
    { id: 'TC-001', feat: 'Credential Issuance', desc: 'Verify PDF upload generates valid SHA-256 and records mock blockchain transaction', steps: '1. Login as University. 2. Upload cert.pdf. 3. Submit.', exp: 'Status code 201 with documentHash and txId', status: 'PASS', tester: userQA.id },
    { id: 'TC-002', feat: 'Tamper Detection', desc: 'Verify modified certificate byte results in TAMPERED outcome', steps: '1. Alter 1 byte in certificate. 2. Verify against CRD-2026-0003.', exp: 'Result is TAMPERED with risk score > 80', status: 'PASS', tester: userQA.id },
    { id: 'TC-003', feat: 'Credential Revocation', desc: 'Verify revoked credential CRD-2025-0099 returns REVOKED status', steps: '1. Query verification for revoked ID.', exp: 'Result is REVOKED with revocationReason', status: 'PASS', tester: userQA.id },
    { id: 'TC-004', feat: 'Selective Sharing', desc: 'Verify student share link reveals only permitted fields', steps: '1. Generate share link omitting GPA. 2. Open verifier view.', exp: 'GPA field is masked/omitted', status: 'PASS', tester: userQA.id },
    { id: 'TC-005', feat: 'Fraud Engine Alerting', desc: 'Verify 5 rapid failed verifications triggers High Risk Fraud Event', steps: '1. Attempt 5 invalid hashes in 10 seconds.', exp: 'Fraud event logged in admin audit table', status: 'PASS', tester: userSecurity.id },
  ];

  for (const tc of testCasesData) {
    await prisma.testCase.create({
      data: {
        testCaseId: tc.id,
        projectId: project.id,
        feature: tc.feat,
        description: tc.desc,
        steps: tc.steps,
        expectedResult: tc.exp,
        status: tc.status,
        testerId: tc.tester,
        executionDate: new Date(),
      }
    });
  }

  // 16. SIH Readiness Items (14 Categories)
  const readinessData = [
    { cat: 'Problem Understanding', name: 'Problem Statement & Stakeholder Mapping', weight: 10, prog: 100, owner: userLead.id, stat: 'COMPLETED', ev: 'Documented fake degree prevalence and UGC compliance specs' },
    { cat: 'Research', name: 'Cryptographic & Blockchain Feasibility Analysis', weight: 8, prog: 100, owner: userLead.id, stat: 'COMPLETED', ev: 'Benchmarked SHA-256 vs SHA-3 and Hyperledger vs Ethereum gas models' },
    { cat: 'Architecture', name: '4-Tier Layered Architecture Blueprint', weight: 10, prog: 100, owner: userLead.id, stat: 'COMPLETED', ev: 'Architecture diagram, sequence flows, and API specs frozen' },
    { cat: 'Prototype', name: 'Functional Working Prototype', weight: 12, prog: 90, owner: userLead.id, stat: 'IN_PROGRESS', ev: 'Complete working end-to-end issuance and verification prototype' },
    { cat: 'Backend', name: 'Express REST API & Database Layer', weight: 10, prog: 90, owner: userBackend.id, stat: 'IN_PROGRESS', ev: 'Full auth, issuance, revocation, and verification REST endpoints live' },
    { cat: 'Frontend', name: 'React SPA & Responsive UI System', weight: 10, prog: 85, owner: userFrontend.id, stat: 'IN_PROGRESS', ev: 'Modern dark/light UI, student wallet, QR scanner, and admin views' },
    { cat: 'Blockchain', name: 'Hyperledger Fabric Chaincode & Ledger Adapter', weight: 10, prog: 80, owner: userBlockchain.id, stat: 'IN_PROGRESS', ev: 'Smart contract logic tested with mock and gateway connectors' },
    { cat: 'Security', name: 'DID, Cryptography & Fraud Risk Engine', weight: 8, prog: 85, owner: userSecurity.id, stat: 'IN_PROGRESS', ev: 'Zero-PII ledger privacy, SHA-256 digests, and heuristic fraud alerts' },
    { cat: 'Integration', name: 'Cross-Tier End-to-End Wiring', weight: 8, prog: 75, owner: userLead.id, stat: 'IN_PROGRESS', ev: 'Frontend connected to backend APIs with live status feedback' },
    { cat: 'Testing', name: 'Automated Test Suites & Edge Cases', weight: 8, prog: 70, owner: userQA.id, stat: 'IN_PROGRESS', ev: 'Jest/Supertest coverage for Valid, Tampered, and Revoked flows' },
    { cat: 'Documentation', name: 'SRS, API Reference & User Manuals', weight: 6, prog: 75, owner: userQA.id, stat: 'IN_PROGRESS', ev: 'Comprehensive markdown documentation and PDF artifacts' },
    { cat: 'Deployment', name: 'Docker Containerization & Staging Setup', weight: 6, prog: 70, owner: userBackend.id, stat: 'IN_PROGRESS', ev: 'docker-compose.yml with multi-container orchestration' },
    { cat: 'Presentation', name: 'Pitch Deck & Judge Q&A Strategy', weight: 8, prog: 65, owner: userLead.id, stat: 'IN_PROGRESS', ev: '10-slide high impact deck and market scalability analysis' },
    { cat: 'Demo', name: 'Flawless 5-Minute Live Demo Execution', weight: 12, prog: 80, owner: userLead.id, stat: 'IN_PROGRESS', ev: 'Pre-seeded demo credentials and predictable live test runs' },
  ];

  for (let i = 0; i < readinessData.length; i++) {
    const rd = readinessData[i];
    await prisma.readinessItem.create({
      data: {
        projectId: project.id,
        category: rd.cat,
        name: rd.name,
        description: rd.ev || rd.name,
        weight: rd.weight,
        progress: rd.prog,
        ownerId: rd.owner,
        status: rd.stat,
        evidence: rd.ev,
        orderIndex: i,
      }
    });
  }

  // 17. Demo Checklist Items (14 Scenarios)
  const demoItemsData = [
    { code: 'DEMO-01', cat: 'Authentication', title: 'University Issuer Login', desc: 'Login as admin@abcu.edu with password Demo@123', owner: userBackend.id, status: 'PASS' },
    { code: 'DEMO-02', cat: 'Identity & RBAC', title: 'Role Access Guard Enforcement', desc: 'Verify Student cannot access University Issuance endpoint', owner: userSecurity.id, status: 'PASS' },
    { code: 'DEMO-03', cat: 'Credential Issuance', title: 'Certificate Upload & SHA-256 Hashing', desc: 'Upload PDF certificate and observe instant hash digest generation', owner: userBackend.id, status: 'PASS' },
    { code: 'DEMO-04', cat: 'Blockchain & Ledger', title: 'Mock/Fabric Blockchain Transaction Record', desc: 'Observe transaction ID and timestamp written to immutable ledger', owner: userBlockchain.id, status: 'PASS' },
    { code: 'DEMO-05', cat: 'Credential Issuance', title: 'QR Code Generation & Embedding', desc: 'Verify QR code encodes public verification URL with credential ID', owner: userFrontend.id, status: 'PASS' },
    { code: 'DEMO-06', cat: 'Wallet & Sharing', title: 'Student Digital Wallet Receipt', desc: 'Login as student@example.com and view newly issued credential', owner: userFrontend.id, status: 'PASS' },
    { code: 'DEMO-07', cat: 'Wallet & Sharing', title: 'Selective Attribute Disclosure Link', desc: 'Generate token link exposing degree only, omitting confidential GPA', owner: userSecurity.id, status: 'PASS' },
    { code: 'DEMO-08', cat: 'Employer Verification', title: 'Valid Credential Verification (CRD-2026-0001)', desc: 'Scan QR and verify green VALID badge with matching document hash', owner: userLead.id, status: 'PASS' },
    { code: 'DEMO-09', cat: 'Employer Verification', title: 'Tamper Detection Verification (CRD-2026-0003)', desc: 'Upload modified certificate and verify red TAMPERED badge with hash mismatch', owner: userLead.id, status: 'PASS' },
    { code: 'DEMO-10', cat: 'Employer Verification', title: 'Revoked Credential Verification (CRD-2025-0099)', desc: 'Verify amber REVOKED badge with timestamped revocation reason', owner: userLead.id, status: 'PASS' },
    { code: 'DEMO-11', cat: 'Security & Fraud', title: 'Real-Time Fraud Risk Scoring Spike', desc: 'Observe fraud engine risk score calculation in Admin Dashboard', owner: userSecurity.id, status: 'PASS' },
    { code: 'DEMO-12', cat: 'Administration', title: 'Immutable Verification Audit Trail', desc: 'Inspect verifier IP address, timestamp, and result in audit log', owner: userBackend.id, status: 'PASS' },
    { code: 'DEMO-13', cat: 'Administration', title: 'University Credential Revocation Workflow', desc: 'Execute live revocation from University portal and re-verify', owner: userLead.id, status: 'PASS' },
    { code: 'DEMO-14', cat: 'Presentation', title: 'Offline Fallback & Zero-Cloud Guarantee', desc: 'Demonstrate system operating seamlessly in isolated offline container', owner: userLead.id, status: 'PASS' },
  ];

  for (let i = 0; i < demoItemsData.length; i++) {
    const item = demoItemsData[i];
    await prisma.demoChecklistItem.create({
      data: {
        projectId: project.id,
        category: item.cat,
        itemCode: item.code,
        title: item.title,
        description: item.desc,
        ownerId: item.owner,
        status: item.status,
        lastTestedAt: new Date(),
        orderIndex: i,
      }
    });
  }

  // 18. Initial Activity Logs
  const initialActivities = [
    { user: userLead.id, type: 'TASK_COMPLETED', entity: 'TASK', entityId: taskMap.get('TASK-001'), summary: 'Team Lead completed TASK-001: "Design 4-tier System Architecture Specification"' },
    { user: userBackend.id, type: 'TASK_COMPLETED', entity: 'TASK', entityId: taskMap.get('TASK-002'), summary: 'Backend Engineer completed TASK-002: "Design PostgreSQL Database Schema with Prisma"' },
    { user: userSecurity.id, type: 'TASK_COMPLETED', entity: 'TASK', entityId: taskMap.get('TASK-003'), summary: 'Identity & Security Engineer completed TASK-003: "Implement JWT Authentication & RBAC"' },
    { user: userBlockchain.id, type: 'PR_OPENED', entity: 'GITHUB', entityId: pr1.id, summary: 'Blockchain Engineer opened PR #15: "feat(blockchain): implement Fabric network adapter"' },
    { user: userLead.id, type: 'PR_REVIEWED', entity: 'GITHUB', entityId: pr1.id, summary: 'Team Lead approved PR #15 after architectural review' },
    { user: userFrontend.id, type: 'PR_OPENED', entity: 'GITHUB', entityId: pr2.id, summary: 'Frontend Engineer opened PR #16: "feat(wallet): student credential wallet UI"' },
    { user: userQA.id, type: 'BLOCKER_REPORTED', entity: 'BLOCKER', summary: '🚨 QA Lead reported blocker BLK-001: "Verification API test blocked on Fabric mock adapter"' },
    { user: userLead.id, type: 'MEETING_LOGGED', entity: 'MEETING', entityId: meeting.id, summary: 'Team Lead logged meeting: "SIH Team Sync #8: Blockchain Integration & Live Demo Prep"' },
  ];

  for (const act of initialActivities) {
    await prisma.activityLog.create({
      data: {
        projectId: project.id,
        userId: act.user,
        eventType: act.type,
        entityType: act.entity,
        entityId: act.entityId,
        summary: act.summary,
      }
    });
  }

  console.log('✅ SihFlow ERP database seeded successfully with AcadShield SIH team data!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
