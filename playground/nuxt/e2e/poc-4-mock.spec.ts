import { expect, test } from '@playwright/test'

test.describe('POC 4 — Mock par appel', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/poc-4-mock')
    })

    test('mock activé par défaut', async ({ page }) => {
        await expect(page.locator('[data-test-id="mock-switch"]')).toHaveAttribute('data-test-state', 'on')
    })

    test('appel avec mock valide → succès sans backend', async ({ page }) => {
        await page.locator('[data-test-id="btn-call"]').click()

        await expect(page.locator('[data-test-id="result-mock"]')).toHaveAttribute('data-test-state', 'success', {
            timeout: 5_000,
        })

        const preview = await page.locator('[data-test-id="mock-preview"]').textContent()
        const parsed = JSON.parse(preview ?? '{}')
        expect(parsed).toMatchObject({ id: 99, name: 'Mock User', email: 'mock@pilota.dev' })
    })

    test('mock invalide → erreur Zod sans appel réseau', async ({ page }) => {
        await page.locator('[data-test-id="btn-invalid-mock"]').click()

        await expect(page.locator('[data-test-id="result-mock"]')).toHaveAttribute('data-test-state', 'error', {
            timeout: 5_000,
        })
    })

    test('désactiver le mock → appel réseau → error (sans backend)', async ({ page }) => {
        await page.locator('[data-test-id="mock-switch"]').click()
        await expect(page.locator('[data-test-id="mock-switch"]')).toHaveAttribute('data-test-state', 'off')

        await page.locator('[data-test-id="btn-call"]').click()

        await expect(page.locator('[data-test-id="result-mock"]')).toHaveAttribute('data-test-state', 'error', {
            timeout: 10_000,
        })
    })
})
