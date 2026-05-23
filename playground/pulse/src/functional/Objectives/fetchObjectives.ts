import { mockObjectives } from '@/technical/Sdk/mock'
import type { Objective } from '@/technical/Sdk'

export type { Objective }

export function getCurrentWeek(): { week: number; year: number } {
    const now = new Date()
    const d = new Date(now)
    d.setHours(0, 0, 0, 0)
    d.setDate(d.getDate() + 4 - (d.getDay() || 7))
    const yearStart = new Date(d.getFullYear(), 0, 1)
    const week = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
    return { week, year: d.getFullYear() }
}

// Objectives utilisent le mock driver Pilota SDK — démo du système mock
export async function fetchObjectives(week: number, year: number): Promise<Objective[]> {
    return mockObjectives.filter(o => o.week === week && o.year === year)
}
