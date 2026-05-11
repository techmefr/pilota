import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { defineResource, parseMock } from '../src/define-resource.ts'

const UserSchema = z.object({
    id: z.number(),
    name: z.string(),
    email: z.string().email(),
})

describe('defineResource', () => {
    it('stores name and schema', () => {
        const resource = defineResource({ name: 'users', schema: UserSchema })
        expect(resource.name).toBe('users')
        expect(resource.schema).toBe(UserSchema)
    })

    it('defaults fragments and relations to empty objects', () => {
        const resource = defineResource({ name: 'users', schema: UserSchema })
        expect(resource.fragments).toEqual({})
        expect(resource.relations).toEqual({})
    })

    it('stores fragments when provided', () => {
        const resource = defineResource({
            name: 'users',
            schema: UserSchema,
            fragments: { withPosts: ['id', 'name', 'posts { id title }'] },
        })
        expect(resource.fragments['withPosts']).toEqual(['id', 'name', 'posts { id title }'])
    })
})

describe('parseMock', () => {
    const resource = defineResource({ name: 'users', schema: UserSchema })

    it('returns the mock when it matches the schema', () => {
        const mock = { id: 1, name: 'Alice', email: 'alice@test.com' }
        expect(parseMock(resource, mock)).toEqual(mock)
    })

    it('throws when the mock does not match the schema', () => {
        expect(() => parseMock(resource, { id: 'not-a-number', name: 'Alice' })).toThrow()
    })
})
