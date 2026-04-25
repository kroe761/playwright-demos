package vrt;

import com.github.romankh3.image.comparison.ImageComparison;
import com.github.romankh3.image.comparison.ImageComparisonUtil;
import com.github.romankh3.image.comparison.model.ImageComparisonResult;
import com.github.romankh3.image.comparison.model.ImageComparisonState;
import com.microsoft.playwright.Page;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import static org.junit.jupiter.api.Assertions.fail;

public class VisualAssert {

    private static final Path BASELINE_DIR = Paths.get("src/test/resources/screenshots");
    private static final Path DIFF_DIR     = Paths.get("build/test-results/diffs");
    private static final double DEFAULT_ALLOWED_DIFF = 0.1; // percent of pixels

    public static void assertScreenshot(Page page, String name) {
        assertScreenshot(page, name, DEFAULT_ALLOWED_DIFF);
    }

    public static void assertScreenshot(Page page, String name, double allowedDiffPercent) {
        try {
            byte[] actualBytes = page.screenshot();
            Path baselinePath  = BASELINE_DIR.resolve(name + ".png");

            if (!Files.exists(baselinePath)) {
                Files.createDirectories(baselinePath.getParent());
                Files.write(baselinePath, actualBytes);
                System.out.printf("[VRT] Baseline created: %s%n", baselinePath);
                return;
            }

            BufferedImage expected = ImageIO.read(baselinePath.toFile());
            BufferedImage actual   = ImageIO.read(new ByteArrayInputStream(actualBytes));

            ImageComparisonResult result = new ImageComparison(expected, actual)
                .setAllowingPercentOfDifferentPixels(allowedDiffPercent)
                .compareImages();

            if (result.getImageComparisonState() != ImageComparisonState.MATCH) {
                Files.createDirectories(DIFF_DIR);
                Path diffPath = DIFF_DIR.resolve(name + "-diff.png");
                ImageComparisonUtil.saveImage(diffPath.toFile(), result.getResult());
                fail(String.format("Visual regression: %s — diff saved to %s", name, diffPath));
            }

        } catch (IOException e) {
            throw new RuntimeException("VRT I/O error for: " + name, e);
        }
    }
}
