import { sdk } from '../../technical/Sdk'
import { mockPcProfiles } from '../../technical/Sdk/mock'
import type { PcProfile } from '../../technical/Sdk/resources'

export type { PcProfile }

export async function fetchPcProfiles(): Promise<PcProfile[]> {
    try {
        const result = await sdk.lomkit.pcProfiles.get()
        const fetched = result.data ?? []
        return fetched.length > 0 ? fetched : mockPcProfiles
    } catch {
        return mockPcProfiles
    }
}
