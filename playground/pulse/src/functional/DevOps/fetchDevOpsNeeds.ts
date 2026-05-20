import { sdk } from '@/technical/Sdk'
import { mockDevOpsNeeds } from '@/technical/Sdk/mock'
import type { DevOpsNeed } from '@/technical/Sdk'

export type { DevOpsNeed }

export async function fetchDevOpsNeeds(): Promise<DevOpsNeed[]> {
    try {
        const result = await (sdk as any).lomkit.devops_needs.get()
        return result.data ?? mockDevOpsNeeds
    } catch {
        return mockDevOpsNeeds
    }
}
