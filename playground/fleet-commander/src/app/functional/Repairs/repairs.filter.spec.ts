import { describe, it, expect } from 'vitest'
import type { Repair } from '../../technical/Sdk/resources'
import { mockRepairs } from '../../technical/Sdk/mock'

function filterRepairs(repairs: Repair[], query: string, status: string): Repair[] {
    const q = query.toLowerCase()
    return repairs.filter(r => {
        const matchesQuery =
            !q ||
            r.employee.toLowerCase().includes(q) ||
            r.device.toLowerCase().includes(q) ||
            r.ticket.toLowerCase().includes(q) ||
            r.serial.toLowerCase().includes(q)
        const matchesStatus = !status || r.status === status
        return matchesQuery && matchesStatus
    })
}

describe('Réparations — logique de filtrage', () => {
    it('sans filtre, retourne tous les tickets', () => {
        expect(filterRepairs(mockRepairs, '', '')).toHaveLength(mockRepairs.length)
    })

    it('recherche par nom d\'employé', () => {
        const result = filterRepairs(mockRepairs, 'Nicolas', '')
        expect(result.every(r => r.employee.toLowerCase().includes('nicolas'))).toBe(true)
        expect(result.length).toBeGreaterThan(0)
    })

    it('recherche par numéro de ticket', () => {
        const ticket = mockRepairs[0].ticket
        const result = filterRepairs(mockRepairs, ticket, '')
        expect(result).toHaveLength(1)
        expect(result[0].ticket).toBe(ticket)
    })

    it('recherche par appareil', () => {
        const result = filterRepairs(mockRepairs, 'EliteBook', '')
        expect(result.every(r => r.device.toLowerCase().includes('elitebook'))).toBe(true)
        expect(result.length).toBeGreaterThan(0)
    })

    it('recherche sans correspondance retourne tableau vide', () => {
        expect(filterRepairs(mockRepairs, 'xxxxxxxxxxx', '')).toHaveLength(0)
    })

    it('filtre par statut open', () => {
        const result = filterRepairs(mockRepairs, '', 'open')
        expect(result.every(r => r.status === 'open')).toBe(true)
        expect(result.length).toBeGreaterThan(0)
    })

    it('filtre par statut in_progress', () => {
        const result = filterRepairs(mockRepairs, '', 'in_progress')
        expect(result.every(r => r.status === 'in_progress')).toBe(true)
        expect(result.length).toBeGreaterThan(0)
    })

    it('filtre par statut waiting_parts', () => {
        const result = filterRepairs(mockRepairs, '', 'waiting_parts')
        expect(result.every(r => r.status === 'waiting_parts')).toBe(true)
        expect(result.length).toBeGreaterThan(0)
    })

    it('filtre par statut closed', () => {
        const result = filterRepairs(mockRepairs, '', 'closed')
        expect(result.every(r => r.status === 'closed')).toBe(true)
        expect(result.length).toBeGreaterThan(0)
    })

    it('filtre combiné recherche + statut', () => {
        const result = filterRepairs(mockRepairs, 'Lefebvre', 'in_progress')
        expect(result.every(r =>
            r.technician?.toLowerCase().includes('lefebvre') === true ||
            r.employee.toLowerCase().includes('lefebvre')
        )).toBe(true)
    })

    it('les tickets fermés ont un technicien assigné', () => {
        const closed = mockRepairs.filter(r => r.status === 'closed')
        expect(closed.every(r => r.technician !== null)).toBe(true)
    })
})
