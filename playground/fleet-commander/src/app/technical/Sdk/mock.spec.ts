import { describe, it, expect } from 'vitest'
import {
    assignmentResource,
    repairResource,
    orderResource,
    alertResource,
    pcProfileResource,
} from './resources'
import {
    mockAssignments,
    mockRepairs,
    mockOrders,
    mockAlerts,
    mockPcProfiles,
} from './mock'

describe('Mock data — assignments', () => {
    it('contient au moins un item', () => {
        expect(mockAssignments.length).toBeGreaterThan(0)
    })

    it('chaque item est valide selon le schéma', () => {
        for (const item of mockAssignments) {
            expect(() => assignmentResource.schema.parse(item)).not.toThrow()
        }
    })

    it('contient les trois statuts possibles', () => {
        const statuses = new Set(mockAssignments.map(a => a.status))
        expect(statuses.has('active')).toBe(true)
        expect(statuses.has('repair')).toBe(true)
        expect(statuses.has('returned')).toBe(true)
    })

    it('les numéros de série sont uniques', () => {
        const serials = mockAssignments.map(a => a.serial)
        expect(new Set(serials).size).toBe(serials.length)
    })

    it('les emails ont le bon format', () => {
        for (const item of mockAssignments) {
            expect(item.email).toMatch(/^[^@]+@[^@]+\.[^@]+$/)
        }
    })
})

describe('Mock data — repairs', () => {
    it('contient au moins un item', () => {
        expect(mockRepairs.length).toBeGreaterThan(0)
    })

    it('chaque item est valide selon le schéma', () => {
        for (const item of mockRepairs) {
            expect(() => repairResource.schema.parse(item)).not.toThrow()
        }
    })

    it('les tickets commencent par REP-', () => {
        for (const item of mockRepairs) {
            expect(item.ticket).toMatch(/^REP-/)
        }
    })

    it('contient plusieurs statuts différents', () => {
        const statuses = new Set(mockRepairs.map(r => r.status))
        expect(statuses.size).toBeGreaterThanOrEqual(2)
    })

    it('les tickets fermés ont une date de clôture', () => {
        const closed = mockRepairs.filter(r => r.status === 'closed')
        for (const item of closed) {
            expect(item.closed_at).not.toBeNull()
        }
    })

    it('les tickets non fermés n\'ont pas de date de clôture', () => {
        const open = mockRepairs.filter(r => r.status !== 'closed')
        for (const item of open) {
            expect(item.closed_at).toBeNull()
        }
    })
})

describe('Mock data — orders', () => {
    it('contient au moins un item', () => {
        expect(mockOrders.length).toBeGreaterThan(0)
    })

    it('chaque item est valide selon le schéma', () => {
        for (const item of mockOrders) {
            expect(() => orderResource.schema.parse(item)).not.toThrow()
        }
    })

    it('les références commencent par CMD-', () => {
        for (const item of mockOrders) {
            expect(item.ref).toMatch(/^CMD-/)
        }
    })

    it('les quantités sont positives', () => {
        for (const item of mockOrders) {
            expect(item.quantity).toBeGreaterThan(0)
        }
    })

    it('contient les trois types possibles', () => {
        const types = new Set(mockOrders.map(o => o.type))
        expect(types.has('hardware')).toBe(true)
        expect(types.has('parts')).toBe(true)
        expect(types.has('consumable')).toBe(true)
    })
})

describe('Mock data — alerts', () => {
    it('contient au moins un item', () => {
        expect(mockAlerts.length).toBeGreaterThan(0)
    })

    it('chaque item est valide selon le schéma', () => {
        for (const item of mockAlerts) {
            expect(() => alertResource.schema.parse(item)).not.toThrow()
        }
    })

    it('contient les trois niveaux de sévérité', () => {
        const severities = new Set(mockAlerts.map(a => a.severity))
        expect(severities.has('critical')).toBe(true)
        expect(severities.has('warning')).toBe(true)
        expect(severities.has('info')).toBe(true)
    })

    it('contient les quatre types d\'alertes', () => {
        const types = new Set(mockAlerts.map(a => a.type))
        expect(types.has('warranty')).toBe(true)
        expect(types.has('age')).toBe(true)
        expect(types.has('performance')).toBe(true)
        expect(types.has('security')).toBe(true)
    })
})

describe('Mock data — pcProfiles', () => {
    it('contient au moins un item', () => {
        expect(mockPcProfiles.length).toBeGreaterThan(0)
    })

    it('chaque item est valide selon le schéma', () => {
        for (const item of mockPcProfiles) {
            expect(() => pcProfileResource.schema.parse(item)).not.toThrow()
        }
    })

    it('le stock est toujours inférieur ou égal au total', () => {
        for (const item of mockPcProfiles) {
            expect(item.stock).toBeLessThanOrEqual(item.total)
        }
    })

    it('le nombre d\'écrans est positif', () => {
        for (const item of mockPcProfiles) {
            expect(item.screens).toBeGreaterThanOrEqual(1)
        }
    })
})
