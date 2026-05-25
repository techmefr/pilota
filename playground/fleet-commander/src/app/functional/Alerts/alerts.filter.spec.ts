import { describe, it, expect } from 'vitest'
import type { Alert } from '../../technical/Sdk/resources'
import { mockAlerts } from '../../technical/Sdk/mock'

function filterAlerts(alerts: Alert[], query: string, severity: string, type: string): Alert[] {
    const q = query.toLowerCase()
    return alerts.filter(a => {
        const matchesQuery =
            !q ||
            a.device.toLowerCase().includes(q) ||
            a.employee.toLowerCase().includes(q) ||
            a.serial.toLowerCase().includes(q) ||
            a.description.toLowerCase().includes(q)
        const matchesSeverity = !severity || a.severity === severity
        const matchesType = !type || a.type === type
        return matchesQuery && matchesSeverity && matchesType
    })
}

describe('Alertes — logique de filtrage', () => {
    it('sans filtre, retourne toutes les alertes', () => {
        expect(filterAlerts(mockAlerts, '', '', '')).toHaveLength(mockAlerts.length)
    })

    it('recherche par employé', () => {
        const result = filterAlerts(mockAlerts, 'Hugo', '', '')
        expect(result.every(a => a.employee.toLowerCase().includes('hugo'))).toBe(true)
        expect(result.length).toBeGreaterThan(0)
    })

    it('recherche par numéro de série', () => {
        const serial = mockAlerts[0].serial
        const result = filterAlerts(mockAlerts, serial, '', '')
        expect(result.every(a => a.serial === serial)).toBe(true)
        expect(result.length).toBeGreaterThan(0)
    })

    it('recherche par description', () => {
        const result = filterAlerts(mockAlerts, 'garantie', '', '')
        expect(result.every(a => a.description.toLowerCase().includes('garantie'))).toBe(true)
        expect(result.length).toBeGreaterThan(0)
    })

    it('recherche sans correspondance retourne tableau vide', () => {
        expect(filterAlerts(mockAlerts, 'xxxxxxxxxxx', '', '')).toHaveLength(0)
    })

    it('filtre par sévérité critical', () => {
        const result = filterAlerts(mockAlerts, '', 'critical', '')
        expect(result.every(a => a.severity === 'critical')).toBe(true)
        expect(result.length).toBeGreaterThan(0)
    })

    it('filtre par sévérité warning', () => {
        const result = filterAlerts(mockAlerts, '', 'warning', '')
        expect(result.every(a => a.severity === 'warning')).toBe(true)
        expect(result.length).toBeGreaterThan(0)
    })

    it('filtre par sévérité info', () => {
        const result = filterAlerts(mockAlerts, '', 'info', '')
        expect(result.every(a => a.severity === 'info')).toBe(true)
        expect(result.length).toBeGreaterThan(0)
    })

    it('filtre par type warranty', () => {
        const result = filterAlerts(mockAlerts, '', '', 'warranty')
        expect(result.every(a => a.type === 'warranty')).toBe(true)
        expect(result.length).toBeGreaterThan(0)
    })

    it('filtre par type security', () => {
        const result = filterAlerts(mockAlerts, '', '', 'security')
        expect(result.every(a => a.type === 'security')).toBe(true)
        expect(result.length).toBeGreaterThan(0)
    })

    it('filtre par type age', () => {
        const result = filterAlerts(mockAlerts, '', '', 'age')
        expect(result.every(a => a.type === 'age')).toBe(true)
        expect(result.length).toBeGreaterThan(0)
    })

    it('filtre par type performance', () => {
        const result = filterAlerts(mockAlerts, '', '', 'performance')
        expect(result.every(a => a.type === 'performance')).toBe(true)
        expect(result.length).toBeGreaterThan(0)
    })

    it('filtre combiné sévérité + type', () => {
        const result = filterAlerts(mockAlerts, '', 'critical', 'warranty')
        expect(result.every(a => a.severity === 'critical' && a.type === 'warranty')).toBe(true)
    })

    it('les alertes critical sont les plus urgentes', () => {
        const critical = filterAlerts(mockAlerts, '', 'critical', '')
        expect(critical.length).toBeGreaterThan(0)
        const active = critical.filter(a => a.status === 'active')
        expect(active.length).toBeGreaterThan(0)
    })
})
