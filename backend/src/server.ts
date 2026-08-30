import { app } from './app.js';
import { config } from './config/index.js';

const server = app.listen(config.port, () => {
  console.log(`=======================================================`);
  console.log(`🚀 SihFlow ERP Backend API is running on port ${config.port}`);
  console.log(`📊 Mode: ${config.demoMode ? 'DEMO MODE (Active)' : 'PRODUCTION'}`);
  console.log(`🎯 Target Project: AcadShield (${config.githubRepoUrl})`);
  console.log(`🔗 API Health: http://localhost:${config.port}/api/health`);
  console.log(`=======================================================`);
});

export default server;
