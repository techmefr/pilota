import { describe, it, expect } from 'vitest'
import type { Order } from '../../technical/Sdk/resources'
import { mockOrders } from '../../technical/Sdk/mock'

function filterOrders(orders: Order[], query: string, type: string, status: string): Order[] {
    const q = query.toLowerCase()
    return orders.filter(o => {
        const matchesQuery =
            !q ||
            o.ref.toLowerCase().includes(q) ||
            o.item.toLowerCase().includes(q) ||
            o.requested_by.toLowerCase().includes(q)
        const matchesType = !type || o.type === type
        const matchesStatus = !status || o.status === status
        return matchesQuery && matchesType && matchesStatus
    })
}

describe('Commandes — logique de filtrage', () => {
    it('sans filtre, retourne toutes les commandes', () => {
        expect(filterOrders(mockOrders, '', '', '')).toHaveLength(mockOrders.length)
    })

    it('recherche par référence CMD-', () => {
        const ref = mockOrders[0].ref
        const result = filterOrders(mockOrders, ref, '', '')
        expect(result).toHaveLength(1)
        expect(result[0].ref).toBe(ref)
    })

    it('recherche par article', () => {
        const result = filterOrders(mockOrders, 'ZBook', '', '')
        expect(result.every(o => o.item.toLowerCase().includes('zbook'))).toBe(true)
        expect(result.length).toBeGreaterThan(0)
    })

    it('recherche par demandeur', () => {
        const result = filterOrders(mockOrders, 'Lefebvre', '', '')
        expect(result.every(o => o.requested_by.toLowerCase().includes('lefebvre'))).toBe(true)
        expect(result.length).toBeGreaterThan(0)
    })

    it('recherche sans correspondance retourne tableau vide', () => {
        expect(filterOrders(mockOrders, 'xxxxxxxxxxx', '', '')).toHaveLength(0)
    })

    it('filtre par type hardware', () => {
        const result = filterOrders(mockOrders, '', 'hardware', '')
        expect(result.every(o => o.type === 'hardware')).toBe(true)
        expect(result.length).toBeGreaterThan(0)
    })

    it('filtre par type parts', () => {
        const result = filterOrders(mockOrders, '', 'parts', '')
        expect(result.every(o => o.type === 'parts')).toBe(true)
        expect(result.length).toBeGreaterThan(0)
    })

    it('filtre par type consumable', () => {
        const result = filterOrders(mockOrders, '', 'consumable', '')
        expect(result.every(o => o.type === 'consumable')).toBe(true)
        expect(result.length).toBeGreaterThan(0)
    })

    it('filtre par statut pending', () => {
        const result = filterOrders(mockOrders, '', '', 'pending')
        expect(result.every(o => o.status === 'pending')).toBe(true)
        expect(result.length).toBeGreaterThan(0)
    })

    it('filtre par statut ordered', () => {
        const result = filterOrders(mockOrders, '', '', 'ordered')
        expect(result.every(o => o.status === 'ordered')).toBe(true)
        expect(result.length).toBeGreaterThan(0)
    })

    it('filtre par statut delivered', () => {
        const result = filterOrders(mockOrders, '', '', 'delivered')
        expect(result.every(o => o.status === 'delivered')).toBe(true)
        expect(result.length).toBeGreaterThan(0)
    })

    it('filtre combiné type + statut', () => {
        const result = filterOrders(mockOrders, '', 'hardware', 'ordered')
        expect(result.every(o => o.type === 'hardware' && o.status === 'ordered')).toBe(true)
    })
})
