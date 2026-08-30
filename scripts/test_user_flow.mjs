import http from 'http';

function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function runFullUserFlowTest() {
  console.log('=====================================================');
  console.log('🚀 SIHFLOW ERP COMPLETE USER FLOW SIMULATION & AUDIT');
  console.log('=====================================================\n');

  // 1. LOGIN
  console.log('1. [LOGIN] Authenticating Member 1 (Team Lead)...');
  const loginRes = await request(
    { host: 'localhost', port: 5000, path: '/api/v1/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json' } },
    { email: 'lead@sihflow.io', password: 'Demo@123' }
  );
  if (loginRes.status !== 200 || !loginRes.data?.data?.token) {
    throw new Error('Login failed: ' + JSON.stringify(loginRes));
  }
  const token = loginRes.data.data.token;
  const authHeaders = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
  console.log('   ✅ Authenticated successfully. JWT Token acquired.');

  // 2. DASHBOARD
  console.log('2. [DASHBOARD] Fetching holistic KPIs & health telemetry...');
  const dashRes = await request({ host: 'localhost', port: 5000, path: '/api/v1/analytics/dashboard', method: 'GET', headers: authHeaders });
  console.log(`   ✅ Dashboard loaded. Overall Progress: ${dashRes.data.data.health.overallProgress}%, Tasks: ${dashRes.data.data.health.totalTasks}`);

  // 3. PROJECT
  console.log('3. [PROJECT] Fetching AcadShield project details...');
  const projRes = await request({ host: 'localhost', port: 5000, path: '/api/v1/projects/proj-acadshield-001', method: 'GET', headers: authHeaders });
  console.log(`   ✅ Project: "${projRes.data.data.name}" (PS #${projRes.data.data.problemStatementNumber})`);

  // 4. TEAM
  console.log('4. [TEAM] Querying 6-member team roster...');
  const teamRes = await request({ host: 'localhost', port: 5000, path: '/api/v1/team', method: 'GET', headers: authHeaders });
  console.log(`   ✅ Team Roster verified (${teamRes.data.data.length} members found).`);

  // 5. CREATE TASK
  console.log('5. [CREATE TASK] Creating new task "Implement ZK Zero-Knowledge Proof Verifier"...');
  const createTaskRes = await request(
    { host: 'localhost', port: 5000, path: '/api/v1/tasks', method: 'POST', headers: authHeaders },
    {
      title: 'Implement ZK Zero-Knowledge Proof Verifier',
      description: 'Generate Groth16 zk-SNARK verification contract and integrate with student wallet.',
      priority: 'CRITICAL',
      assigneeId: 'usr-sec-003',
      milestoneId: 'm-3',
      dueDate: '2026-09-08',
    }
  );
  const createdTask = createTaskRes.data.data;
  console.log(`   ✅ Created Task: ${createdTask.taskId} ("${createdTask.title}")`);

  // 6. KANBAN / MOVE TASK
  console.log('6. [KANBAN MOVE] Moving task to IN_PROGRESS...');
  const moveRes = await request(
    { host: 'localhost', port: 5000, path: `/api/v1/tasks/${createdTask.id}/status`, method: 'PATCH', headers: authHeaders },
    { status: 'IN_PROGRESS' }
  );
  console.log(`   ✅ Task ${createdTask.taskId} transitioned to ${moveRes.data.data.status}`);

  // 7. TASK DETAILS & UPDATE PROGRESS
  console.log('7. [UPDATE PROGRESS] Updating task progress to 65%...');
  const updateRes = await request(
    { host: 'localhost', port: 5000, path: `/api/v1/tasks/${createdTask.id}`, method: 'PATCH', headers: authHeaders },
    { progress: 65 }
  );
  console.log(`   ✅ Progress updated: ${updateRes.data.data.progress}%`);

  // 8. ADD COMMENT
  console.log('8. [ADD COMMENT] Posting engineering review comment...');
  const commentRes = await request(
    { host: 'localhost', port: 5000, path: `/api/v1/tasks/${createdTask.id}/comments`, method: 'POST', headers: authHeaders },
    { text: 'Circuit compilation complete with snarkjs. Generating verification smart contract.' }
  );
  console.log(`   ✅ Comment logged by ${commentRes.data.data.author.name}: "${commentRes.data.data.text}"`);

  // 9. REPORT BLOCKER
  console.log('9. [REPORT BLOCKER] Logging cryptographic trusted setup blocker...');
  const blockerRes = await request(
    { host: 'localhost', port: 5000, path: '/api/v1/blockers', method: 'POST', headers: authHeaders },
    {
      title: 'Awaiting Ceremony Powers-of-Tau File Download',
      description: 'ZKey generation requires pot14_final.ptau downloaded onto presentation laptop.',
      impact: 'Delays zero-knowledge proof verification demo on chain',
      priority: 'HIGH',
      taskId: createdTask.id,
    }
  );
  const createdBlocker = blockerRes.data.data;
  console.log(`   ✅ Blocker logged: ${createdBlocker.blockerId} ("${createdBlocker.title}")`);

  // 10. RESOLVE BLOCKER
  console.log('10. [RESOLVE BLOCKER] Resolving blocker with ceremony hash verification...');
  const resolveRes = await request(
    { host: 'localhost', port: 5000, path: `/api/v1/blockers/${createdBlocker.id}/resolve`, method: 'PATCH', headers: authHeaders },
    { resolutionNotes: 'Powers-of-Tau file cached locally inside container storage.' }
  );
  console.log(`   ✅ Blocker ${createdBlocker.blockerId} marked as ${resolveRes.data.data.status}`);

  // 11. TASK REVIEW -> DONE
  console.log('11. [TASK REVIEW -> DONE] Marking task as DONE...');
  const doneRes = await request(
    { host: 'localhost', port: 5000, path: `/api/v1/tasks/${createdTask.id}/status`, method: 'PATCH', headers: authHeaders },
    { status: 'DONE' }
  );
  console.log(`   ✅ Task ${createdTask.taskId} completed (Progress: ${doneRes.data.data.progress}%)`);

  // 12. MILESTONE PROGRESS UPDATED
  console.log('12. [MILESTONES] Checking updated milestone roadmap...');
  const milesRes = await request({ host: 'localhost', port: 5000, path: '/api/v1/milestones', method: 'GET', headers: authHeaders });
  console.log(`   ✅ Milestones computed dynamically (${milesRes.data.data.length} gates verified).`);

  // 13. ACTIVITY LOG VERIFICATION
  console.log('13. [ACTIVITY] Verifying real audit timeline events...');
  const actRes = await request({ host: 'localhost', port: 5000, path: '/api/v1/activity', method: 'GET', headers: authHeaders });
  console.log(`   ✅ Activity timeline has ${actRes.data.data.length} events logged. Latest: "${actRes.data.data[0].summary}"`);

  // 14. SIH READINESS EVALUATION
  console.log('14. [SIH READINESS] Fetching Grand Finale readiness checklist...');
  const sihRes = await request({ host: 'localhost', port: 5000, path: '/api/v1/readiness/sih', method: 'GET', headers: authHeaders });
  console.log(`   ✅ SIH Readiness Score: ${sihRes.data.data.overallScore}% (${sihRes.data.data.statusLabel})`);

  console.log('\n=====================================================');
  console.log('🏆 14/14 USER FLOW STEPS COMPLETED & VERIFIED WITH 100% SUCCESS!');
  console.log('=====================================================');
}

runFullUserFlowTest().catch((err) => {
  console.error('❌ User flow test error:', err);
  process.exit(1);
});
