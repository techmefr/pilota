import { expect, test } from '@playwright/test'

test.describe('Alertes', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/alerts')
        await page.waitForSelector('.table-wrap', { timeout: 10_000 })
    })

    test('affiche le titre Alertes', async ({ page }) => {
        await expect(page.locator('.page-title')).toContainText('Alertes')
    })

    test('affiche des lignes dans le tableau', async ({ page }) => {
        const count = await page.locator('tbody tr').count()
        expect(count).toBeGreaterThan(0)
    })

    test('affiche des badges de sévérité critique', async ({ page }) => {
        await expect(page.locator('.badge-critical').first()).toBeVisible()
    })

    test('affiche des type-chips', async ({ page }) => {
        await expect(page.locator('.type-chip').first()).toBeVisible()
    })

    test('filtre par sévérité critique', async ({ page }) => {
        const allCount = await page.locator('tbody tr').count()
        await page.locator('.fc-select').first().selectOption('critical')
        const criticalCount = await page.locator('tbody tr').count()
        expect(criticalCount).toBeLessThanOrEqual(allCount)
        await expect(page.locator('.badge-critical').first()).toBeVisible()
    })

    test('filtre par type garantie', async ({ page }) => {
        await page.locator('.fc-select').nth(1).selectOption('warranty')
        const count = await page.locator('tbody tr').count()
        expect(count).toBeGreaterThan(0)
    })

    test('recherche filtre par appareil ou employé', async ({ page }) => {
        await page.locator('.fc-input').fill('Hugo')
        const count = await page.locator('tbody tr').count()
        expect(count).toBeGreaterThan(0)
    })

    test('les numéros de série sont des liens vers /pc/', async ({ page }) => {
        const link = page.locator('a.mono.link').first()
        const href = await link.getAttribute('href')
        expect(href).toMatch(/\/pc\//)
    })

    test('aucun résultat affiche le message vide', async ({ page }) => {
        await page.locator('.fc-input').fill('xxxxxxxxxxx')
        await expect(page.locator('.empty')).toBeVisible()
    })
})
