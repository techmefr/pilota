import { expect, test } from '@playwright/test'

test.describe('POC 5 — Moteur d\'events', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/poc-5-events')
    })

    test('handler local actif par défaut', async ({ page }) => {
        await expect(page.locator('[data-test-id="local-switch"]')).toHaveAttribute('data-test-state', 'local')
    })

    test('liste d\'events vide au départ', async ({ page }) => {
        await expect(page.locator('[data-test-id="events-empty"]')).toBeVisible()
    })

    test('appel avec handler local → events reçus', async ({ page }) => {
        await page.locator('[data-test-id="btn-call"]').click()

        await expect(page.locator('[data-test-class="event-item"]').first()).toBeVisible({
            timeout: 10_000,
        })

        const eventItems = page.locator('[data-test-class="event-item"]')
        await expect(eventItems).toHaveCount(2)
    })

    test('basculer sur hooks globaux change le label', async ({ page }) => {
        await page.locator('[data-test-id="local-switch"]').click()
        await expect(page.locator('[data-test-id="local-switch"]')).toHaveAttribute('data-test-state', 'global')
    })
})
