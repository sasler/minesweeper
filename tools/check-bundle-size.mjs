import { stat, readdir } from 'node:fs/promises';
import path from 'node:path';

const DIST_DIR = path.resolve(process.cwd(), 'dist');
const DEFAULT_LIMIT = 1_000_000; // 1 MB budget from constitution constraints.
const limit = Number(process.env.BUNDLE_SIZE_LIMIT_BYTES ?? DEFAULT_LIMIT);

async function accumulateDirectorySize(dir) {
  let total = 0;
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      total += await accumulateDirectorySize(entryPath);
    } else if (/\.(js|css|html|svg|png|jpg|webp)$/i.test(entry.name)) {
      const fileStat = await stat(entryPath);
      total += fileStat.size;
    }
  }

  return total;
}

async function main() {
  try {
    const totalBytes = await accumulateDirectorySize(DIST_DIR);
    const formatted = `${(totalBytes / 1024).toFixed(1)} KiB`;

    if (totalBytes > limit) {
      console.error(`Bundle size ${formatted} exceeds limit of ${limit / 1024} KiB.`);
      process.exit(1);
    }

    console.log(`Bundle size ${formatted} meets limit of ${(limit / 1024).toFixed(1)} KiB.`);
  } catch (error) {
    console.error('Failed to measure bundle size. Did you run "npm run build" first?');
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

await main();
