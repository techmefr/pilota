import { createPilota, defineResource } from '@pilota/core'
import { LomkitDriver } from '@pilota/driver-lomkit'
import { z } from 'zod'

export const pcProfileResource = defineResource({
    name: 'pcProfiles',
    schema: z.object({
        id: z.number(),
        role: z.string(),
        model_tier: z.string(),
        model_name: z.string(),
        cpu: z.string(),
        ram: z.string(),
        storage: z.string(),
        gpu: z.string(),
        screens: z.number(),
        screen_spec: z.string(),
        profile_ram: z.string(),
        total: z.number(),
        stock: z.number(),
    }),
    fragments: {
        default: ['id', 'role', 'model_tier', 'model_name', 'cpu', 'ram', 'storage', 'gpu', 'screens', 'screen_spec', 'profile_ram', 'total', 'stock'],
    },
})

export type PcProfile = z.infer<typeof pcProfileResource.schema>

export function createGearupPilota(baseUrl: string) {
    const lomkit = new LomkitDriver({ baseUrl })
    lomkit.bindResource('pcProfiles', pcProfileResource)
    return createPilota({ drivers: { lomkit } })
}
