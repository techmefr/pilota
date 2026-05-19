import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mockOrders } from '../../technical/Sdk/mock'

vi.mock('../../technical/Sdk', () => {
    const getMock = vi.fn()
    return {
        sdk: {
            lomkit: {
                orders: { get: getMock },
            },
        },
    }
})

async function importFetch() {
    const mod = await import('./fetchOrders')
    return mod.fetchOrders
}

async function getSdkMock() {
    const mod = await import('../../technical/Sdk')
    return (mod.sdk.lomkit as unknown as { orders: { get: ReturnType<typeof vi.fn> } }).orders.get
}

describe('fetchOrders', () => {
    beforeEach(() => {
        vi.resetModules()
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    it('returns data from SDK when backend responds', async () => {
        const fetchOrders = await importFetch()
        const getMock = await getSdkMock()
        getMock.mockResolvedValueOnce({ data: mockOrders })

        const result = await fetchOrders()
        expect(result).toEqual(mockOrders)
    })

    it('falls back to mock data when SDK returns empty array', async () => {
        const fetchOrders = await importFetch()
        const getMock = await getSdkMock()
        getMock.mockResolvedValueOnce({ data: [] })

        const result = await fetchOrders()
        expect(result).toEqual(mockOrders)
    })

    it('falls back to mock data when SDK throws', async () => {
        const fetchOrders = await importFetch()
        const getMock = await getSdkMock()
        getMock.mockRejectedValueOnce(new Error('Network error'))

        const result = await fetchOrders()
        expect(result).toEqual(mockOrders)
    })

    it('returns 7 orders in mock data', async () => {
        const fetchOrders = await importFetch()
        const getMock = await getSdkMock()
        getMock.mockResolvedValueOnce({ data: [] })

        const result = await fetchOrders()
        expect(result).toHaveLength(7)
    })
})
