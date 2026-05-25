import { describe, it, expect } from 'vitest'
import type { Assignment } from '../../technical/Sdk/resources'
import { mockAssignments } from '../../technical/Sdk/mock'

function filterAssignments(
    assignments: Assignment[],
    query: string,
    team: string,
    status: string,
): Assignment[] {
    const q = query.toLowerCase()
    return assignments.filter(a => {
        const matchesQuery =
            !q ||
            a.employee.toLowerCase().includes(q) ||
            a.model.toLowerCase().includes(q) ||
            a.serial.toLowerCase().includes(q) ||
            a.team.toLowerCase().includes(q)
        const matchesTeam = !team || a.team === team
        const matchesStatus = !status || a.status === status
        return matchesQuery && matchesTeam && matchesStatus
    })
}

describe('Inventaire — logique de filtrage', () => {
    it('sans filtre, retourne tous les items', () => {
        const result = filterAssignments(mockAssignments, '', '', '')
        expect(result).toHaveLength(mockAssignments.length)
    })

    it('recherche par nom d\'employé (insensible à la casse)', () => {
        const result = filterAssignments(mockAssignments, 'lucas', '', '')
        expect(result.every(a => a.employee.toLowerCase().includes('lucas'))).toBe(true)
        expect(result.length).toBeGreaterThan(0)
    })

    it('recherche par modèle', () => {
        const result = filterAssignments(mockAssignments, 'macbook', '', '')
        expect(result.every(a => a.model.toLowerCase().includes('macbook'))).toBe(true)
        expect(result.length).toBeGreaterThan(0)
    })

    it('recherche par numéro de série', () => {
        const serial = mockAssignments[0].serial
        const result = filterAssignments(mockAssignments, serial, '', '')
        expect(result).toHaveLength(1)
        expect(result[0].serial).toBe(serial)
    })

    it('recherche sans correspondance retourne tableau vide', () => {
        const result = filterAssignments(mockAssignments, 'xxxxxxxxxxx', '', '')
        expect(result).toHaveLength(0)
    })

    it('filtre par équipe retourne uniquement les membres de cette équipe', () => {
        const team = 'Dev Backend'
        const result = filterAssignments(mockAssignments, '', team, '')
        expect(result.every(a => a.team === team)).toBe(true)
        expect(result.length).toBeGreaterThan(0)
    })

    it('filtre par statut active', () => {
        const result = filterAssignments(mockAssignments, '', '', 'active')
        expect(result.every(a => a.status === 'active')).toBe(true)
        expect(result.length).toBeGreaterThan(0)
    })

    it('filtre par statut repair', () => {
        const result = filterAssignments(mockAssignments, '', '', 'repair')
        expect(result.every(a => a.status === 'repair')).toBe(true)
        expect(result.length).toBeGreaterThan(0)
    })

    it('filtre par statut returned', () => {
        const result = filterAssignments(mockAssignments, '', '', 'returned')
        expect(result.every(a => a.status === 'returned')).toBe(true)
        expect(result.length).toBeGreaterThan(0)
    })

    it('filtre combiné équipe + statut', () => {
        const result = filterAssignments(mockAssignments, '', 'Dev Backend', 'active')
        expect(result.every(a => a.team === 'Dev Backend' && a.status === 'active')).toBe(true)
    })

    it('les équipes disponibles sont calculées depuis les données', () => {
        const teams = Array.from(new Set(mockAssignments.map(a => a.team))).sort()
        expect(teams.length).toBeGreaterThan(1)
        expect(teams).toContain('Dev Backend')
    })
})
