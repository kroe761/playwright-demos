import { test as base } from '@playwright/test';
import WebSocket from 'ws';
import { randomUUID } from 'crypto';

const RELAY = process.env.RELAY_URL || 'ws://localhost:8080';

export const test = base.extend({
  page: async ({ page }, use, testInfo) => {
    const testId = randomUUID();
    const name = testInfo.title;
    const url = `${RELAY}/ingest?testId=${testId}&name=${encodeURIComponent(name)}`;

    const ws = new WebSocket(url);
    await new Promise((resolve, reject) => {
      const onOpen = () => { cleanup(); resolve(); };
      const onError = (err) => { cleanup(); reject(err); };
      const cleanup = () => {
        ws.off('open', onOpen);
        ws.off('error', onError);
      };
      ws.once('open', onOpen);
      ws.once('error', onError);
    });

    await page.screencast.start({
      onFrame: (frame) => {
        if (ws.readyState === WebSocket.OPEN) {
          try { ws.send(frame.data); } catch { /* ignore mid-flight close */ }
        }
      },
      quality: 50,
      size: { width: 1280, height: 720 },
    });

    try {
      await use(page);
    } finally {
      try { await page.screencast.stop(); } catch { /* page may already be closed */ }
      ws.close();
    }
  },
});

export { expect } from '@playwright/test';
