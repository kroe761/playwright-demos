// Visual regression helper for Playwright .NET (NUnit flavour).
//
// Dependencies (add to your .csproj):
//   <PackageReference Include="Microsoft.Playwright.NUnit" Version="1.44.0" />
//   <PackageReference Include="SixLabors.ImageSharp"       Version="3.1.0"  />
//
// Usage in a test:
//   await VisualAssert.AssertScreenshotAsync(Page, "homepage");
//
// First run creates the baseline. Subsequent runs diff against it.
// Commit the Screenshots/ directory to source control.

using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.Playwright;
using NUnit.Framework;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;

public static class VisualAssert
{
    private const string BaselineDir = "Screenshots";
    private const string DiffDir     = "TestResults/Diffs";
    private const double DefaultAllowedDiffRatio = 0.001; // 0.1 % of pixels
    private const int    ColorTolerance = 10;             // per-channel delta

    public static async Task AssertScreenshotAsync(
        IPage page,
        string name,
        double allowedDiffRatio = DefaultAllowedDiffRatio)
    {
        Directory.CreateDirectory(BaselineDir);
        Directory.CreateDirectory(DiffDir);

        var actual       = await page.ScreenshotAsync();
        var baselinePath = Path.Combine(BaselineDir, $"{name}.png");

        if (!File.Exists(baselinePath))
        {
            await File.WriteAllBytesAsync(baselinePath, actual);
            Console.WriteLine($"[VRT] Baseline created: {baselinePath}");
            return;
        }

        using var expected  = Image.Load<Rgba32>(baselinePath);
        using var actualImg = Image.Load<Rgba32>(actual);

        if (expected.Size != actualImg.Size)
            actualImg.Mutate(x => x.Resize(expected.Width, expected.Height));

        int diffPixels = 0;
        int total      = expected.Width * expected.Height;
        using var diffImg = expected.Clone();

        for (int y = 0; y < expected.Height; y++)
        {
            for (int x = 0; x < expected.Width; x++)
            {
                var e = expected[x, y];
                var a = actualImg[x, y];
                bool different =
                    Math.Abs(e.R - a.R) +
                    Math.Abs(e.G - a.G) +
                    Math.Abs(e.B - a.B) > ColorTolerance;

                if (different)
                {
                    diffPixels++;
                    diffImg[x, y] = new Rgba32(255, 0, 0, 255);
                }
                else
                {
                    diffImg[x, y] = new Rgba32(e.R, e.G, e.B, 128);
                }
            }
        }

        double ratio = (double)diffPixels / total;
        if (ratio > allowedDiffRatio)
        {
            var diffPath = Path.Combine(DiffDir, $"{name}-diff.png");
            await diffImg.SaveAsPngAsync(diffPath);
            Assert.Fail(
                $"Visual regression: {name} — {ratio:P2} pixels differ " +
                $"(limit {allowedDiffRatio:P2}). Diff: {diffPath}");
        }
    }
}
