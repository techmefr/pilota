import { sdk } from '@/technical/Sdk'
import { mockProjects } from '@/technical/Sdk/mock'
import type { Project } from '@/technical/Sdk'

export type { Project }

export async function fetchProjects(): Promise<Project[]> {
    try {
        const result = await (sdk as any).lomkit.projects.get()
        return result.data ?? mockProjects
    } catch {
        return mockProjects
    }
}
