// Validates recipe frontmatter before build.
// Fails with a non-zero exit code if any recipe is missing required fields
// or doesn't meet minimum SEO requirements.

import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'

const RECIPES_DIR = join(import.meta.dirname, '..', 'content', 'recipes')
const MIN_INTRO_LENGTH = 80
const MAX_DESCRIPTION_LENGTH = 160

const errors = []
const warnings = []

for (const file of readdirSync(RECIPES_DIR).filter(f => f.endsWith('.md'))) {
  const content = readFileSync(join(RECIPES_DIR, file), 'utf-8')

  // Extract frontmatter between --- markers
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) {
    errors.push(`${file}: No frontmatter found`)
    continue
  }

  const frontmatter = match[1]

  // Check for intro field
  const introMatch = frontmatter.match(/^intro:\s*["']?(.*?)["']?\s*$/m)
  if (!introMatch || !introMatch[1]) {
    errors.push(`${file}: Missing required 'intro' field (min ${MIN_INTRO_LENGTH} chars for SEO)`)
    continue
  }

  const introLength = introMatch[1].length
  if (introLength < MIN_INTRO_LENGTH) {
    errors.push(`${file}: 'intro' is ${introLength} chars, needs at least ${MIN_INTRO_LENGTH} for SEO`)
  }

  // Description is used as the meta description — search results truncate long ones
  const descriptionMatch = frontmatter.match(/^description:\s*["']?(.*?)["']?\s*$/m)
  const descriptionLength = descriptionMatch?.[1].length ?? 0
  if (descriptionLength > MAX_DESCRIPTION_LENGTH) {
    warnings.push(`${file}: 'description' is ${descriptionLength} chars, search results may truncate it after ~${MAX_DESCRIPTION_LENGTH}`)
  }
}

if (warnings.length) {
  console.warn('\n⚠️  Recipe warnings:\n')
  warnings.forEach(w => console.warn(`  • ${w}`))
  console.warn()
}

if (errors.length) {
  console.error('\n❌ Recipe validation failed:\n')
  errors.forEach(e => console.error(`  • ${e}`))
  console.error()
  process.exit(1)
} else {
  console.log(`✅ All recipes pass validation (${readdirSync(RECIPES_DIR).filter(f => f.endsWith('.md')).length} checked)`)
}
