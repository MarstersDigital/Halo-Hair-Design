import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT_DIR = process.cwd();
const srcPath = path.join(ROOT_DIR, 'images', 'Halo Hair Design Logo.jpg');

async function processOfficialLogo() {
  console.log('Processing official Halo Hair Design Logo...');

  const image = sharp(srcPath);
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });

  // Find tight bounding box with threshold
  let minX = info.width, maxX = 0, minY = info.height, maxY = 0;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const idx = (y * info.width + x) * 3;
      const r = data[idx], g = data[idx + 1], b = data[idx + 2];
      if (r < 242 || g < 242 || b < 242) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  // Add 24px padding around bounding box
  const pad = 24;
  const cropLeft = Math.max(0, minX - pad);
  const cropTop = Math.max(0, minY - pad);
  const cropWidth = Math.min(info.width - cropLeft, (maxX - minX) + pad * 2);
  const cropHeight = Math.min(info.height - cropTop, (maxY - minY) + pad * 2);

  console.log('Cropping to:', { cropLeft, cropTop, cropWidth, cropHeight });

  // Extract cropped buffer
  const cropped = await sharp(srcPath)
    .extract({ left: cropLeft, top: cropTop, width: cropWidth, height: cropHeight })
    .resize(1000, null, { withoutEnlargement: true })
    .toBuffer({ resolveWithObject: true });

  const cData = cropped.data;
  const cInfo = cropped.info;

  // 1. Create transparent RGBA buffer
  const rgbaBuffer = Buffer.alloc(cInfo.width * cInfo.height * 4);
  const whiteRgbaBuffer = Buffer.alloc(cInfo.width * cInfo.height * 4);

  for (let i = 0; i < cInfo.width * cInfo.height; i++) {
    const r = cData[i * 3];
    const g = cData[i * 3 + 1];
    const b = cData[i * 3 + 2];

    // Background is white (~255). The darker the pixel, the more opaque.
    // Lilac ring has R~200, G~185, B~220 -> luminance ~ 200
    // Pure white has luminance 255.
    const luminance = (r + g + b) / 3;

    let alpha = 255;
    if (luminance >= 252) {
      alpha = 0;
    } else if (luminance > 220) {
      // Smooth feathering for subtle anti-aliasing around lilac ring edges
      alpha = Math.round((252 - luminance) / (252 - 220) * 255);
    }

    // Original purple/lilac logo with transparent background
    rgbaBuffer[i * 4] = r;
    rgbaBuffer[i * 4 + 1] = g;
    rgbaBuffer[i * 4 + 2] = b;
    rgbaBuffer[i * 4 + 3] = alpha;

    // White version for dark footer
    whiteRgbaBuffer[i * 4] = 255;
    whiteRgbaBuffer[i * 4 + 1] = 255;
    whiteRgbaBuffer[i * 4 + 2] = 255;
    whiteRgbaBuffer[i * 4 + 3] = alpha;
  }

  // Save transparent PNG
  await sharp(rgbaBuffer, {
    raw: { width: cInfo.width, height: cInfo.height, channels: 4 }
  })
    .png({ quality: 95 })
    .toFile(path.join(ROOT_DIR, 'images', 'logo.png'));

  // Save white transparent PNG for footer
  await sharp(whiteRgbaBuffer, {
    raw: { width: cInfo.width, height: cInfo.height, channels: 4 }
  })
    .png({ quality: 95 })
    .toFile(path.join(ROOT_DIR, 'images', 'logo-white.png'));

  // Save cropped JPG
  await sharp(srcPath)
    .extract({ left: cropLeft, top: cropTop, width: cropWidth, height: cropHeight })
    .resize(1000, null, { withoutEnlargement: true })
    .jpeg({ quality: 92 })
    .toFile(path.join(ROOT_DIR, 'images', 'logo.jpg'));

  // Also copy to assets/images/branding/ if used elsewhere
  if (fs.existsSync(path.join(ROOT_DIR, 'assets', 'images', 'branding'))) {
    fs.copyFileSync(path.join(ROOT_DIR, 'images', 'logo.png'), path.join(ROOT_DIR, 'assets', 'images', 'branding', 'logo.png'));
    fs.copyFileSync(path.join(ROOT_DIR, 'images', 'logo.jpg'), path.join(ROOT_DIR, 'assets', 'images', 'branding', 'logo.jpg'));
    fs.copyFileSync(path.join(ROOT_DIR, 'images', 'logo-white.png'), path.join(ROOT_DIR, 'assets', 'images', 'branding', 'logo-white.png'));
  }

  console.log('✓ Successfully created cropped images/logo.png, images/logo-white.png, and images/logo.jpg!');
}

processOfficialLogo().catch(console.error);
