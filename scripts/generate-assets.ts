import { readdir, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

try {
  // Read video files from public/videos/
  const videosDir = join(rootDir, 'public', 'videos');
  let videoFiles: string[] = [];
  try {
    videoFiles = await readdir(videosDir);
  } catch (error) {
    console.warn(
      `⚠️  Warning: Could not read videos directory: ${videosDir}`,
      error instanceof Error ? error.message : String(error),
    );
  }
  const videoPaths = videoFiles
    .filter((file) => /\.(mp4|webm|ogg)$/i.test(file))
    .map((file) => `  '/videos/${file}',`)
    .sort((a, b) => a.localeCompare(b));

  // Read image files from public/gallery/
  const galleryDir = join(rootDir, 'public', 'gallery');
  let imageFiles: string[] = [];
  try {
    imageFiles = await readdir(galleryDir);
  } catch (error) {
    console.warn(
      `⚠️  Warning: Could not read gallery directory: ${galleryDir}`,
      error instanceof Error ? error.message : String(error),
    );
  }
  const imagePaths = imageFiles
    .filter((file) => /\.(jpg|jpeg|png|webp|gif)$/i.test(file))
    .map((file) => `  '/gallery/${file}',`)
    .sort((a, b) => a.localeCompare(b));

  // Generate videos.ts
  const videosContent = `// Videos from public/videos/
// This file is auto-generated. Do not edit manually.
// Run 'pnpm generate:assets' to regenerate.

export const galleryVideos: string[] = [
${videoPaths.join('\n')}
];
`;

  // Generate images.ts
  const imagesContent = `// Gallery images from public/gallery/
// This file is auto-generated. Do not edit manually.
// Run 'pnpm generate:assets' to regenerate.

export const galleryImages: string[] = [
${imagePaths.join('\n')}
];
`;

  // Write files
  await writeFile(
    join(rootDir, 'src', 'utils', 'videos.ts'),
    videosContent,
    'utf-8',
  );
  await writeFile(
    join(rootDir, 'src', 'utils', 'images.ts'),
    imagesContent,
    'utf-8',
  );

  console.log(`✅ Generated videos.ts with ${videoPaths.length} videos`);
  console.log(`✅ Generated images.ts with ${imagePaths.length} images`);
} catch (error) {
  console.error('❌ Error generating assets:', error);
  process.exit(1);
}
