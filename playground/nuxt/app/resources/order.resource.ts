import { z } from 'zod'
import { defineResource } from '@pilota/core'

export const orderResource = defineResource({
    name: 'orders',
    schema: z.object({
        full_name: z.string().min(2, 'Nom requis (min 2 caractères)'),
        email: z.string().email('Adresse email invalide'),
        address: z.string().min(5, 'Adresse requise'),
        city: z.string().min(2, 'Ville requise'),
        zip_code: z.string().regex(/^\d{5}$/, 'Code postal invalide (5 chiffres)'),
        phone: z.string().nullable().optional(),
        notes: z.string().nullable().optional(),
    }),
})
