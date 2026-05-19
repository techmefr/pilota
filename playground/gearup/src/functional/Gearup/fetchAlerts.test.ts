import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mockAlerts } from '../../technical/Sdk/mock'

vi.mock('../../technical/Sdk', () => {
    const getMock = vi.fn()
    return {
        sdk: {
            lomkit: {
                alerts: { get: getMock },
            },
        },
    }
})

async function importFetch() {
    const mod = await import('./fetchAlerts')
    return mod.fetchAlerts
}

async function getSdkMock() {
    const mod = await import('../../technical/Sdk')
    return (mod.sdk.lomkit as unknown as { alerts: { get: ReturnType<typeof vi.fn> } }).alerts.get
}

describe('fetchAlerts', () => {
    beforeEach(() => {
        vi.resetModules()
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    it('returns data from SDK when backend responds', async () => {
        const fetchAlerts = await importFetch()
        const getMock = await getSdkMock()
        getMock.mockResolvedValueOnce({ data: mockAlerts })

        const result = await fetchAlerts()
        expect(result).toEqual(mockAlerts)
    })

    it('falls back to mock data when SDK returns empty array', async () => {
        const fetchAlerts = await importFetch()
        const getMock = await getSdkMock()
        getMock.mockResolvedValueOnce({ data: [] })

        const result = await fetchAlerts()
        expect(result).toEqual(mockAlerts)
    })

    it('falls back to mock data when SDK throws', async () => {
        const fetchAlerts = await importFetch()
        const getMock = await getSdkMock()
        getMock.mockRejectedValueOnce(new Error('Network error'))

        const result = await fetchAlerts()
        expect(result).toEqual(mockAlerts)
    })

    it('returns 8 alerts in mock data', async () => {
        const fetchAlerts = await importFetch()
        const getMock = await getSdkMock()
        getMock.mockResolvedValueOnce({ data: [] })

        const result = await fetchAlerts()
        expect(result).toHaveLength(8)
    })
})
