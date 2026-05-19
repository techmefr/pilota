import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mockAssignments } from '../../technical/Sdk/mock'

vi.mock('../../technical/Sdk', () => {
    const getMock = vi.fn()
    return {
        sdk: {
            lomkit: {
                assignments: { get: getMock },
            },
        },
    }
})

async function importFetch() {
    const mod = await import('./fetchInventory')
    return mod.fetchInventory
}

async function getSdkMock() {
    const mod = await import('../../technical/Sdk')
    return (mod.sdk.lomkit as unknown as { assignments: { get: ReturnType<typeof vi.fn> } }).assignments.get
}

describe('fetchInventory', () => {
    beforeEach(() => {
        vi.resetModules()
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    it('returns data from SDK when backend responds', async () => {
        const fetchInventory = await importFetch()
        const getMock = await getSdkMock()
        getMock.mockResolvedValueOnce({ data: mockAssignments })

        const result = await fetchInventory()
        expect(result).toEqual(mockAssignments)
    })

    it('falls back to mock data when SDK returns empty array', async () => {
        const fetchInventory = await importFetch()
        const getMock = await getSdkMock()
        getMock.mockResolvedValueOnce({ data: [] })

        const result = await fetchInventory()
        expect(result).toEqual(mockAssignments)
    })

    it('falls back to mock data when SDK throws', async () => {
        const fetchInventory = await importFetch()
        const getMock = await getSdkMock()
        getMock.mockRejectedValueOnce(new Error('Network error'))

        const result = await fetchInventory()
        expect(result).toEqual(mockAssignments)
    })

    it('returns 15 assignments in mock data', async () => {
        const fetchInventory = await importFetch()
        const getMock = await getSdkMock()
        getMock.mockResolvedValueOnce({ data: [] })

        const result = await fetchInventory()
        expect(result).toHaveLength(15)
    })
})
