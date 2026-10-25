/**
 * Generates responsive AVIF and WebP versions of recipe images, plus a manifest
 * of dimensions and srcsets used by the RecipeImage component.
 *
 * Source:   public/images/recipes/**\/*.{jpg,jpeg,png}
 * Output:   public/images/_generated/... (gitignored)
 * Manifest: assets/image-manifest.json (gitignored)
 *
 * Runs automatically via modules/optimise-images.ts. Unchanged images are skipped.
 * Usage: node scripts/optimise-images.mjs
 */
import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'fs'
import { dirname, join, relative, extname } from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const PUBLIC_DIR = join(ROOT, 'public')
const SOURCE_DIR = join(PUBLIC_DIR, 'images', 'recipes')
const OUTPUT_DIR = join(PUBLIC_DIR, 'images', '_generated')
const MANIFEST_PATH = join(ROOT, 'assets', 'image-manifest.json')

const WIDTHS = [400, 800, 1200, 1600]
const FORMATS = {
  avif: { quality: 50 },
  webp: { quality: 75 },
}

function findImages(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) return findImages(path)
    return /\.(jpe?g|png)$/i.test(entry.name) ? [path] : []
  })
}

// Public URL for a file under public/, e.g. /images/recipes/apple-crumble/finished.jpg
const toUrl = path => '/' + relative(PUBLIC_DIR, path).split('\\').join('/')

export async function optimiseImages({ log = console.log } = {}) {
  const manifest = {}
  let generated = 0

  for (const source of findImages(SOURCE_DIR)) {
    const { width, height } = await sharp(source).metadata()
    const sourceTime = statSync(source).mtimeMs
    const base = relative(SOURCE_DIR, source).slice(0, -extname(source).length)

    // Never upscale; small images just get their own width
    const widths = WIDTHS.filter(w => w <= width)
    if (!widths.length) widths.push(width)

    const sources = {}
    for (const [format, options] of Object.entries(FORMATS)) {
      const entries = []
      for (const w of widths) {
        const output = join(OUTPUT_DIR, `${base}-${w}.${format}`)
        if (!existsSync(output) || statSync(output).mtimeMs < sourceTime) {
          mkdirSync(dirname(output), { recursive: true })
          await sharp(source).resize({ width: w })[format](options).toFile(output)
          generated++
        }
        entries.push(`${toUrl(output)} ${w}w`)
      }
      sources[format] = entries.join(', ')
    }

    manifest[toUrl(source)] = { width, height, sources }
  }

  mkdirSync(dirname(MANIFEST_PATH), { recursive: true })
  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n')
  log(`🖼️  Optimised images: ${Object.keys(manifest).length} sources, ${generated} files generated`)
}

// Allow running directly: node scripts/optimise-images.mjs
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  await optimiseImages()
}
