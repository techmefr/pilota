import { mockRepairs } from '../../technical/Sdk/mock'
import type { Repair } from '../../technical/Sdk/resources'

export type { Repair }

export async function fetchRepairs(): Promise<Repair[]> {
    return mockRepairs
}
