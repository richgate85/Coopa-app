import sharp from "sharp"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512]
const MASKABLE_SIZES = [192, 512]
const FAVICON_SIZES = [16, 32]
const APPLE_ICON_SIZE = 180

const OUTPUT_DIR = path.join(__dirname, "../public/icons")

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
}

async function generateIcon(size, isMaskable = false) {
  const filename = isMaskable ? `icon-maskable-${size}x${size}.png` : `icon-${size}x${size}.png`
  const filepath = path.join(OUTPUT_DIR, filename)

  // Create a green circle with white "C" logo
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .background { fill: #22A65B; }
          .text { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: ${Math.round(size * 0.5)}px; font-weight: 700; fill: white; text-anchor: middle; dominant-baseline: central; }
        </style>
      </defs>
      ${isMaskable ? `<rect class="background" width="${size}" height="${size}" rx="${Math.round(size * 0.2)}" />` : `<circle class="background" cx="${size / 2}" cy="${size / 2}" r="${size / 2}" />`}
      <text class="text" x="${size / 2}" y="${size / 2}">C</text>
    </svg>
  `

  try {
    await sharp(Buffer.from(svg)).png().toFile(filepath)
    console.log(`Generated: ${filename}`)
  } catch (error) {
    console.error(`Error generating ${filename}:`, error)
  }
}

async function generateFavicon(size) {
  const filename = `favicon-${size}x${size}.png`
  const filepath = path.join(OUTPUT_DIR, filename)

  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .background { fill: #22A65B; }
          .text { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: ${Math.round(size * 0.6)}px; font-weight: 700; fill: white; text-anchor: middle; dominant-baseline: central; }
        </style>
      </defs>
      <circle class="background" cx="${size / 2}" cy="${size / 2}" r="${size / 2}" />
      <text class="text" x="${size / 2}" y="${size / 2}">C</text>
    </svg>
  `

  try {
    await sharp(Buffer.from(svg)).png().toFile(filepath)
    console.log(`Generated: ${filename}`)
  } catch (error) {
    console.error(`Error generating ${filename}:`, error)
  }
}

async function generateAppleTouchIcon() {
  const filename = "apple-touch-icon.png"
  const filepath = path.join(OUTPUT_DIR, filename)

  const svg = `
    <svg width="${APPLE_ICON_SIZE}" height="${APPLE_ICON_SIZE}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .background { fill: #22A65B; }
          .text { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: ${Math.round(APPLE_ICON_SIZE * 0.5)}px; font-weight: 700; fill: white; text-anchor: middle; dominant-baseline: central; }
        </style>
      </defs>
      <rect class="background" width="${APPLE_ICON_SIZE}" height="${APPLE_ICON_SIZE}" rx="40" />
      <text class="text" x="${APPLE_ICON_SIZE / 2}" y="${APPLE_ICON_SIZE / 2}">C</text>
    </svg>
  `

  try {
    await sharp(Buffer.from(svg)).png().toFile(filepath)
    console.log(`Generated: ${filename}`)
  } catch (error) {
    console.error(`Error generating ${filename}:`, error)
  }
}

async function main() {
  console.log("[v0] Starting icon generation...")

  // Generate regular icons
  for (const size of ICON_SIZES) {
    await generateIcon(size, false)
  }

  // Generate maskable icons
  for (const size of MASKABLE_SIZES) {
    await generateIcon(size, true)
  }

  // Generate favicons
  for (const size of FAVICON_SIZES) {
    await generateFavicon(size)
  }

  // Generate Apple touch icon
  await generateAppleTouchIcon()

  console.log("[v0] Icon generation complete!")
}

main().catch(console.error)
