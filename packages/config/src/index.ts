export const APP_CONFIG = {
  name: 'SihFlow ERP',
  version: '2.0.0',
  description: 'SIH Internal Project Management System',
  targetProject: {
    id: 'proj-acadshield-001',
    name: 'AcadShield',
    problemStatementNumber: '1422',
    problemStatement: 'Blockchain-based Academic Credential Verification System with Decentralized Identity & Fraud Detection',
    repositoryUrl: 'https://github.com/vishanth11/AcadShield.git',
  },
  apiPrefix: '/api/v1',
  defaultPort: 5000,
  defaultWebPort: 5173,
} as const;

export const TEAM_ROSTER = [
  { id: 'usr-lead-001', name: 'Member 1', role: 'TEAM_LEAD', teamRole: 'Team Lead', email: 'lead@sihflow.io', branch: 'feature/integration' },
  { id: 'usr-github-002', name: 'Member 2', role: 'TEAM_MEMBER', teamRole: 'GitHub / Developer Activity', email: 'github@sihflow.io', branch: 'feature/github' },
  { id: 'usr-sec-003', name: 'Member 3', role: 'TEAM_MEMBER', teamRole: 'Authentication / Security', email: 'security@sihflow.io', branch: 'feature/auth-security' },
  { id: 'usr-backend-004', name: 'Member 4', role: 'TEAM_MEMBER', teamRole: 'Backend / Database', email: 'backend@sihflow.io', branch: 'feature/backend' },
  { id: 'usr-front-005', name: 'Member 5', role: 'TEAM_MEMBER', teamRole: 'Frontend', email: 'frontend@sihflow.io', branch: 'feature/frontend' },
  { id: 'usr-qa-006', name: 'Member 6', role: 'REVIEWER', teamRole: 'QA / UI-UX / Documentation', email: 'qa@sihflow.io', branch: 'feature/qa-docs' },
] as const;

export const DEFAULT_WORKSTREAMS = [
  'Research & Problem Understanding',
  'Architecture',
  'DID & Identity',
  'RBAC & Security',
  'Backend',
  'Database',
  'Blockchain',
  'Smart Contracts',
  'Frontend',
  'Wallet',
  'QR Verification',
  'Testing',
  'Integration',
  'Documentation',
  'Presentation',
  'Demo Preparation',
  'Deployment',
] as const;

export const DEFAULT_MILESTONES = [
  { code: 'M1', name: 'Problem Understanding', description: 'Deep dive into SIH Problem Statement #1422 requirements, stakeholders, and workflow.' },
  { code: 'M2', name: 'Architecture', description: 'System architecture freeze, sequence diagrams, database schemas, and threat modeling.' },
  { code: 'M3', name: 'Core Development', description: 'Implementation of core credential issuance, hashing, and database storage.' },
  { code: 'M4', name: 'Blockchain Integration', description: 'Hyperledger Fabric network setup, chaincode smart contract deployment, and adapter.' },
  { code: 'M5', name: 'Frontend + Backend Integration', description: 'Issuer dashboard, Student credential wallet, and public verification UI integration.' },
  { code: 'M6', name: 'Testing', description: 'Unit testing, integration testing, Supertest suites, and load test scripts.' },
  { code: 'M7', name: 'Security Validation', description: 'Tamper proof tests, replay attack prevention, RBAC audit, and Merkle root verification.' },
  { code: 'M8', name: 'Deployment', description: 'Docker containerization, Docker-Compose multi-container orchestration, and reverse proxy.' },
  { code: 'M9', name: 'Documentation', description: 'Software Requirements Specification (SRS), API documentation, User Guide, and Demo script.' },
  { code: 'M10', name: 'Final Demo', description: 'End-to-end dry runs of live jury evaluation scenarios with zero fail rates.' },
  { code: 'M11', name: 'SIH Presentation', description: 'Grand Finale pitch deck, value proposition slides, and architectural presentation.' },
] as const;
