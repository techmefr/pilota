import { defineResource } from '@pilota/core'
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

export const assignmentResource = defineResource({
    name: 'assignments',
    schema: z.object({
        id: z.number(),
        employee: z.string(),
        email: z.string(),
        team: z.string(),
        department: z.string(),
        model: z.string(),
        serial: z.string(),
        assigned_at: z.string(),
        status: z.enum(['active', 'repair', 'returned']),
    }),
    fragments: {
        default: ['id', 'employee', 'email', 'team', 'department', 'model', 'serial', 'assigned_at', 'status'],
    },
})

export const orderResource = defineResource({
    name: 'orders',
    schema: z.object({
        id: z.number(),
        ref: z.string(),
        type: z.enum(['hardware', 'parts', 'consumable']),
        item: z.string(),
        quantity: z.number(),
        reason: z.string(),
        requested_by: z.string(),
        status: z.enum(['pending', 'approved', 'ordered', 'delivered']),
        created_date: z.string(),
    }),
    fragments: {
        default: ['id', 'ref', 'type', 'item', 'quantity', 'reason', 'requested_by', 'status', 'created_date'],
    },
})

export const alertResource = defineResource({
    name: 'alerts',
    schema: z.object({
        id: z.number(),
        type: z.enum(['warranty', 'age', 'performance', 'security']),
        severity: z.enum(['critical', 'warning', 'info']),
        device: z.string(),
        serial: z.string(),
        employee: z.string(),
        description: z.string(),
        due_date: z.string(),
        status: z.enum(['active', 'acknowledged', 'resolved']),
    }),
    fragments: {
        default: ['id', 'type', 'severity', 'device', 'serial', 'employee', 'description', 'due_date', 'status'],
    },
})

export type PcProfile = z.infer<typeof pcProfileResource.schema>
export type Assignment = z.infer<typeof assignmentResource.schema>
export type Order = z.infer<typeof orderResource.schema>
export type Alert = z.infer<typeof alertResource.schema>

export type Repair = {
    id: number
    ticket: string
    employee: string
    team: string
    device: string
    serial: string
    issue: string
    status: 'open' | 'in_progress' | 'waiting_parts' | 'closed'
    technician: string | null
    opened_at: string
    closed_at: string | null
    parts: string[]
}
