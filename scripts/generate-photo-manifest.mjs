import { readdir, writeFile } from 'node:fs/promises';
import { extname, join, posix } from 'node:path';

const photosDir = join(process.cwd(), 'assets', 'photos');
const manifestPath = join(photosDir, 'manifest.json');
const supported = new Set(['.jpg', '.jpeg', '.png', '.webp']);

async function main() {
  let entries = [];
  try {
    entries = await readdir(photosDir, { withFileTypes: true });
  } catch {
    entries = [];
  }

  const photos = entries
    .filter(entry => entry.isFile() && supported.has(extname(entry.name).toLowerCase()))
    .map(entry => posix.join('assets', 'photos', entry.name))
    .sort((a, b) => a.localeCompare(b, 'ru', { numeric: true, sensitivity: 'base' }));

  await writeFile(manifestPath, `${JSON.stringify(photos, null, 2)}\n`, 'utf8');
  console.log(`Photo manifest updated: ${photos.length} image(s).`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
