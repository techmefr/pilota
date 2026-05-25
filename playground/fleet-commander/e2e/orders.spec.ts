import { expect, test } from '@playwright/test'

test.describe('Commandes', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/orders')
        await page.waitForSelector('.table-wrap', { timeout: 10_000 })
    })

    test('affiche le titre Commandes', async ({ page }) => {
        await expect(page.locator('.page-title')).toContainText('Commandes')
    })

    test('affiche des lignes dans le tableau', async ({ page }) => {
        const count = await page.locator('tbody tr').count()
        expect(count).toBeGreaterThan(0)
    })

    test('affiche les colonnes Réf., Article, Type, Qté, Statut', async ({ page }) => {
        const headers = page.locator('thead th')
        await expect(headers.nth(0)).toContainText('Réf.')
        await expect(headers.nth(1)).toContainText('Article')
        await expect(headers.nth(2)).toContainText('Type')
        await expect(headers.nth(3)).toContainText('Qté')
    })

    test('affiche des références CMD-', async ({ page }) => {
        const firstRef = page.locator('tbody tr td.mono').first()
        await expect(firstRef).toContainText('CMD-')
    })

    test('affiche des badges de statut colorés', async ({ page }) => {
        await expect(page.locator('tbody .badge').first()).toBeVisible()
    })

    test('recherche filtre les commandes', async ({ page }) => {
        await page.locator('.fc-input').fill('ZBook')
        const count = await page.locator('tbody tr').count()
        expect(count).toBeGreaterThan(0)
        const text = await page.locator('tbody tr').first().innerText()
        expect(text.toLowerCase()).toContain('zbook')
    })

    test('filtre par type Matériel', async ({ page }) => {
        await page.locator('.fc-select').first().selectOption('hardware')
        const count = await page.locator('tbody tr').count()
        expect(count).toBeGreaterThan(0)
    })

    test('filtre par statut commandé', async ({ page }) => {
        await page.locator('.fc-select').nth(1).selectOption('ordered')
        const count = await page.locator('tbody tr').count()
        expect(count).toBeGreaterThan(0)
        await expect(page.locator('.badge-ordered').first()).toBeVisible()
    })

    test('aucun résultat affiche le message vide', async ({ page }) => {
        await page.locator('.fc-input').fill('xxxxxxxxxxx')
        await expect(page.locator('.empty')).toBeVisible()
    })
})
