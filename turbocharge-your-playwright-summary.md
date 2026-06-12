# Turbocharge Your Playwright — QA or the Highway 2026

**Kevin Roe** · Senior SET, Ramsey Solutions  
Talk summary for reference. Full slides: `qa-or-the-highway-breakout-slides/`

---

## Act 1 — Type Less. Test Better.

**`addLocatorHandler()`** — Register a handler once to auto-dismiss popups/banners on every navigation. Never copy-paste dismiss logic again.

**Locator composition** — Chain `filter()`, `and()`, `or()`, `nth()`, `first()`, `last()` to target content instead of position. Survives DOM refactors that break CSS selectors.

**Web-first assertions** — Replace `waitForTimeout()` with `expect(locator).toBeVisible()` and friends. The assertion retries until true — it *is* the wait. Faster and flake-resistant.

**`page.waitForResponse()`** — Wrap an action to receive the actual network response object the moment it arrives. No guessing how long the API takes.

**File downloads** — `waitForEvent('download')` / `waitForDownload()` wraps the click, returns a `Download` object. Save it, then assert on the file contents.

**File uploads** — `setInputFiles()` bypasses the OS file picker entirely. Works headless in CI.

**Codegen** — `npx playwright codegen <url>` opens a live browser + code panel. Prioritizes semantic locators (role → label → text → test-id). Useful as a locator-finder, not just a test recorder.

---

## Act 2 — Frontend Without a Backend

**`page.route()`** — Intercept requests before they leave the browser. `fulfill()` returns a canned response, `abort()` simulates a dead network, `continue()` with overrides rewrites requests in flight.

**`context.setOffline()`** — One method call to cut and restore network access. Test offline UX and reconnection flows in CI.

**`routeFromHAR()`** — Record HTTP traffic once, commit the HAR file, replay it forever. Backend becomes optional for UI tests.

**`page.clock`** — Control `Date`, `setTimeout`, `setInterval` inside the browser. Freeze time, fast-forward, or tick manually. Test session expiry, countdowns, and scheduled jobs without waiting.

**Environment emulation** — One `newContext()` options block sets viewport, user agent, locale, timezone, geolocation, and color scheme. No Appium, no device farm, no separate suite.

---

## Act 3 — Backend Through the Browser

**API-seeded fixtures** — Use `request.newContext()` to POST seed data directly before navigating. Replaces 30 seconds of UI setup clicks with a 200ms API call.

**`context/page.request`** — API calls made through a browser context share its cookie jar. Log in once in the browser; the API calls are automatically authenticated.

**`storageState`** — Serialize cookies and `localStorage` to a JSON file after login. Restore it in every test — no login flow, no API call, just the session.

**Complex auth** — For token-based / custom-header auth: use `page.evaluate()` to scrape the token from the DOM, pull the session cookie, pass both to a standalone `request.newContext()`, then call the backend directly with no browser.

> Postman can't do this. Curl can't do this. REST Assured needs a separate browser tool. Playwright can — because it's the only tool with a real browser *and* a real HTTP client in the same process.

---

## Act 4 — Debugging & Observability

**Trace Viewer** — `context.tracing.start/stop()` produces a zip. Open at `trace.playwright.dev` (no install). Panels: Actions, Screenshots (full DOM snapshots, inspectable), Errors, Console, Network. Configure on retry-only to keep CI artifacts lean.

**`page.pause()` + Inspector** — Drop anywhere in a test to freeze and open a live debugger. `PWDEBUG=1` does the same without a code change, also runs headed and disables timeouts. Works in all four bindings.

**Visual regression** — `toHaveScreenshot()` (TypeScript/Node) handles baseline management and pixel-diffing automatically. Other bindings use `page.screenshot()` as the primitive; a ~60-line wrapper brings full VRT. Examples for Java, Python, and .NET in the repo.

**Observer patterns** — Wire three listeners in a base class: `page.on('console')` for JS errors, `page.on('pageerror')` for unhandled exceptions, `page.on('requestfailed')` for network failures. Assert zero at the end. Catches "passing test, silently broken app."

**`traceparent` / distributed tracing** — Set one W3C header on the context and every request carries the trace ID. OTel-compatible APMs (Datadog, New Relic, Dynatrace, etc.) stitch your test run into backend spans automatically.

---

## Closer — What You Can Build

Use the screencast API to stream live JPEG frames from every running test to a WebSocket relay, then display a real-time tile dashboard showing what every browser is doing in CI — while it's happening.

---

## Links

- **Repo:** github.com/kroe761/playwright-demos
- **Blog:** goforthandtest.com
- **LinkedIn:** linkedin.com/in/kroe761
