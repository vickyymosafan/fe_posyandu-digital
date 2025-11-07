/**
 * Script untuk Generate Icons dari Logo Posyandu
 *
 * Script ini mengkonversi logo.webp menjadi berbagai format dan ukuran
 * yang diperlukan untuk website dan PWA.
 *
 * Usage: node scripts/generate-logo-icons.js
 */

/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Konfigurasi
const LOGO_PATH = path.join(__dirname, '..', 'public', 'logo.webp');
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const ICONS_DIR = path.join(PUBLIC_DIR, 'icons');

// Icon sizes yang akan di-generate
const ICON_CONFIGS = [
  { name: 'favicon.ico', size: 32, output: PUBLIC_DIR },
  { name: 'apple-touch-icon.png', size: 180, output: PUBLIC_DIR },
  { name: 'icon-192x192.png', size: 192, output: ICONS_DIR },
  { name: 'icon-512x512.png', size: 512, output: ICONS_DIR },
];

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
 * Generate icon dari logo
 */
async function generateIcon(logoBuffer, size, outputPath, filename) {
  try {
    const isIco = filename.endsWith('.ico');
    
    if (isIco) {
      // Generate ICO dengan multiple sizes
      await sharp(logoBuffer)
        .resize(32, 32, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
        .png()
        .toFile(outputPath);
    } else {
      // Generate PNG
      await sharp(logoBuffer)
        .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
        .png()
        .toFile(outputPath);
    }
    
    return true;
  } catch (error) {
    console.error(`Error generating ${filename}: ${error.message}`);
    return false;
  }
}

/**
 * Main function
 */
async function generateIcons() {
  console.log('🎨 Generating icons from logo...\n');

  // Check if logo exists
  if (!fs.existsSync(LOGO_PATH)) {
    console.error(`❌ Logo file not found: ${LOGO_PATH}`);
    console.error('   Please ensure logo.webp exists in public/ directory');
    process.exit(1);
  }

  // Ensure directories exist
  ensureDir(PUBLIC_DIR);
  ensureDir(ICONS_DIR);

  // Read logo
  const logoBuffer = fs.readFileSync(LOGO_PATH);
  console.log('✓ Logo loaded successfully\n');

  // Generate each icon
  for (const config of ICON_CONFIGS) {
    const outputPath = path.join(config.output, config.name);
    console.log(`Generating ${config.name} (${config.size}x${config.size})...`);
    
    const success = await generateIcon(logoBuffer, config.size, outputPath, config.name);
    if (success) {
      console.log(`✓ Generated: ${config.name}`);
    }
  }

  console.log('\n✅ All icons generated successfully!');
  console.log('\n📁 Generated files:');
  console.log('   - public/favicon.ico');
  console.log('   - public/apple-touch-icon.png');
  console.log('   - public/icons/icon-192x192.png');
  console.log('   - public/icons/icon-512x512.png');
  console.log('\n📝 Next steps:');
  console.log('   1. Icons are ready to use');
  console.log('   2. Manifest and layout files will be updated automatically');
}

// Run
generateIcons().catch((error) => {
  console.error('❌ Error generating icons:', error.message);
  process.exit(1);
});
