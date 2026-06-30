import { sdk } from '@/technical/Sdk'
import { mockMissions } from '@/technical/Sdk/mock'
import type { Mission } from '@/technical/Sdk'

export type { Mission }

export async function fetchMissions(): Promise<Mission[]> {
    try {
        const result = await sdk.lomkit.missions.get()
        return result.data ?? mockMissions
    } catch {
        return mockMissions
    }
}
