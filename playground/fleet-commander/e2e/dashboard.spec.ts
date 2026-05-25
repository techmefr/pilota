import { expect, test } from '@playwright/test'

test.describe('Tableau de bord', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/')
        await page.waitForSelector('.kpi-grid', { timeout: 10_000 })
    })

    test('affiche 4 cartes KPI', async ({ page }) => {
        await expect(page.locator('.kpi-card')).toHaveCount(4)
    })

    test('la topbar affiche le titre Tableau de bord', async ({ page }) => {
        await expect(page.locator('fc-topbar')).toContainText('Tableau de bord')
    })

    test('KPI total affiche un nombre positif d\'appareils', async ({ page }) => {
        const kpiCards = page.locator('.kpi-card')
        const totalValue = kpiCards.nth(0).locator('.kpi-value')
        await expect(totalValue).toHaveClass(/blue/)
        const text = await totalValue.innerText()
        expect(parseInt(text)).toBeGreaterThan(0)
    })

    test('KPI réparations affiche le bon compte', async ({ page }) => {
        const repairValue = page.locator('.kpi-card').nth(1).locator('.kpi-value')
        await expect(repairValue).toHaveClass(/amber/)
        const text = await repairValue.innerText()
        expect(parseInt(text)).toBeGreaterThanOrEqual(0)
    })

    test('KPI alertes critiques affiche en rouge', async ({ page }) => {
        const alertValue = page.locator('.kpi-card').nth(3).locator('.kpi-value')
        await expect(alertValue).toHaveClass(/red/)
    })

    test('affiche le flux temps réel avec le badge Supabase', async ({ page }) => {
        await expect(page.locator('.section-card-count').filter({ hasText: 'Supabase' })).toBeVisible()
    })

    test('le flux temps réel se remplit progressivement', async ({ page }) => {
        await page.waitForTimeout(4000)
        const events = page.locator('.event-item')
        const count = await events.count()
        expect(count).toBeGreaterThan(0)
    })

    test('affiche la section alertes critiques', async ({ page }) => {
        const alertSection = page.locator('.section-card').nth(1)
        await expect(alertSection.locator('.section-card-title')).toContainText('Alertes critiques')
    })

    test('les alertes critiques ont des points colorés', async ({ page }) => {
        const criticalDots = page.locator('.alert-dot.dot-critical')
        const count = await criticalDots.count()
        expect(count).toBeGreaterThan(0)
    })

    test('topbar affiche Dashboard en anglais', async ({ page }) => {
        await page.goto('/settings')
        await page.waitForSelector('.settings-stack', { timeout: 10_000 })
        await page.locator('.opt-btn.lang-btn').filter({ hasText: 'English' }).click()
        await page.goto('/')
        await page.waitForSelector('.kpi-grid', { timeout: 10_000 })
        await expect(page.locator('fc-topbar')).toContainText('Dashboard')
        await page.goto('/settings')
        await page.waitForSelector('.settings-stack', { timeout: 10_000 })
        await page.locator('.opt-btn.lang-btn').filter({ hasText: 'Français' }).click()
    })
})
