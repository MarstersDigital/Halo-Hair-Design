import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT_DIR = process.cwd();
const IMAGES_DIR = path.join(ROOT_DIR, 'images');

if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

async function prepareImages() {
  console.log('--- Preparing Halo Hair Design High-Fidelity Assets ---');

  // 1. Process Official Logo (Transparent PNGs + JPG)
  const logoSrc = path.join(ROOT_DIR, 'images', 'Halo Hair Design Logo.jpg');
  if (fs.existsSync(logoSrc)) {
    try {
      const image = sharp(logoSrc);
      const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });

      // Tight bounding box detection
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

      const pad = 24;
      const cropLeft = Math.max(0, minX - pad);
      const cropTop = Math.max(0, minY - pad);
      const cropWidth = Math.min(info.width - cropLeft, (maxX - minX) + pad * 2);
      const cropHeight = Math.min(info.height - cropTop, (maxY - minY) + pad * 2);

      const cropped = await sharp(logoSrc)
        .extract({ left: cropLeft, top: cropTop, width: cropWidth, height: cropHeight })
        .resize(1000, null, { withoutEnlargement: true })
        .raw()
        .toBuffer({ resolveWithObject: true });

      const cData = cropped.data;
      const cInfo = cropped.info;

      const rgbaBuffer = Buffer.alloc(cInfo.width * cInfo.height * 4);
      const whiteRgbaBuffer = Buffer.alloc(cInfo.width * cInfo.height * 4);

      for (let i = 0; i < cInfo.width * cInfo.height; i++) {
        const r = cData[i * 3];
        const g = cData[i * 3 + 1];
        const b = cData[i * 3 + 2];
        const luminance = (r + g + b) / 3;

        let alpha = 255;
        if (luminance >= 250) {
          alpha = 0;
        } else if (luminance > 220) {
          alpha = Math.round((250 - luminance) / (250 - 220) * 255);
        }

        rgbaBuffer[i * 4] = r;
        rgbaBuffer[i * 4 + 1] = g;
        rgbaBuffer[i * 4 + 2] = b;
        rgbaBuffer[i * 4 + 3] = alpha;

        whiteRgbaBuffer[i * 4] = 255;
        whiteRgbaBuffer[i * 4 + 1] = 255;
        whiteRgbaBuffer[i * 4 + 2] = 255;
        whiteRgbaBuffer[i * 4 + 3] = alpha;
      }

      await sharp(rgbaBuffer, { raw: { width: cInfo.width, height: cInfo.height, channels: 4 } })
        .png()
        .toFile(path.join(IMAGES_DIR, 'logo.png'));

      await sharp(whiteRgbaBuffer, { raw: { width: cInfo.width, height: cInfo.height, channels: 4 } })
        .png()
        .toFile(path.join(IMAGES_DIR, 'logo-white.png'));

      await sharp(logoSrc)
        .extract({ left: cropLeft, top: cropTop, width: cropWidth, height: cropHeight })
        .resize(1000, null, { withoutEnlargement: true })
        .jpeg({ quality: 94 })
        .toFile(path.join(IMAGES_DIR, 'logo.jpg'));

      console.log('✓ Prepared transparent logo.png, logo-white.png, logo.jpg');
    } catch (err) {
      console.warn('Logo processing note:', err.message);
    }
  }

  // 2. Shop front (Storefront) - compact 800x600 for retina displays
  const shopFrontSrc = path.join(ROOT_DIR, 'images', 'Shop Front.jpg');
  if (fs.existsSync(shopFrontSrc)) {
    await sharp(shopFrontSrc)
      .resize(800, 600, { fit: 'cover', position: 'center' })
      .sharpen({ sigma: 0.7, m1: 0.8, m2: 0.5 })
      .jpeg({ quality: 92, chromaSubsampling: '4:4:4' })
      .toFile(path.join(IMAGES_DIR, 'storefront.jpg'));

    await sharp(shopFrontSrc)
      .resize(800, 600, { fit: 'cover', position: 'center' })
      .sharpen({ sigma: 0.7, m1: 0.8, m2: 0.5 })
      .webp({ quality: 90, effort: 6 })
      .toFile(path.join(IMAGES_DIR, 'storefront.webp'));

    console.log('✓ Prepared storefront.jpg & storefront.webp (800x600 retina)');
  }

  // 3. Salon interior - compact 720x960 for retina displays
  const interiorSrc = path.join(ROOT_DIR, 'images', 'Salon Interior.png');
  if (fs.existsSync(interiorSrc)) {
    await sharp(interiorSrc)
      .resize(720, 960, { fit: 'cover', position: 'center' })
      .sharpen({ sigma: 0.7, m1: 0.8, m2: 0.5 })
      .jpeg({ quality: 92, chromaSubsampling: '4:4:4' })
      .toFile(path.join(IMAGES_DIR, 'interior.jpg'));

    await sharp(interiorSrc)
      .resize(720, 960, { fit: 'cover', position: 'center' })
      .sharpen({ sigma: 0.7, m1: 0.8, m2: 0.5 })
      .webp({ quality: 90, effort: 6 })
      .toFile(path.join(IMAGES_DIR, 'interior.webp'));

    console.log('✓ Prepared interior.jpg & interior.webp (720x960 retina)');
  }

  // 4. Reference price list image
  const priceSrc = path.join(ROOT_DIR, 'images', 'Source', 'price-list-source.jpg');
  if (fs.existsSync(priceSrc)) {
    fs.copyFileSync(priceSrc, path.join(IMAGES_DIR, 'price-list-source.jpg'));
    console.log('✓ Copied price-list-source.jpg');
  }

  // 5. Headshots 1 to 8: High-Fidelity Super-Sampling & Unsharp Masking
  // Handles original filenames (including typo Headhsot 2.jpg)
  const headshotDefs = [
    { inNames: ['Headshot 1.jpg', 'headshot-1.jpg'], out: 'headshot-1' },
    { inNames: ['Headhsot 2.jpg', 'Headshot 2.jpg', 'headshot-2.jpg'], out: 'headshot-2' },
    { inNames: ['Headshot 3.jpg', 'headshot-3.jpg'], out: 'headshot-3' },
    { inNames: ['Headshot 4.jpg', 'headshot-4.jpg'], out: 'headshot-4' },
    { inNames: ['Headshot 5.jpg', 'headshot-5.jpg'], out: 'headshot-5' },
    { inNames: ['Headshot 6.jpg', 'headshot-6.jpg'], out: 'headshot-6' },
    { inNames: ['Headshot 7.jpg', 'headshot-7.jpg'], out: 'headshot-7' },
    { inNames: ['Headshot 8.jpg', 'headshot-8.jpg'], out: 'headshot-8' },
  ];

  for (const def of headshotDefs) {
    let sourcePath = null;
    for (const name of def.inNames) {
      const candidate = path.join(ROOT_DIR, 'images', name);
      if (fs.existsSync(candidate)) {
        sourcePath = candidate;
        break;
      }
    }

    if (!sourcePath) {
      console.warn(`! Source file for ${def.out} not found in Images/`);
      continue;
    }

    const meta = await sharp(sourcePath).metadata();
    const destJpg = path.join(IMAGES_DIR, `${def.out}.jpg`);
    const destWebp = path.join(IMAGES_DIR, `${def.out}.webp`);

    if (meta.width <= 300) {
      // Small thumbnail (206x206): Use Lanczos3 kernel to upscale to 500x500 with unsharp masking
      // This preserves sharp hair texture, eliminates browser blockiness, and provides full 2x retina density
      await sharp(sourcePath)
        .resize(500, 500, {
          kernel: 'lanczos3',
          fit: 'cover'
        })
        .sharpen({
          sigma: 0.82,
          m1: 1.15,
          m2: 0.70
        })
        .jpeg({ quality: 96, chromaSubsampling: '4:4:4' })
        .toFile(destJpg);

      await sharp(sourcePath)
        .resize(500, 500, {
          kernel: 'lanczos3',
          fit: 'cover'
        })
        .sharpen({
          sigma: 0.82,
          m1: 1.15,
          m2: 0.70
        })
        .webp({ quality: 92, effort: 6 })
        .toFile(destWebp);

      console.log(`✓ Enhanced ${def.out} (${meta.width}x${meta.height} -> 500x500 retina Lanczos3)`);
    } else {
      // High-resolution source (e.g. Headshot 6.jpg at 1536x2048):
      // Center-crop to 600x600 square with crisp sharpening
      await sharp(sourcePath)
        .resize(600, 600, { fit: 'cover', position: 'center' })
        .sharpen({ sigma: 0.6, m1: 0.8, m2: 0.4 })
        .jpeg({ quality: 94, chromaSubsampling: '4:4:4' })
        .toFile(destJpg);

      await sharp(sourcePath)
        .resize(600, 600, { fit: 'cover', position: 'center' })
        .sharpen({ sigma: 0.6, m1: 0.8, m2: 0.4 })
        .webp({ quality: 92, effort: 6 })
        .toFile(destWebp);

      console.log(`✓ Enhanced ${def.out} (${meta.width}x${meta.height} -> 600x600 retina)`);
    }
  }

  console.log('✓ All image assets prepared successfully!');
}

prepareImages().catch(console.error);
