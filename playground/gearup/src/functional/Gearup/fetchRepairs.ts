import { sdk } from '../../technical/Sdk'
import { mockRepairs } from '../../technical/Sdk/mock'
import type { Repair } from '../../technical/Sdk/resources'

export type { Repair }

export async function fetchRepairs(): Promise<Repair[]> {
    try {
        const result = await sdk.lomkit.repairs.get()
        return result.data ?? mockRepairs
    } catch {
        return mockRepairs
    }
}
