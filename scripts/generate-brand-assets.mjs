/**
 * Regenerates icon + splash assets from images/Logo.jpg.
 * - Flattens light margins to brand background (#12100E)
 * - Zooms into the logo so it fills more of the canvas
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const INPUT = path.join(root, 'images', 'Logo.jpg');
const OUT_DIR = path.join(root, 'assets', 'images');
const BG = '#12100E';

/** Crop center after cover-resize to zoom into the artwork */
async function zoomedSquare(input, size, zoom = 1.28) {
  const zoomed = Math.round(size * zoom);
  const buf = await sharp(input)
    .flatten({ background: BG })
    .resize(zoomed, zoomed, { fit: 'cover', position: 'center' })
    .toBuffer();

  const left = Math.floor((zoomed - size) / 2);
  const top = Math.floor((zoomed - size) / 2);

  return sharp(buf).extract({ left, top, width: size, height: size });
}

async function writePng(input, outPath, size, zoom) {
  const pipeline = await zoomedSquare(input, size, zoom);
  await pipeline.png().toFile(outPath);
}

async function writeIcon() {
  await writePng(INPUT, path.join(OUT_DIR, 'icon.png'), 1024, 1.32);
  await writePng(INPUT, path.join(OUT_DIR, 'android-icon-foreground.png'), 432, 1.38);
  await writePng(INPUT, path.join(OUT_DIR, 'favicon.png'), 48, 1.2);
  const mono = await zoomedSquare(INPUT, 48, 1.2);
  await mono.grayscale().png().toFile(path.join(OUT_DIR, 'android-icon-monochrome.png'));
}

/** Splash source: large square, logo zoomed — used with resizeMode cover in app.json */
async function writeSplashSource() {
  await writePng(INPUT, path.join(OUT_DIR, 'splash-icon.png'), 2048, 1.55);
}

async function writeAndroidBackground() {
  const size = 432;
  await sharp({
    create: { width: size, height: size, channels: 3, background: BG },
  })
    .png()
    .toFile(path.join(OUT_DIR, 'android-icon-background.png'));
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  await writeIcon();
  await writeSplashSource();
  await writeAndroidBackground();
  console.log('Brand assets written to assets/images/');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
