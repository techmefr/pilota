import { defineResource } from '@pilota/core'
import { z } from 'zod'

export const messageResource = defineResource({
    name: 'messages',
    schema: z.object({
        id: z.string(),
        room_id: z.string(),
        content: z.string().min(1),
        author: z.string().min(1),
        created_at: z.string().optional().nullable(),
    }),
    fragments: {
        default: ['id', 'room_id', 'content', 'author', 'created_at'],
    },
})
