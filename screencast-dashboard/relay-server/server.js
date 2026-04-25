import { WebSocketServer } from 'ws';
import { parse } from 'url';

const PORT = 8080;

// testId -> { startedAt, name }
const activeTests = new Map();

// testId -> Set<WebSocket>
const viewers = new Map();

// dashboards subscribed to the test list feed
const listViewers = new Set();

function snapshotTests() {
  return Array.from(activeTests.entries()).map(([id, meta]) => ({
    testId: id,
    startedAt: meta.startedAt,
    name: meta.name,
  }));
}

function broadcastTestList() {
  const payload = JSON.stringify({ type: 'test-list', tests: snapshotTests() });
  for (const ws of listViewers) {
    if (ws.readyState === ws.OPEN) ws.send(payload);
  }
}

const wss = new WebSocketServer({ port: PORT });

wss.on('connection', (ws, req) => {
  const { pathname, query } = parse(req.url, true);

  // RUNNER PUBLISHING FRAMES
  if (pathname === '/ingest') {
    const testId = query.testId;
    const testName = query.name || testId;
    if (!testId) { ws.close(1008, 'testId required'); return; }

    activeTests.set(testId, { startedAt: Date.now(), name: testName });
    broadcastTestList();
    console.log(`[ingest] START ${testId} (${testName})`);

    ws.on('message', (data, isBinary) => {
      if (!isBinary) return;
      const subs = viewers.get(testId);
      if (!subs) return;
      for (const viewer of subs) {
        if (viewer.readyState === viewer.OPEN) viewer.send(data, { binary: true });
      }
    });

    ws.on('close', () => {
      activeTests.delete(testId);
      broadcastTestList();
      console.log(`[ingest] END   ${testId}`);
    });
    return;
  }

  // DASHBOARD VIEWING A SPECIFIC TEST
  if (pathname === '/view') {
    const testId = query.testId;
    if (!testId) { ws.close(1008, 'testId required'); return; }

    if (!viewers.has(testId)) viewers.set(testId, new Set());
    viewers.get(testId).add(ws);
    console.log(`[view]   + ${testId} (${viewers.get(testId).size} viewers)`);

    ws.on('close', () => {
      const subs = viewers.get(testId);
      if (subs) {
        subs.delete(ws);
        if (subs.size === 0) viewers.delete(testId);
      }
    });
    return;
  }

  // DASHBOARD SUBSCRIBING TO THE TEST LIST
  if (pathname === '/view/list') {
    listViewers.add(ws);
    ws.send(JSON.stringify({ type: 'test-list', tests: snapshotTests() }));
    ws.on('close', () => listViewers.delete(ws));
    return;
  }

  ws.close(1008, 'unknown path');
});

console.log(`Relay listening on ws://localhost:${PORT}`);
console.log(`  Ingest:    ws://localhost:${PORT}/ingest?testId=X&name=Y`);
console.log(`  View:      ws://localhost:${PORT}/view?testId=X`);
console.log(`  List:      ws://localhost:${PORT}/view/list`);
