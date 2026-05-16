import { createPilota, defineResource } from '@pilota/core'
import { NhostDriver } from '@pilota/driver-nhost'
import { z } from 'zod'

export const productResource = defineResource({
    name: 'products',
    schema: z.object({
        id: z.coerce.number(),
        name: z.string(),
        description: z.string(),
        price: z.coerce.number(),
        image: z.string(),
        category: z.string(),
        stock: z.coerce.number(),
    }),
    fragments: {
        default: ['id', 'name', 'price', 'image', 'category', 'stock'],
    },
})

export type Product = z.infer<typeof productResource.schema>

export function createVotaPilota(endpoint: string) {
    const nhost = new NhostDriver({
        endpoint,
        adminSecret: 'pilota-admin-secret',
    })
    nhost.bindResource('products', productResource)
    return createPilota({ drivers: { nhost } })
}
