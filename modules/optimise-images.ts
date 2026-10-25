// Generates responsive recipe images before every dev/build/generate run,
// so it works whichever command the host uses to build the site.
import { defineNuxtModule, useLogger } from '@nuxt/kit'
// @ts-expect-error — plain JS build script
import { optimiseImages } from '../scripts/optimise-images.mjs'

export default defineNuxtModule({
  meta: { name: 'optimise-images' },
  async setup(_options, nuxt) {
    // Skip `nuxt prepare` (runs on npm install) — nothing is served then
    if (nuxt.options._prepare) return
    const logger = useLogger('optimise-images')
    await optimiseImages({ log: (message: string) => logger.info(message) })
  },
})
