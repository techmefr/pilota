import { defineResource } from '@pilota/core'
import { z } from 'zod'

export const productResource = defineResource({
    name: 'products',
    schema: z.object({
        id: z.number(),
        name: z.string(),
        description: z.string(),
        price: z.number(),
        image: z.string(),
        category: z.string(),
        stock: z.number(),
    }),
    fragments: {
        default: ['id', 'name', 'price', 'image', 'category', 'stock'],
    },
})

export const projectResource = defineResource({
    name: 'projects',
    schema: z.object({
        id: z.number(),
        name: z.string(),
        status: z.enum(['ok', 'warning', 'critical', 'inactive']),
        open_bugs: z.number(),
        deployments: z.array(z.string()),
        team: z.string(),
        updated_at: z.string(),
    }),
    fragments: {
        default: ['id', 'name', 'status', 'open_bugs', 'deployments', 'team', 'updated_at'],
    },
})

export const objectiveResource = defineResource({
    name: 'objectives',
    schema: z.object({
        id: z.number(),
        person: z.string(),
        avatar: z.string().nullable(),
        week: z.number(),
        year: z.number(),
        focus: z.string(),
        blockers: z.array(z.string()),
        wins: z.array(z.string()),
    }),
    fragments: {
        default: ['id', 'person', 'avatar', 'week', 'year', 'focus', 'blockers', 'wins'],
    },
})

export const deliveryResource = defineResource({
    name: 'deliveries',
    schema: z.object({
        id: z.number(),
        project: z.string(),
        version: z.string(),
        date: z.string(),
        tickets_resolved: z.number(),
        tickets_total: z.number(),
        notes: z.string().nullable(),
    }),
    fragments: {
        default: ['id', 'project', 'version', 'date', 'tickets_resolved', 'tickets_total', 'notes'],
    },
})

export const missionResource = defineResource({
    name: 'missions',
    schema: z.object({
        id: z.number(),
        title: z.string(),
        status: z.enum(['todo', 'in_progress', 'done', 'blocked']),
        category: z.enum(['opco', 'compliance', 'project_management', 'features']),
        owner: z.string().nullable(),
        due_date: z.string().nullable(),
    }),
    fragments: {
        default: ['id', 'title', 'status', 'category', 'owner', 'due_date'],
    },
})

export type Product = z.infer<typeof productResource.schema>
export type Project = z.infer<typeof projectResource.schema>
export type Objective = z.infer<typeof objectiveResource.schema>
export type Delivery = z.infer<typeof deliveryResource.schema>
export type Mission = z.infer<typeof missionResource.schema>
