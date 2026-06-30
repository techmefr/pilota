import { defineResource } from 'nexdk'
import { z } from 'zod'

export const sessionResource = defineResource({
    name: 'planning_sessions',
    schema: z.object({
        id: z.string().uuid(),
        code: z.string().min(4).max(12),
        name: z.string().min(1).max(100),
        project: z.string().max(100),
        scale: z.enum(['fibonacci', 'simplified', 'tshirt', 'custom']),
        custom_scale: z.array(z.string().min(1)).max(30),
        created_by: z.string().min(1).max(50),
        current_task_id: z.string().uuid().nullable(),
        created_at: z.string().datetime(),
    }),
    fragments: {
        default: ['id', 'code', 'name', 'project', 'scale', 'custom_scale', 'created_by', 'current_task_id', 'created_at'],
    },
})

export const taskResource = defineResource({
    name: 'planning_tasks',
    schema: z.object({
        id: z.string().uuid(),
        session_id: z.string().uuid(),
        title: z.string().min(1).max(200),
        description: z.string().max(1000),
        link: z.string().max(500),
        image: z.string().max(500),
        tags: z.array(z.string().min(1)).max(10),
        added_by: z.string().min(1).max(50),
        estimate: z.string().max(10).nullable(),
        sort_order: z.number().int().min(0),
        created_at: z.string().datetime(),
    }),
    fragments: {
        default: ['id', 'session_id', 'title', 'description', 'link', 'image', 'tags', 'added_by', 'estimate', 'sort_order', 'created_at'],
    },
})

export const participantResource = defineResource({
    name: 'planning_participants',
    schema: z.object({
        id: z.string().uuid(),
        session_id: z.string().uuid(),
        name: z.string().min(1).max(50),
        created_at: z.string().datetime(),
    }),
    fragments: {
        default: ['id', 'session_id', 'name', 'created_at'],
    },
})

export const voteResource = defineResource({
    name: 'planning_votes',
    schema: z.object({
        id: z.string().uuid(),
        task_id: z.string().uuid(),
        session_id: z.string().uuid(),
        participant: z.string().min(1).max(50),
        value: z.string().max(10).nullable(),
        revealed: z.boolean(),
        created_at: z.string().datetime(),
    }),
    fragments: {
        default: ['id', 'task_id', 'session_id', 'participant', 'value', 'revealed', 'created_at'],
    },
})
