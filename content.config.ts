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
        // Set when a recipe is meaningfully revised; used for dateModified in structured data
        updated: z.string().optional(),
        tags: z.array(z.string()).optional(),
        category: z.enum(['Breakfast', 'Lunch', 'Dinner', 'Pudding']).optional(),
        draft: z.boolean().optional().default(false),
        prepTime: z.string().optional(),
        cookTime: z.string().optional(),
        servings: z.number().optional(),
        // Preset multipliers offered in the "Scale" dropdown, e.g. ["1/4", "1/2", 1, 2]
        scaleOptions: z.array(
          z.union([z.number().positive(), z.string().regex(/^\d+\/\d+$/, 'Use a fraction like "1/4"')])
        ).optional(),
        image: z.string().optional(),
        imageAlt: z.string().optional(),
        intro: z.string().min(80, 'Intro must be at least 80 characters for SEO'),
        steps: z.array(z.string()).optional(),
        serve: z.string().optional(),
        tips: z.array(z.string()).optional(),
        ingredients: z.array(
          z.object({
            group: z.string().optional(),
            items: z.array(z.string()),
          })
        ).optional(),
        recipeCuisine: z.string().optional(),
        keywords: z.array(z.string()).optional(),
        nutrition: z.object({
          calories: z.string().optional(),
          fatContent: z.string().optional(),
          carbohydrateContent: z.string().optional(),
          proteinContent: z.string().optional(),
          fiberContent: z.string().optional(),
          sugarContent: z.string().optional(),
          sodiumContent: z.string().optional(),
        }).optional(),
      })
    }),
    pages: defineCollection({
      type: 'data',
      source: 'pages/**/*.yml',
    })
  }
})
