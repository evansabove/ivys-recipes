import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    recipes: defineCollection({
      type: 'page',
      source: 'recipes/**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.string(),
        tags: z.array(z.string()).optional(),
        cuisine: z.string().optional(),
        prepTime: z.string().optional(),
        cookTime: z.string().optional(),
        servings: z.number().optional(),
        image: z.string().optional(),
        imageAlt: z.string().optional(),
      })
    }),
    pages: defineCollection({
      type: 'data',
      source: 'pages/**/*.yml',
    })
  }
})
