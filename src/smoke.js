const http = require('http');
const { createApp } = require('./app');

async function request(method, url, data, headers = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const body = data ? (typeof data === 'string' ? data : JSON.stringify(data)) : null;
    const hdrs = { ...headers };
    if (body) {
      if (!hdrs['Content-Type']) hdrs['Content-Type'] = 'application/json';
      hdrs['Content-Length'] = Buffer.byteLength(body);
    }
    const options = {
      method,
      hostname: u.hostname,
      port: u.port,
      path: u.pathname + (u.search || ''),
      headers: hdrs,
    };
    const req = http.request(options, (res) => {
      let chunks = '';
      res.on('data', (c) => (chunks += c));
      res.on('end', () => resolve({ status: res.statusCode, body: chunks }));
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function main() {
  const app = createApp();
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const { port } = server.address();
  const base = `http://127.0.0.1:${port}`;

  try {
    // Health
    const h = await request('GET', `${base}/health`);
    if (h.status !== 200) throw new Error(`/health failed: ${h.status}`);

    // API score
    const s = await request('GET', `${base}/api/score?phoneNumber=%2B256700000000`);
    if (s.status !== 200) throw new Error(`/api/score failed: ${s.status}`);

    // USSD initial menu
    const ussdBody = 'sessionId=1&serviceCode=%2A123%23&phoneNumber=%2B256700000000&text=';
    const u = await request('POST', `${base}/ussd`, ussdBody, {
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    if (u.status !== 200 || !String(u.body).startsWith('CON')) {
      throw new Error(`/ussd failed: ${u.status} body=${u.body}`);
    }

    console.log('SMOKE OK');
  } catch (err) {
    console.error('SMOKE FAILED', err.message);
    process.exitCode = 1;
  } finally {
    server.close();
  }
}

main();
