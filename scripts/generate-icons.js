/**
 * Script untuk Generate Placeholder PWA Icons
 *
 * Script ini membuat placeholder icons untuk PWA dengan ukuran 192x192 dan 512x512.
 * Icons ini harus diganti dengan design asli sebelum production.
 *
 * Usage: node scripts/generate-icons.js
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Konfigurasi
const ICON_SIZES = [192, 512];
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'icons');
const APP_NAME = 'Posyandu';
const BG_COLOR = '#171717'; // neutral-900
const TEXT_COLOR = '#ffffff';

/**
 * Generate SVG icon dengan text
 */
function generateSVG(size) {
  const fontSize = size / 4;
  const initial = APP_NAME.charAt(0);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="${BG_COLOR}" rx="${size / 10}"/>
  <text 
    x="50%" 
    y="50%" 
    font-family="Arial, sans-serif" 
    font-size="${fontSize}" 
    font-weight="bold" 
    fill="${TEXT_COLOR}" 
    text-anchor="middle" 
    dominant-baseline="central"
  >${initial}</text>
  <circle cx="${size / 2}" cy="${size / 2}" r="${size / 3}" fill="none" stroke="${TEXT_COLOR}" stroke-width="${size / 40}" opacity="0.3"/>
</svg>`;
}

/**
 * Ensure directory exists
 */
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✓ Created directory: ${dir}`);
  }
}

/**
 * Convert SVG to PNG using sharp
 */
async function convertSVGtoPNG(svgBuffer, size, outputPath) {
  try {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outputPath);
    return true;
  } catch (error) {
    console.error(`Error converting to PNG: ${error.message}`);
    return false;
  }
}

/**
 * Generate icons
 */
async function generateIcons() {
  console.log('🎨 Generating PWA placeholder icons...\n');

  // Ensure output directory exists
  ensureDir(OUTPUT_DIR);

  // Generate icons for each size
  for (const size of ICON_SIZES) {
    const svg = generateSVG(size);
    const svgFilename = `icon-${size}x${size}.svg`;
    const pngFilename = `icon-${size}x${size}.png`;
    const svgPath = path.join(OUTPUT_DIR, svgFilename);
    const pngPath = path.join(OUTPUT_DIR, pngFilename);

    // Save SVG
    fs.writeFileSync(svgPath, svg, 'utf8');
    console.log(`✓ Generated: ${svgFilename}`);

    // Convert to PNG
    const svgBuffer = Buffer.from(svg);
    const success = await convertSVGtoPNG(svgBuffer, size, pngPath);
    if (success) {
      console.log(`✓ Converted: ${pngFilename}`);
    }
  }

  console.log('\n✅ Icons generated successfully!');
  console.log('\n📝 Note: These are placeholder icons.');
  console.log('   Replace them with your actual app icons before production.');
  console.log('\n📁 Generated files:');
  console.log('   - public/icons/icon-192x192.svg');
  console.log('   - public/icons/icon-192x192.png');
  console.log('   - public/icons/icon-512x512.svg');
  console.log('   - public/icons/icon-512x512.png');
}

// Run
generateIcons().catch((error) => {
  console.error('❌ Error generating icons:', error.message);
  process.exit(1);
});
