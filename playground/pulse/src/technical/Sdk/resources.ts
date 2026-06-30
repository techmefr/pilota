import { defineResource } from 'nexdk'
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
    fragments: { default: ['id', 'name', 'price', 'image', 'category', 'stock'] },
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
        url: z.string().nullable(),
        sentry_issues: z.number(),
        sentry_criticals: z.number(),
        updated_at: z.string(),
    }),
    fragments: { default: ['id', 'name', 'status', 'open_bugs', 'deployments', 'team', 'url', 'sentry_issues', 'sentry_criticals', 'updated_at'] },
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
    fragments: { default: ['id', 'person', 'avatar', 'week', 'year', 'focus', 'blockers', 'wins'] },
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
    fragments: { default: ['id', 'project', 'version', 'date', 'tickets_resolved', 'tickets_total', 'notes'] },
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
    fragments: { default: ['id', 'title', 'status', 'category', 'owner', 'due_date'] },
})

export const absenceResource = defineResource({
    name: 'absences',
    schema: z.object({
        id: z.number(),
        person: z.string(),
        days: z.array(z.enum(['lun', 'mar', 'mer', 'jeu', 'ven'])),
        reason: z.enum(['conge', 'teletravail', 'formation', 'client', 'maladie']),
        note: z.string().nullable(),
    }),
    fragments: { default: ['id', 'person', 'days', 'reason', 'note'] },
})

export const devopsNeedResource = defineResource({
    name: 'devops_needs',
    schema: z.object({
        id: z.number(),
        title: z.string(),
        priority: z.enum(['low', 'medium', 'high', 'critical']),
        status: z.enum(['todo', 'in_progress', 'done']),
        owner: z.string().nullable(),
        project: z.string().nullable(),
        notes: z.string().nullable(),
    }),
    fragments: { default: ['id', 'title', 'priority', 'status', 'owner', 'project', 'notes'] },
})

export const weekInfoResource = defineResource({
    name: 'week_info',
    schema: z.object({
        id: z.number(),
        type: z.enum(['event', 'devtalk', 'score', 'news']),
        title: z.string(),
        detail: z.string().nullable(),
        date: z.string().nullable(),
    }),
    fragments: { default: ['id', 'type', 'title', 'detail', 'date'] },
})

export const revenueResource = defineResource({
    name: 'revenue',
    schema: z.object({
        id: z.number(),
        period: z.string(),
        amount: z.number(),
        target: z.number(),
        annual_cumul: z.number(),
        annual_target: z.number(),
    }),
    fragments: { default: ['id', 'period', 'amount', 'target', 'annual_cumul', 'annual_target'] },
})

export const contractResource = defineResource({
    name: 'contracts',
    schema: z.object({
        id: z.number(),
        type: z.enum(['franchise', 'propre']),
        count: z.number(),
        target: z.number(),
        value_k: z.number(),
    }),
    fragments: { default: ['id', 'type', 'count', 'target', 'value_k'] },
})

export type Product = z.infer<typeof productResource.schema>
export type Project = z.infer<typeof projectResource.schema>
export type Objective = z.infer<typeof objectiveResource.schema>
export type Delivery = z.infer<typeof deliveryResource.schema>
export type Mission = z.infer<typeof missionResource.schema>
export type Absence = z.infer<typeof absenceResource.schema>
export type DevOpsNeed = z.infer<typeof devopsNeedResource.schema>
export type WeekInfo = z.infer<typeof weekInfoResource.schema>
export type Revenue = z.infer<typeof revenueResource.schema>
export type Contract = z.infer<typeof contractResource.schema>
