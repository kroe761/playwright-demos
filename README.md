# playwright-demos

Code samples and demo helpers for Playwright across all four bindings — Node, Java, Python, and .NET.

## Contents

| Directory | What's in it |
|-----------|-------------|
| [`vrt/`](vrt/) | Visual regression helpers — pixel-diff + baseline management for every binding |
| [`screencast-dashboard/`](screencast-dashboard/) | Live-streaming dashboard for parallel Playwright tests (relay + React UI + demo specs) |
| [`qa-or-the-highway-breakout-slides/`](qa-or-the-highway-breakout-slides/) | Slide deck for the QA or the Highway 2026 breakout session |

## Running the breakout slides

```bash
cd qa-or-the-highway-breakout-slides
npm start
```

Opens a static file server at `http://localhost:3000`. Open `index.html` in a browser to view the slide deck.

## Bindings

Every sample targets all four official Playwright bindings where the API is available. Where a feature is built into one binding but not others (e.g., `toHaveScreenshot()` in Node), the equivalent is built from primitives and the gap is documented.
