import { createPilota, defineResource } from '@pilota/core'
import { SupabaseDriver } from '@pilota/driver-supabase'
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

export function createGearupPilota(url: string, key: string) {
    const supabase = new SupabaseDriver({ url, key })
    supabase.bindResource('products', productResource)
    return createPilota({ drivers: { supabase } })
}
