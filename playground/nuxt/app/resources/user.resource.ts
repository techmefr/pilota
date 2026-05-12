import { defineResource } from '@pilota/core'
import { z } from 'zod'

export const userResource = defineResource({
    name: 'users',
    schema: z.object({
        id: z.union([z.number(), z.string()]),
        name: z.string().min(1, 'Le nom est requis'),
        email: z.string().email('Email invalide'),
        created_at: z.string().optional().nullable(),
        updated_at: z.string().optional().nullable(),
    }),
    fragments: {
        default: ['id', 'name', 'email', 'created_at'],
        withPosts: ['id', 'name', 'email', 'posts { id title content }'],
    },
})
