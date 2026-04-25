# VRT — Visual Regression Helpers

Companion code for the "Visual regression — built from primitives" slot in Act 3.

Node ships `toHaveScreenshot()` built-in. These helpers bring the same pattern to Java, Python, and .NET using each ecosystem's standard image library.

## The pattern (same in every binding)

1. `page.screenshot()` captures raw bytes — a first-class primitive in all four bindings.
2. First run: no baseline exists → write the bytes to disk as the baseline.
3. Subsequent runs: load baseline, compare, fail with a diff image if pixels diverge beyond the threshold.

~80 lines, one afternoon, no external service.

## Per-binding details

### Node (built-in)
See `node/visual-assert.js` for usage. `@playwright/test` ships `toHaveScreenshot()` — no helper needed.

### Java
**File:** `java/VisualAssert.java`  
**Dependency:** `io.github.romankh3:image-comparison` (Maven Central, MIT, ~100 KB) — see `java/pom-snippet.xml`.  
**Usage:**
```java
VisualAssert.assertScreenshot(page, "homepage");
// or with custom tolerance:
VisualAssert.assertScreenshot(page, "homepage", 0.5);
```

### Python
**File:** `python/visual_assert.py`  
**Dependencies:** `pip install pillow pytest-playwright`  
**Usage:**
```python
from visual_assert import assert_screenshot

def test_homepage(page):
    page.goto("https://example.com")
    assert_screenshot(page, "homepage")
```

### .NET (NUnit)
**File:** `dotnet/VisualAssert.cs`  
**Dependencies:** `SixLabors.ImageSharp` 3.x + `Microsoft.Playwright.NUnit`  
**Usage:**
```csharp
await VisualAssert.AssertScreenshotAsync(Page, "homepage");
```
**Note:** Check whether your version of `Microsoft.Playwright.NUnit` ships `ToHaveScreenshotAsync()` — if it does, use that instead and skip this helper.

## Workflow

```
# Create baselines (first run — commit these to source control)
mvn test / pytest / dotnet test

# Verify a change broke nothing
mvn test / pytest / dotnet test    # diffs land in build/test-results/diffs or test-results/diffs

# Update a baseline after an intentional design change
rm src/test/resources/screenshots/homepage.png   # Java
rm tests/screenshots/homepage.png               # Python
rm Screenshots/homepage.png                     # .NET
# re-run to regenerate
```
