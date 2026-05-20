import { sdk } from '@/technical/Sdk'
import { mockWeekInfos } from '@/technical/Sdk/mock'
import type { WeekInfo } from '@/technical/Sdk'

export type { WeekInfo }

export async function fetchWeekInfo(): Promise<WeekInfo[]> {
    try {
        const result = await (sdk as any).lomkit.week_info.get()
        return result.data ?? mockWeekInfos
    } catch {
        return mockWeekInfos
    }
}
