import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mockPcProfiles } from '../../technical/Sdk/mock'

vi.mock('../../technical/Sdk', () => {
    const getMock = vi.fn()
    return {
        sdk: {
            lomkit: {
                pcProfiles: { get: getMock },
            },
        },
    }
})

async function importFetch() {
    const mod = await import('./fetchPcProfiles')
    return mod.fetchPcProfiles
}

async function getSdkMock() {
    const mod = await import('../../technical/Sdk')
    return (mod.sdk.lomkit as unknown as { pcProfiles: { get: ReturnType<typeof vi.fn> } }).pcProfiles.get
}

describe('fetchPcProfiles', () => {
    beforeEach(() => {
        vi.resetModules()
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    it('returns data from SDK when backend responds', async () => {
        const fetchPcProfiles = await importFetch()
        const getMock = await getSdkMock()
        getMock.mockResolvedValueOnce({ data: mockPcProfiles })

        const result = await fetchPcProfiles()
        expect(result).toEqual(mockPcProfiles)
    })

    it('falls back to mock data when SDK returns empty array', async () => {
        const fetchPcProfiles = await importFetch()
        const getMock = await getSdkMock()
        getMock.mockResolvedValueOnce({ data: [] })

        const result = await fetchPcProfiles()
        expect(result).toEqual(mockPcProfiles)
    })

    it('falls back to mock data when SDK throws', async () => {
        const fetchPcProfiles = await importFetch()
        const getMock = await getSdkMock()
        getMock.mockRejectedValueOnce(new Error('Network error'))

        const result = await fetchPcProfiles()
        expect(result).toEqual(mockPcProfiles)
    })
})
