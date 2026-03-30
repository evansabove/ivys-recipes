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
        category: z.enum(['Breakfast', 'Lunch', 'Dinner', 'Pudding']).optional(),
        prepTime: z.string().optional(),
        cookTime: z.string().optional(),
        servings: z.number().optional(),
        image: z.string().optional(),
        imageAlt: z.string().optional(),
        intro: z.string().optional(),
        steps: z.array(z.string()).optional(),
        serve: z.string().optional(),
        tips: z.array(z.string()).optional(),
        ingredients: z.array(
          z.object({
            group: z.string().optional(),
            items: z.array(z.string()),
          })
        ).optional(),
      })
    }),
    pages: defineCollection({
      type: 'data',
      source: 'pages/**/*.yml',
    })
  }
})
