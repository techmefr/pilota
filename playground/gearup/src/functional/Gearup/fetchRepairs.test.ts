import { describe, expect, it, vi } from 'vitest'
import { fetchRepairs } from './fetchRepairs'
import { mockRepairs } from '../../technical/Sdk/mock'

describe('fetchRepairs', () => {
    it('returns mock data without any network call', async () => {
        const fetchSpy = vi.spyOn(globalThis, 'fetch')
        const result = await fetchRepairs()
        expect(fetchSpy).not.toHaveBeenCalled()
        expect(result).toEqual(mockRepairs)
        fetchSpy.mockRestore()
    })

    it('returns all 6 repair records', async () => {
        const result = await fetchRepairs()
        expect(result).toHaveLength(6)
    })

    it('each repair has required fields', async () => {
        const result = await fetchRepairs()
        for (const repair of result) {
            expect(repair).toHaveProperty('id')
            expect(repair).toHaveProperty('ticket')
            expect(repair).toHaveProperty('employee')
            expect(repair).toHaveProperty('status')
        }
    })
})
