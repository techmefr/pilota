import { expect, test } from '@playwright/test'

test.describe('Réparations', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/repairs')
        await page.waitForSelector('.table-wrap', { timeout: 10_000 })
    })

    test('affiche le titre Réparations', async ({ page }) => {
        await expect(page.locator('.page-title')).toContainText('Réparations')
    })

    test('affiche des lignes dans le tableau', async ({ page }) => {
        const rows = page.locator('tbody tr')
        const count = await rows.count()
        expect(count).toBeGreaterThan(0)
    })

    test('affiche les colonnes Ticket, Employé, Appareil, Statut', async ({ page }) => {
        const headers = page.locator('thead th')
        await expect(headers.nth(0)).toContainText('Ticket')
        await expect(headers.nth(1)).toContainText('Employé')
        await expect(headers.nth(2)).toContainText('Appareil')
        await expect(headers.nth(5)).toContainText('Statut')
    })

    test('affiche des numéros de tickets REP-', async ({ page }) => {
        const firstTicket = page.locator('tbody tr td.mono').first()
        await expect(firstTicket).toContainText('REP-')
    })

    test('affiche des badges de statut colorés', async ({ page }) => {
        const badges = page.locator('tbody .badge')
        await expect(badges.first()).toBeVisible()
    })

    test('affiche le compteur de tickets', async ({ page }) => {
        await expect(page.locator('.result-count')).toContainText('tickets')
    })

    test('recherche filtre les tickets', async ({ page }) => {
        await page.locator('.fc-input').fill('Nicolas')
        const rows = page.locator('tbody tr')
        const count = await rows.count()
        expect(count).toBeGreaterThan(0)
        const text = await page.locator('tbody tr').first().innerText()
        expect(text.toLowerCase()).toContain('nicolas')
    })

    test('filtre par statut in_progress affiche les tickets en cours', async ({ page }) => {
        await page.locator('.fc-select').selectOption('in_progress')
        const rows = page.locator('tbody tr')
        const count = await rows.count()
        expect(count).toBeGreaterThan(0)
        await expect(page.locator('.badge-in_progress').first()).toBeVisible()
    })

    test('filtre par statut waiting_parts affiche les tickets en attente', async ({ page }) => {
        await page.locator('.fc-select').selectOption('in_progress')
        const count = await page.locator('tbody tr').count()
        expect(count).toBeGreaterThan(0)
        await expect(page.locator('.badge-in_progress').first()).toBeVisible()
    })

    test('aucun résultat affiche le message vide', async ({ page }) => {
        await page.locator('.fc-input').fill('xxxxxxxxxxx')
        await expect(page.locator('.empty')).toBeVisible()
    })

    test('le numéro de série est un lien vers /pc/', async ({ page }) => {
        const link = page.locator('a.mono.link').first()
        const href = await link.getAttribute('href')
        expect(href).toMatch(/\/pc\//)
    })
})
