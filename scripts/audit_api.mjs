import http from 'http';

const endpoints = [
  '/api/v1/health',
  '/api/v1/projects',
  '/api/v1/team',
  '/api/v1/tasks',
  '/api/v1/milestones',
  '/api/v1/activity',
  '/api/v1/blockers',
  '/api/v1/github/status',
  '/api/v1/meetings',
  '/api/v1/documents',
  '/api/v1/testing/test-cases',
  '/api/v1/bugs',
  '/api/v1/analytics/dashboard',
  '/api/v1/readiness/sih',
  '/api/v1/notifications',
];

async function checkEndpoint(path) {
  return new Promise((resolve) => {
    http.get({ host: 'localhost', port: 5000, path }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ path, statusCode: res.statusCode, success: json.success });
        } catch {
          resolve({ path, statusCode: res.statusCode, success: false });
        }
      });
    }).on('error', (err) => {
      resolve({ path, error: err.message, success: false });
    });
  });
}

async function runAudit() {
  console.log('--- SihFlow ERP 15 Core Modules API Audit ---');
  let passCount = 0;
  for (const ep of endpoints) {
    const result = await checkEndpoint(ep);
    const passed = result.statusCode === 200 && result.success === true;
    if (passed) passCount++;
    console.log(`${passed ? '✅ [PASS]' : '❌ [FAIL]'} ${ep} -> Status ${result.statusCode}, Success: ${result.success}`);
  }
  console.log(`\nAudit Result: ${passCount}/${endpoints.length} endpoints passed.`);
}

runAudit();
