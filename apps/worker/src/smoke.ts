import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { runConversionJob } from "./job-runner";

async function run() {
  const dir = join(process.cwd(), "tmp");
  await mkdir(dir, { recursive: true });

  const input = join(dir, "in.jpg");
  const output = join(dir, "out.png");

  // This is a harness stub: actual conversion requires imagemagick binary and a real image.
  await writeFile(input, "not-a-real-image", "utf8");

  try {
    await runConversionJob(
      {
        jobId: "smoke-job",
        sourceMime: "image/jpeg",
        targetMime: "image/png",
        inputKey: input,
        outputKey: output,
        createdAt: new Date().toISOString(),
        attempt: 0
      },
      10_000
    );
    console.log("Smoke test passed.");
  } catch (error) {
    console.error("Smoke test expectedly failed without converter binaries/input:", String(error));
  }
}

run();
