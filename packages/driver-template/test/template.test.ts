import { defineResource } from 'nexdk'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { createTemplateDriver } from '../src/driver.ts'

const UserSchema = z.object({ id: z.number(), name: z.string() })
const userResource = defineResource({ name: 'users', schema: UserSchema })

const mockFetch = vi.fn()

beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch)
})

afterEach(() => {
    vi.unstubAllGlobals()
    mockFetch.mockReset()
})

function makeDriver() {
    const driver = createTemplateDriver({ baseUrl: 'http://localhost:4000/api' })
    driver.bindResource('users', userResource)
    return driver as unknown as Record<string, (...args: unknown[]) => Promise<unknown>>
}

describe('TemplateDriver', () => {
    it('get → GET /{resource}', async () => {
        mockFetch.mockResolvedValueOnce({ ok: true, json: async () => [{ id: 1, name: 'Alice' }] })
        const driver = makeDriver()
        const result = await driver.get('users', {})

        expect(mockFetch).toHaveBeenCalledWith(
            'http://localhost:4000/api/users',
            expect.objectContaining({ method: 'GET' }),
        )
        expect(result).toEqual([{ id: 1, name: 'Alice' }])
    })

    it('emits error then throws on a non-OK response', async () => {
        mockFetch.mockResolvedValueOnce({ ok: false, status: 500, json: async () => ({}) })
        const driver = makeDriver()
        const events: string[] = []

        await expect(
            driver.get('users', {}, (event: string) => events.push(event)),
        ).rejects.toThrow('HTTP 500')

        expect(events).toContain('request')
        expect(events.filter(e => e === 'error')).toHaveLength(1)
        expect(events).not.toContain('success')
    })
})
