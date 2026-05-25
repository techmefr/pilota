import { expect, test } from '@playwright/test'

test.describe('Inventaire', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/inventory')
        await page.waitForSelector('.table-wrap', { timeout: 10_000 })
    })

    test('affiche le titre Inventaire', async ({ page }) => {
        await expect(page.locator('.page-title')).toContainText('Inventaire')
    })

    test('affiche des lignes dans le tableau', async ({ page }) => {
        const rows = page.locator('tbody tr')
        const count = await rows.count()
        expect(count).toBeGreaterThan(0)
    })

    test('affiche les colonnes attendues', async ({ page }) => {
        const headers = page.locator('thead th')
        await expect(headers.nth(0)).toContainText('Employé')
        await expect(headers.nth(1)).toContainText('Équipe')
        await expect(headers.nth(2)).toContainText('Appareil')
        await expect(headers.nth(3)).toContainText('N° série')
    })

    test('affiche des badges de statut', async ({ page }) => {
        await expect(page.locator('.badge-active').first()).toBeVisible()
    })

    test('recherche filtre les résultats', async ({ page }) => {
        const allCount = await page.locator('tbody tr').count()
        await page.locator('.fc-input').fill('Lucas')
        await expect(page.locator('tbody tr')).toHaveCount(1)
        const cell = page.locator('tbody tr td').first()
        await expect(cell).toContainText('Lucas')
        await page.locator('.fc-input').clear()
        await expect(page.locator('tbody tr')).toHaveCount(allCount)
    })

    test('recherche insensible à la casse', async ({ page }) => {
        await page.locator('.fc-input').fill('lucas')
        await expect(page.locator('tbody tr')).toHaveCount(1)
    })

    test('filtre par équipe filtre les résultats', async ({ page }) => {
        const teamSelect = page.locator('.fc-select').first()
        const firstOption = teamSelect.locator('option').nth(1)
        const teamName = await firstOption.textContent()
        await teamSelect.selectOption({ index: 1 })
        const rows = page.locator('tbody tr')
        const count = await rows.count()
        expect(count).toBeGreaterThan(0)
        const firstRowText = await rows.first().innerText()
        expect(firstRowText).toContain(teamName?.trim())
    })

    test('filtre par statut active affiche les badges actifs', async ({ page }) => {
        const statusSelect = page.locator('.fc-select').nth(1)
        await statusSelect.selectOption('active')
        const rows = page.locator('tbody tr')
        const count = await rows.count()
        expect(count).toBeGreaterThan(0)
        await expect(page.locator('.badge-active').first()).toBeVisible()
    })

    test('affiche le compteur de résultats', async ({ page }) => {
        await expect(page.locator('.result-count')).toContainText('résultats')
    })

    test('le numéro de série est un lien vers /pc/', async ({ page }) => {
        const serialLink = page.locator('a.mono.link').first()
        await expect(serialLink).toBeVisible()
        const href = await serialLink.getAttribute('href')
        expect(href).toMatch(/\/pc\//)
    })

    test('aucun résultat affiche un message vide', async ({ page }) => {
        await page.locator('.fc-input').fill('xxxxxxxxxxx')
        await expect(page.locator('.empty')).toBeVisible()
        await expect(page.locator('.empty')).toContainText('Aucun résultat')
    })
})
