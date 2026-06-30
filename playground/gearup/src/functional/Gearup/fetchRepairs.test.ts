import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mockRepairs } from '../../technical/Sdk/mock'

vi.mock('../../technical/Sdk', () => {
    const getMock = vi.fn()
    return {
        sdk: {
            lomkit: {
                repairs: { get: getMock },
            },
        },
    }
})

async function importFetch() {
    const mod = await import('./fetchRepairs')
    return mod.fetchRepairs
}

async function getSdkMock() {
    const mod = await import('../../technical/Sdk')
    return (mod.sdk.lomkit as unknown as { repairs: { get: ReturnType<typeof vi.fn> } }).repairs.get
}

describe('fetchRepairs', () => {
    beforeEach(() => {
        vi.resetModules()
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    it('returns data from SDK when backend responds', async () => {
        const fetchRepairs = await importFetch()
        const getMock = await getSdkMock()
        getMock.mockResolvedValueOnce({ data: mockRepairs })

        const result = await fetchRepairs()
        expect(result).toEqual(mockRepairs)
    })

    it('falls back to mock data when SDK throws', async () => {
        const fetchRepairs = await importFetch()
        const getMock = await getSdkMock()
        getMock.mockRejectedValueOnce(new Error('Network error'))

        const result = await fetchRepairs()
        expect(result).toEqual(mockRepairs)
    })

    it('returns all 6 repair records', async () => {
        const fetchRepairs = await importFetch()
        const getMock = await getSdkMock()
        getMock.mockRejectedValueOnce(new Error('Network error'))

        const result = await fetchRepairs()
        expect(result).toHaveLength(6)
    })

    it('each repair has required fields', async () => {
        const fetchRepairs = await importFetch()
        const getMock = await getSdkMock()
        getMock.mockRejectedValueOnce(new Error('Network error'))

        const result = await fetchRepairs()
        for (const repair of result) {
            expect(repair).toHaveProperty('id')
            expect(repair).toHaveProperty('ticket')
            expect(repair).toHaveProperty('employee')
            expect(repair).toHaveProperty('status')
        }
    })
})
