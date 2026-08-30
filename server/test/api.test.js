const http = require('http');

const API_BASE = 'http://127.0.0.1:5000/api';

async function fetchJSON(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const contentType = res.headers.get('content-type') || '';
  let body;
  if (contentType.includes('application/json')) {
    body = await res.json();
  } else {
    body = await res.text();
  }

  return { status: res.status, ok: res.ok, headers: res.headers, body };
}

let citizenToken = '';
let officerToken = '';
let createdComplaintId = '';

async function runTests() {
  console.log('====================================================');
  console.log('  CITIZEN COMPLAINT PORTAL — END-TO-END TEST SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      process.stdout.write(`TEST: ${name} ... `);
      await fn();
      console.log('PASSED [OK]');
      passed++;
    } catch (err) {
      console.log(`FAILED [X]\n  -> ${err.message}`);
      failed++;
    }
  }

  // 1. Health Check
  await test('1. Health check endpoint GET /api/health', async () => {
    const res = await fetchJSON('/health');
    if (res.status !== 200 || res.body.status !== 'ok') {
      throw new Error(`Expected 200 ok, got ${res.status}: ${JSON.stringify(res.body)}`);
    }
  });

  // 2. Demo Citizen Login
  await test('2. Citizen Login with Seed Account (citizen@citizenportal.com)', async () => {
    const res = await fetchJSON('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'citizen@citizenportal.com',
        password: 'Citizen123!',
      }),
    });
    if (res.status !== 200 || !res.body.token || res.body.user.role !== 'citizen') {
      throw new Error(`Login failed: ${JSON.stringify(res.body)}`);
    }
    citizenToken = res.body.token;
  });

  // 3. Demo Officer Login
  await test('3. Officer Login with Seed Account (officer@citizenportal.com)', async () => {
    const res = await fetchJSON('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'officer@citizenportal.com',
        password: 'Officer123!',
      }),
    });
    if (res.status !== 200 || !res.body.token || res.body.user.role !== 'officer') {
      throw new Error(`Login failed: ${JSON.stringify(res.body)}`);
    }
    officerToken = res.body.token;
  });

  // 4. Test Token Authentication Middleware GET /api/auth/me
  await test('4. Verify Auth Me endpoint GET /api/auth/me', async () => {
    const res = await fetchJSON('/auth/me', {
      headers: { Authorization: `Bearer ${citizenToken}` },
    });
    if (res.status !== 200 || res.body.user.email !== 'citizen@citizenportal.com') {
      throw new Error(`Auth me failed: ${JSON.stringify(res.body)}`);
    }
  });

  // 5. Test Duplicate Complaint Detection
  await test('5. Duplicate detection endpoint GET /api/complaints/check-duplicate', async () => {
    const res = await fetchJSON('/complaints/check-duplicate?category=Electricity&area=Satellite%20Town');
    if (res.status !== 200 || !res.body.success) {
      throw new Error(`Duplicate check failed: ${JSON.stringify(res.body)}`);
    }
  });

  // 6. Test Create Complaint (Citizen)
  await test('6. Citizen creates new complaint POST /api/complaints', async () => {
    const payload = {
      title: 'Water pipe rupture on Jinnah Avenue',
      category: 'Water',
      area: 'F-7 Markaz',
      description: 'Severe potable water pipeline burst flooding the service road and reducing water pressure.',
    };

    const res = await fetchJSON('/complaints', {
      method: 'POST',
      headers: { Authorization: `Bearer ${citizenToken}` },
      body: JSON.stringify(payload),
    });

    if (res.status !== 201 || !res.body.complaint || res.body.complaint.status !== 'Pending') {
      throw new Error(`Complaint creation failed: ${JSON.stringify(res.body)}`);
    }
    createdComplaintId = res.body.complaint._id;
  });

  // 7. Test Public Complaints Listing
  await test('7. Public complaint feed GET /api/complaints', async () => {
    const res = await fetchJSON('/complaints');
    if (res.status !== 200 || !Array.isArray(res.body.complaints) || res.body.complaints.length === 0) {
      throw new Error(`Public feed failed: ${JSON.stringify(res.body)}`);
    }
  });

  // 8. Test Dynamic Priority Calculation
  await test('8. Dynamic Priority Calculation and Tier Assignment', async () => {
    const res = await fetchJSON(`/complaints/${createdComplaintId}`);
    if (res.status !== 200 || !res.body.complaint) {
      throw new Error(`Could not fetch created complaint`);
    }
    const c = res.body.complaint;
    if (typeof c.priorityScore !== 'number' || !['Low', 'Medium', 'High', 'Critical'].includes(c.priority)) {
      throw new Error(`Priority calculation missing: ${JSON.stringify(c)}`);
    }
  });

  // 9. Test Upvote Action
  await test('9. Citizen upvotes complaint PATCH /api/complaints/:id/upvote', async () => {
    const res = await fetchJSON(`/complaints/${createdComplaintId}/upvote`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${citizenToken}` },
    });
    if (res.status !== 200 || res.body.complaint.upvotes !== 1) {
      throw new Error(`Upvote failed: ${JSON.stringify(res.body)}`);
    }
  });

  // 10. Test Officer Security Boundary (Citizen cannot perform officer status update)
  await test('10. Security: Citizen blocked from officer status update (403 Forbidden)', async () => {
    const res = await fetchJSON(`/complaints/${createdComplaintId}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${citizenToken}` },
      body: JSON.stringify({ status: 'In Progress', officerRemark: 'Hacker note' }),
    });
    if (res.status !== 403) {
      throw new Error(`Expected 403 Forbidden, got ${res.status}`);
    }
  });

  // 11. Officer Updates Status to "In Progress" with Remark
  await test('11. Officer updates status to In Progress PATCH /api/complaints/:id/status', async () => {
    const res = await fetchJSON(`/complaints/${createdComplaintId}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${officerToken}` },
      body: JSON.stringify({
        status: 'In Progress',
        officerRemark: 'Hydraulics crew dispatched. Repair in progress.',
      }),
    });
    if (res.status !== 200 || res.body.complaint.status !== 'In Progress') {
      throw new Error(`Officer status update failed: ${JSON.stringify(res.body)}`);
    }
  });

  // 12. Officer Resolves Complaint -> triggers feedbackPending = true
  await test('12. Officer marks complaint Resolved PATCH /api/complaints/:id/status', async () => {
    const res = await fetchJSON(`/complaints/${createdComplaintId}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${officerToken}` },
      body: JSON.stringify({
        status: 'Resolved',
        officerRemark: 'Pipeline welded and tested under full pressure on Aug 31.',
      }),
    });
    if (res.status !== 200 || res.body.complaint.status !== 'Resolved' || !res.body.complaint.feedbackPending) {
      throw new Error(`Officer resolve failed: ${JSON.stringify(res.body)}`);
    }
  });

  // 13. Citizen Submits Feedback (Rating + Comment)
  await test('13. Citizen submits feedback rating PATCH /api/complaints/:id/feedback', async () => {
    const res = await fetchJSON(`/complaints/${createdComplaintId}/feedback`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${citizenToken}` },
      body: JSON.stringify({
        rating: 5,
        feedbackComment: 'Water restored promptly with excellent workmanship!',
      }),
    });
    if (res.status !== 200 || !res.body.complaint.feedbackGiven || res.body.complaint.feedbackRating !== 5) {
      throw new Error(`Feedback submission failed: ${JSON.stringify(res.body)}`);
    }
  });

  // 14. Officer AI Briefing endpoint
  await test('14. Officer AI Briefing POST /api/ai/officer-summary', async () => {
    const res = await fetchJSON('/ai/officer-summary', {
      method: 'POST',
      headers: { Authorization: `Bearer ${officerToken}` },
    });
    if (res.status !== 200 || !res.body.briefing || !res.body.stats) {
      throw new Error(`AI briefing failed: ${JSON.stringify(res.body)}`);
    }
  });

  // 15. Officer CSV Export endpoint via Bearer Header
  await test('15. Officer CSV Export via Authorization Header GET /api/complaints/export', async () => {
    const res = await fetchJSON('/complaints/export', {
      headers: { Authorization: `Bearer ${officerToken}` },
    });
    if (res.status !== 200 || !res.headers.get('content-type')?.includes('text/csv')) {
      throw new Error(`CSV export failed: ${res.status}`);
    }
    if (!res.body.includes('Title') || !res.body.includes('Water pipe rupture')) {
      throw new Error(`CSV body missing expected headers or records`);
    }
  });

  // 16. CSV Security: Citizen Blocked from CSV Export (403 Forbidden)
  await test('16. CSV Security: Citizen blocked from CSV export (403 Forbidden)', async () => {
    const res = await fetchJSON('/complaints/export', {
      headers: { Authorization: `Bearer ${citizenToken}` },
    });
    if (res.status !== 403) {
      throw new Error(`Expected 403 Forbidden for citizen, got ${res.status}`);
    }
  });

  // 17. CSV Security: Unauthenticated Blocked from CSV Export (401 Unauthorized)
  await test('17. CSV Security: Unauthenticated blocked from CSV export (401 Unauthorized)', async () => {
    const res = await fetchJSON('/complaints/export');
    if (res.status !== 401) {
      throw new Error(`Expected 401 Unauthorized for unauthenticated request, got ${res.status}`);
    }
  });

  // 18. CSV Security: Query Token in URL Rejected (401 Unauthorized)
  await test('18. CSV Security: Query token in URL rejected (401 Unauthorized)', async () => {
    const res = await fetchJSON(`/complaints/export?token=${officerToken}`);
    if (res.status !== 401) {
      throw new Error(`Expected 401 Unauthorized when token passed in query parameter, got ${res.status}`);
    }
  });

  // 19. CSV Export with Filter Preservation
  await test('19. CSV Export with Filter Preservation (category=Water)', async () => {
    const res = await fetchJSON('/complaints/export?category=Water', {
      headers: { Authorization: `Bearer ${officerToken}` },
    });
    if (res.status !== 200 || !res.body.includes('Water pipe rupture')) {
      throw new Error(`Filtered CSV export failed: ${res.status}`);
    }
  });

  console.log('\n====================================================');
  console.log(`  TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
