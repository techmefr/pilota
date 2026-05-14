import { defineResource } from '@pilota/core'
import { z } from 'zod'

export const cartItemResource = defineResource({
    name: 'cart_items',
    schema: z.object({
        id: z.number().optional(),
        product_id: z.number(),
        product_name: z.string(),
        unit_price: z.number().positive(),
        quantity: z.number().int().min(1),
    }),
    fragments: {
        default: ['id', 'product_id', 'product_name', 'unit_price', 'quantity'],
    },
})
