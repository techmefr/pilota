import { defineResource } from '@pilota/core'
import { z } from 'zod'

export const productResource = defineResource({
    name: 'products',
    schema: z.object({
        id: z.number(),
        name: z.string().min(1),
        description: z.string(),
        price: z.number().positive(),
        image: z.string(),
        category: z.string(),
        stock: z.number().int().min(0),
    }),
    fragments: {
        default: ['id', 'name', 'price', 'image', 'category', 'stock'],
        detail: ['id', 'name', 'description', 'price', 'image', 'category', 'stock'],
    },
})
