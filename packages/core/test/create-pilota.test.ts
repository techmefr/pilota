import { describe, expect, it, vi } from 'vitest'
import { createPilota } from '../src/create-pilota.ts'
import type { AnyResource, PilotaDriver, PilotaEventHandler } from '../src/types.ts'

class MockDriver implements PilotaDriver {
    readonly name: string
    readonly calls: Array<{ resource: string; method: string; payload: unknown }> = []

    constructor(name: string) {
        this.name = name
    }

    bindResource(_resourceName: string, _resource: AnyResource): void {}

    get(resource: string, payload: unknown, onEvent?: PilotaEventHandler, mock?: unknown): Promise<unknown> {
        this.calls.push({ resource, method: 'get', payload })
        return Promise.resolve(mock ?? { id: 1, fromDriver: this.name })
    }

    subscribe(resource: string, payload: unknown, onEvent?: PilotaEventHandler): () => void {
        this.calls.push({ resource, method: 'subscribe', payload })
        return () => {}
    }
}

describe('createPilota', () => {
    it('exposes each driver by key', () => {
        const lomkit = new MockDriver('lomkit')
        const sdk = createPilota({ drivers: { lomkit } })
        expect(sdk.lomkit).toBeDefined()
    })

    it('two drivers coexist without collision', () => {
        const lomkit = new MockDriver('lomkit')
        const nhost = new MockDriver('nhost')
        const sdk = createPilota({ drivers: { lomkit, nhost } })
        expect(sdk.lomkit).toBeDefined()
        expect(sdk.nhost).toBeDefined()
    })

    it('routes sdk.driver.resource.method to driver.method(resource, payload)', async () => {
        const lomkit = new MockDriver('lomkit')
        const sdk = createPilota({ drivers: { lomkit } })

        await sdk.lomkit.users.get({ id: 1 })

        expect(lomkit.calls).toHaveLength(1)
        expect(lomkit.calls[0]).toEqual({ resource: 'users', method: 'get', payload: { id: 1 } })
    })

    it('returns mock directly when provided (no real call check)', async () => {
        const lomkit = new MockDriver('lomkit')
        const sdk = createPilota({ drivers: { lomkit } })
        const mock = { id: 99, fromDriver: 'mock' }

        const result = await sdk.lomkit.users.get({ id: 99 }, undefined, mock)

        expect(result).toEqual(mock)
    })

    it('returns a cleanup function for reactive methods', () => {
        const lomkit = new MockDriver('lomkit')
        const sdk = createPilota({ drivers: { lomkit } })

        const unsub = sdk.lomkit.messages.subscribe({ roomId: 1 })

        expect(typeof unsub).toBe('function')
    })

    it('throws when driver does not have the requested method', () => {
        const lomkit = new MockDriver('lomkit')
        const sdk = createPilota({ drivers: { lomkit } })

        expect(() => sdk.lomkit.users.nonExistentMethod()).toThrow(
            'Driver "lomkit" has no method "nonExistentMethod"',
        )
    })
})
