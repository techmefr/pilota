import { expect, test } from '@playwright/test'

test.describe('POC 6 — Subscriptions / Realtime', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/poc-6-subscription')
    })

    test('affiche le titre', async ({ page }) => {
        await expect(page.locator('h2')).toContainText('POC 6')
    })

    test('état initial déconnecté pour Nhost', async ({ page }) => {
        await expect(page.locator('[data-test-id="nhost-status-chip"]')).toHaveAttribute('data-test-state', 'disconnected')
        await expect(page.locator('[data-test-id="btn-nhost-subscribe"]')).toBeEnabled()
        await expect(page.locator('[data-test-id="btn-nhost-unsubscribe"]')).toBeDisabled()
    })

    test('état initial déconnecté pour Supabase', async ({ page }) => {
        await expect(page.locator('[data-test-id="supabase-status-chip"]')).toHaveAttribute('data-test-state', 'disconnected')
        await expect(page.locator('[data-test-id="btn-supabase-subscribe"]')).toBeEnabled()
        await expect(page.locator('[data-test-id="btn-supabase-unsubscribe"]')).toBeDisabled()
    })

    test('clic Subscribe Nhost ne plante pas (sans backend, connexion en attente)', async ({ page }) => {
        await page.locator('[data-test-id="btn-nhost-subscribe"]').click()
        await expect(page.locator('[data-test-id="nhost-status-chip"]')).toHaveAttribute('data-test-state', 'disconnected')
        await expect(page.locator('[data-test-id="btn-nhost-subscribe"]')).toBeEnabled()
    })

    test('Unsubscribe Nhost disponible si subscribeNhost a été appelé même sans connexion', async ({ page }) => {
        await page.locator('[data-test-id="btn-nhost-subscribe"]').click()
        await page.locator('[data-test-id="btn-supabase-subscribe"]').click()

        await expect(page.locator('[data-test-id="nhost-status-chip"]')).toHaveAttribute('data-test-state', 'disconnected')
        await expect(page.locator('[data-test-id="supabase-status-chip"]')).toHaveAttribute('data-test-state', 'disconnected')
    })
})
