import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  jwtSecret: process.env.JWT_SECRET || 'sihflow_erp_ultra_secure_jwt_secret_key_2026_acadshield',
  demoMode: process.env.DEMO_MODE !== 'false',
  githubRepoUrl: process.env.GITHUB_REPO_URL || 'https://github.com/vishanth11/AcadShield.git',
  githubToken: process.env.GITHUB_TOKEN || '',
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};
