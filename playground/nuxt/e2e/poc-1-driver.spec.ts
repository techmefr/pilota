import { expect, test } from '@playwright/test'

test.describe('POC 1 — Driver + chainage', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/poc-1-driver')
    })

    test('affiche le titre', async ({ page }) => {
        await expect(page.locator('h2')).toContainText('POC 1')
    })

    test('bouton Lomkit présent', async ({ page }) => {
        await expect(page.locator('[data-test-id="btn-lomkit-get"]')).toBeVisible()
        await expect(page.locator('[data-test-id="btn-lomkit-get"]')).toContainText('lomkit')
    })

    test('bouton Nhost présent', async ({ page }) => {
        await expect(page.locator('[data-test-id="btn-nhost-query"]')).toBeVisible()
        await expect(page.locator('[data-test-id="btn-nhost-query"]')).toContainText('nhost')
    })

    test('état initial idle pour les deux résultats', async ({ page }) => {
        await expect(page.locator('[data-test-id="result-lomkit"]')).toHaveAttribute('data-test-state', 'idle')
        await expect(page.locator('[data-test-id="result-nhost"]')).toHaveAttribute('data-test-state', 'idle')
    })

    test('clic Lomkit passe en loading puis error (sans backend)', async ({ page }) => {
        await page.locator('[data-test-id="btn-lomkit-get"]').click()
        await expect(page.locator('[data-test-id="result-lomkit"]')).toHaveAttribute('data-test-state', 'error', {
            timeout: 10_000,
        })
    })
})
