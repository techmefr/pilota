import { defineResource } from '@pilota/core'
import { z } from 'zod'

export const postResource = defineResource({
    name: 'posts',
    schema: z.object({
        id: z.union([z.number(), z.string()]),
        user_id: z.union([z.number(), z.string()]),
        title: z.string().min(1),
        content: z.string(),
    }),
    fragments: {
        default: ['id', 'user_id', 'title', 'content'],
    },
})
