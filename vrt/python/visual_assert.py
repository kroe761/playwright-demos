"""
Visual regression helper for pytest-playwright.

Dependencies:
    pip install pillow pytest-playwright

Usage in a test:
    from visual_assert import assert_screenshot

    def test_homepage(page):
        page.goto("https://example.com")
        assert_screenshot(page, "homepage")

First run creates the baseline. Subsequent runs diff against it.
Commit the screenshots/ directory to source control.
"""

from __future__ import annotations

import io
from pathlib import Path

import pytest
from PIL import Image, ImageChops

BASELINE_DIR = Path("tests/screenshots")
DIFF_DIR = Path("test-results/diffs")
ALLOWED_DIFF_RATIO = 0.001  # 0.1 % of pixels


def assert_screenshot(
    page,
    name: str,
    *,
    allowed_diff_ratio: float = ALLOWED_DIFF_RATIO,
) -> None:
    BASELINE_DIR.mkdir(parents=True, exist_ok=True)
    DIFF_DIR.mkdir(parents=True, exist_ok=True)

    actual_bytes = page.screenshot()
    baseline = BASELINE_DIR / f"{name}.png"

    if not baseline.exists():
        baseline.write_bytes(actual_bytes)
        print(f"\n[VRT] Baseline created: {baseline}")
        return

    expected_img = Image.open(baseline).convert("RGB")
    actual_img = Image.open(io.BytesIO(actual_bytes)).convert("RGB")

    if expected_img.size != actual_img.size:
        actual_img = actual_img.resize(expected_img.size, Image.LANCZOS)

    diff = ImageChops.difference(expected_img, actual_img)
    pixel_data = list(diff.getdata())
    differing = sum(1 for r, g, b in pixel_data if r + g + b > 0)
    ratio = differing / len(pixel_data)

    if ratio > allowed_diff_ratio:
        diff_path = DIFF_DIR / f"{name}-diff.png"
        diff.save(diff_path)
        pytest.fail(
            f"Visual regression: {name} — {ratio:.2%} pixels differ "
            f"(limit {allowed_diff_ratio:.2%}). Diff: {diff_path}"
        )
