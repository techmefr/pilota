export type Scale = 'fibonacci' | 'simplified' | 'tshirt' | 'custom'

export interface Session {
    id: string
    code: string
    name: string
    project: string
    scale: Scale
    custom_scale: string[]
    created_by: string
    current_task_id: string | null
    created_at: string
}

export interface Task {
    id: string
    session_id: string
    title: string
    description: string
    link: string
    image: string
    tags: string[]
    added_by: string
    estimate: string | null
    sort_order: number
    created_at: string
}

export interface Participant {
    id: string
    session_id: string
    name: string
    created_at: string
}

export interface Vote {
    id: string
    task_id: string
    session_id: string
    participant: string
    value: string | null
    revealed: boolean
    created_at: string
}

export const SCALES: Record<string, string[]> = {
    fibonacci: ['1', '2', '3', '5', '8', '13', '?', '∞'],
    simplified: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '?'],
    tshirt: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '?'],
}

export const SCALE_LABELS: Record<string, string> = {
    fibonacci: 'Fibonacci',
    simplified: 'Simplifiée',
    tshirt: 'T-shirt',
    custom: 'Personnalisée',
}

export const AVAILABLE_TAGS = ['front', 'back', 'devops', 'cdp', 'design', 'data', 'mobile', 'sécurité', 'infra', 'test']
