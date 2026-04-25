# Screencast Dashboard

A live-viewing dashboard for parallel Playwright tests. Runs entirely on localhost.

When tests start, each one streams JPEG frames of its browser to a local relay. The dashboard shows a grid of live tiles — one per running test. Click a tile to zoom. Tests appear when they start, disappear when they finish.

## Architecture

```
┌─────────────────────┐    ws://    ┌──────────────────────┐    ws://    ┌──────────────┐
│  Playwright Tests   │ ──────────▶ │  Node.js Relay       │ ──────────▶ │  React       │
│  page.screencast    │  /ingest    │  (in-memory fan-out) │   /view     │  Dashboard   │
└─────────────────────┘             └──────────────────────┘             └──────────────┘
   any binding                         localhost:8080                       localhost:5173
```

Three processes on localhost. No database, no cloud, no Docker.

## Prerequisites

- Node.js 20+
- Playwright 1.59+ (for the `screencast` API)

## First-time setup

```bash
cd relay-server  && npm install && cd ..
cd dashboard     && npm install && cd ..
cd demo-tests    && npm install && npx playwright install chromium && cd ..
```

## Running

Three terminals:

```bash
# terminal 1 — relay
cd relay-server && npm start

# terminal 2 — dashboard
cd dashboard && npm run dev
# open http://localhost:5173

# terminal 3 — tests
cd demo-tests && npm test
```

Open the dashboard *before* you start the tests. Tiles appear as tests begin. Click any tile to zoom in.

## Components

### `relay-server/`
Single-file WebSocket relay (~80 lines). Three endpoints:
- `/ingest?testId=…&name=…` — runners publish JPEG frames here
- `/view?testId=…` — dashboards subscribe to a single test's frames
- `/view/list` — dashboards subscribe to the live test-list feed

### `dashboard/`
Vite + React + Tailwind v4. Two components: a grid of tiles and a zoomed view. Frame stream is a `useFrameStream` hook that owns a per-test WebSocket and flips the `<img>` src each frame via `URL.createObjectURL`.

### `demo-tests/`
Playwright Test runner with a custom `page` fixture (`fixtures.js`) that:
1. Generates a UUID test ID
2. Opens a WebSocket to `/ingest`
3. Calls `page.screencast.start({ onFrame })` to forward every frame
4. Stops + closes on teardown

Each `*.spec.js` is a standalone scenario. Add more freely — they'll all show up in parallel up to `workers` in `playwright.config.js`.

## Tuning for stage impact

- **Frame quality**: `quality: 50` in the fixture is a good middle. Drop to 30 for smoother motion on conference wifi.
- **Artificial delays**: every spec has `page.waitForTimeout(...)` calls between actions so the audience can see what's happening.
- **Worker count**: `workers: 5` in `playwright.config.js`. Match your dashboard grid (5-column at `lg`).
- **Pre-build a failing test**: drop a spec that clicks a wrong selector → its tile freezes on the failing frame. Visual punchline.

## Caveats

- `page.screencast` requires Playwright **1.59+**. Pin the version.
- The `onFrame` callback in Node receives `frame.data` as a `Buffer` — send straight to `ws.send()` without conversion.
- Memory leak risk: the dashboard revokes object URLs before assigning the next one. Don't change that.
- WebSocket reconnection is *not* implemented. If the relay drops, restart the demo.
