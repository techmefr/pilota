import { defineResource } from '@pilota/core'
import { z } from 'zod'

export const productResource = defineResource({
    name: 'products',
    schema: z.object({
        id: z.number(),
        name: z.string().min(1),
        description: z.string(),
        price: z.number().positive(),
        image: z.string(),
        category: z.string(),
        stock: z.number().int().min(0),
    }),
    fragments: {
        default: ['id', 'name', 'price', 'image', 'category', 'stock'],
        detail: ['id', 'name', 'description', 'price', 'image', 'category', 'stock'],
    },
})
export type Product = z.infer<typeof productResource.schema>

export const cartItemResource = defineResource({
    name: 'cartItems',
    schema: z.object({
        id: z.number().optional(),
        product_id: z.number(),
        product_name: z.string(),
        unit_price: z.number().positive(),
        quantity: z.number().int().min(1),
    }),
    fragments: {
        default: ['id', 'product_id', 'product_name', 'unit_price', 'quantity'],
    },
})
export type CartItem = z.infer<typeof cartItemResource.schema>

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
export type Message = z.infer<typeof messageResource.schema>

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
export type User = z.infer<typeof userResource.schema>

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
export type Order = z.infer<typeof orderResource.schema>
