import { createPilota, defineResource } from '@pilota/core'
import { LomkitDriver } from '@pilota/driver-lomkit'
import { z } from 'zod'

export const productResource = defineResource({
    name: 'products',
    schema: z.object({
        id: z.number(),
        name: z.string(),
        description: z.string(),
        price: z.number(),
        image: z.string(),
        category: z.string(),
        stock: z.number(),
    }),
    fragments: {
        default: ['id', 'name', 'price', 'image', 'category', 'stock'],
    },
})

export type Product = z.infer<typeof productResource.schema>

const lomkit = new LomkitDriver({
    baseUrl: process.env.LARAVEL_API_URL ?? 'http://localhost:8000/api',
})
lomkit.bindResource('products', productResource)

export const pilota = createPilota({ drivers: { lomkit } })
