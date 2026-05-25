import { expect, test } from '@playwright/test'

test.describe('Layout', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/')
        await page.waitForSelector('fc-sidebar', { timeout: 10_000 })
    })

    test('affiche la sidebar avec le titre Fleet Commander', async ({ page }) => {
        await expect(page.locator('.logo-title')).toContainText('Fleet Commander')
        await expect(page.locator('.logo-sub')).toContainText('HP Fleet Hypervision')
    })

    test('affiche les 6 liens de navigation', async ({ page }) => {
        const navLinks = page.locator('.nav-link')
        await expect(navLinks).toHaveCount(6)
    })

    test('contient les liens de navigation attendus', async ({ page }) => {
        await expect(page.locator('.nav-link').nth(0)).toContainText('Tableau de bord')
        await expect(page.locator('.nav-link').nth(1)).toContainText('Inventaire')
        await expect(page.locator('.nav-link').nth(2)).toContainText('Configurateur')
        await expect(page.locator('.nav-link').nth(3)).toContainText('Réparations')
        await expect(page.locator('.nav-link').nth(4)).toContainText('Commandes')
        await expect(page.locator('.nav-link').nth(5)).toContainText('Alertes')
    })

    test('le lien Tableau de bord est actif par défaut', async ({ page }) => {
        await expect(page.locator('.nav-link').nth(0)).toHaveClass(/active/)
    })

    test('affiche les boutons de langue FR et EN', async ({ page }) => {
        await expect(page.locator('.lang-btn').nth(0)).toContainText('FR')
        await expect(page.locator('.lang-btn').nth(1)).toContainText('EN')
        await expect(page.locator('.lang-btn.active')).toContainText('FR')
    })

    test('bascule la langue EN', async ({ page }) => {
        await page.locator('.lang-btn').nth(1).click()
        await expect(page.locator('.lang-btn.active')).toContainText('EN')
        await expect(page.locator('.nav-link').nth(0)).toContainText('Dashboard')
        await expect(page.locator('.nav-link').nth(1)).toContainText('Inventory')
    })

    test('bascule retour FR depuis EN', async ({ page }) => {
        await page.locator('.lang-btn').nth(1).click()
        await page.locator('.lang-btn').nth(0).click()
        await expect(page.locator('.nav-link').nth(0)).toContainText('Tableau de bord')
    })

    test('navigation vers Inventaire met à jour le lien actif', async ({ page }) => {
        await page.locator('.nav-link').nth(1).click()
        await expect(page.locator('.nav-link').nth(1)).toHaveClass(/active/)
        await expect(page.locator('.nav-link').nth(0)).not.toHaveClass(/active/)
    })
})
