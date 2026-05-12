import { expect, test } from '@playwright/test'

test.describe('Page index', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/')
    })

    test('affiche le titre principal', async ({ page }) => {
        await expect(page.locator('h1')).toContainText('Pilota POC')
    })

    test('affiche 7 liens POC', async ({ page }) => {
        const items = page.locator('[data-test-class="poc-item"]')
        await expect(items).toHaveCount(7)
    })

    test('chaque POC a un lien correct', async ({ page }) => {
        const expected = [
            '/poc-1-driver',
            '/poc-2-resource',
            '/poc-3-payload',
            '/poc-4-mock',
            '/poc-5-events',
            '/poc-6-subscription',
            '/poc-7-form',
        ]

        for (let i = 1; i <= 7; i++) {
            const item = page.locator(`[data-test-id="poc-item-${i}"]`)
            await expect(item).toHaveAttribute('href', expected[i - 1])
        }
    })

    test('navigation vers POC 1 fonctionne', async ({ page }) => {
        await page.locator('[data-test-id="poc-item-1"]').click()
        await expect(page).toHaveURL('/poc-1-driver')
        await expect(page.locator('[data-test-id="page-poc-1"]')).toBeVisible()
    })
})
