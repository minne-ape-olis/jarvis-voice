// Generate PWA icons as simple PNGs using pure Node.js
// Run: node scripts/generate-icons.js

import { writeFileSync } from 'fs'

function createPNG(size) {
  // Minimal PNG with a solid dark background + cyan mic circle
  // Using a canvas-free approach: generate a simple 1-color PNG
  // For production, replace with real icons

  const { createCanvas } = await import('canvas').catch(() => null) || {}

  // Fallback: create a minimal valid PNG (1x1 scaled)
  // This is a placeholder - replace with actual icon files
  const header = Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, // PNG signature
  ])

  console.log(`Note: For production icons, use a tool like sharp or an online generator.`)
  console.log(`Place icon-192.png and icon-512.png in the public/ directory.`)
}

// Simple SVG-to-reference approach
const svgIcon = (size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="20" fill="#0f172a"/>
  <circle cx="50" cy="38" r="12" fill="none" stroke="#22d3ee" stroke-width="3"/>
  <path d="M35 52 C35 52 35 68 50 68 C65 68 65 52 65 52" fill="none" stroke="#22d3ee" stroke-width="3" stroke-linecap="round"/>
  <line x1="50" y1="68" x2="50" y2="78" stroke="#22d3ee" stroke-width="3" stroke-linecap="round"/>
  <line x1="40" y1="78" x2="60" y2="78" stroke="#22d3ee" stroke-width="3" stroke-linecap="round"/>
</svg>`

// Write SVG versions (browsers handle SVG icons well)
writeFileSync('public/icon-192.svg', svgIcon(192))
writeFileSync('public/icon-512.svg', svgIcon(512))

console.log('SVG icons written to public/')
console.log('For PNG icons, convert these SVGs using:')
console.log('  npx sharp-cli -i public/icon-512.svg -o public/icon-512.png resize 512')
console.log('  npx sharp-cli -i public/icon-192.svg -o public/icon-192.png resize 192')
