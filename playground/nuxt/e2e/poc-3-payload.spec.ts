import { expect, test } from '@playwright/test'

test.describe('POC 3 — Payload Builder (delta)', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/poc-3-payload')
    })

    test('état initial propre — delta vide', async ({ page }) => {
        await expect(page.locator('[data-test-id="dirty-chip"]')).toHaveAttribute('data-test-state', 'clean')
        await expect(page.locator('[data-test-id="dirty-chip"]')).toContainText('propre')
        await expect(page.locator('[data-test-id="delta-output"]')).toContainText('{}')
    })

    test('modifier le nom marque comme modifié', async ({ page }) => {
        const input = page.locator('[data-test-id="field-name"] input')
        await input.fill('Bob Dupont')

        await expect(page.locator('[data-test-id="dirty-chip"]')).toHaveAttribute('data-test-state', 'dirty')
        await expect(page.locator('[data-test-id="dirty-chip"]')).toContainText('modifié')
        await expect(page.locator('[data-test-id="delta-output"]')).toContainText('"name"')
        await expect(page.locator('[data-test-id="delta-output"]')).toContainText('Bob Dupont')
    })

    test('le delta ne contient que le champ modifié', async ({ page }) => {
        const input = page.locator('[data-test-id="field-email"] input')
        await input.fill('bob@test.com')

        const delta = await page.locator('[data-test-id="delta-output"]').textContent()
        const parsed = JSON.parse(delta ?? '{}')

        expect(parsed).toHaveProperty('email', 'bob@test.com')
        expect(parsed).not.toHaveProperty('name')
        expect(parsed).not.toHaveProperty('city')
    })

    test('reset remet à l\'état propre', async ({ page }) => {
        await page.locator('[data-test-id="field-name"] input').fill('Bob Dupont')
        await expect(page.locator('[data-test-id="dirty-chip"]')).toHaveAttribute('data-test-state', 'dirty')

        await page.locator('[data-test-id="btn-reset"]').click()

        await expect(page.locator('[data-test-id="dirty-chip"]')).toHaveAttribute('data-test-state', 'clean')
        await expect(page.locator('[data-test-id="delta-output"]')).toContainText('{}')
    })

    test('plusieurs champs modifiés — delta complet', async ({ page }) => {
        await page.locator('[data-test-id="field-name"] input').fill('Bob')
        await page.locator('[data-test-id="field-city"] input').fill('Lyon')

        const delta = await page.locator('[data-test-id="delta-output"]').textContent()
        const parsed = JSON.parse(delta ?? '{}')

        expect(parsed).toHaveProperty('name', 'Bob')
        expect(parsed).toHaveProperty('city', 'Lyon')
        expect(Object.keys(parsed)).toHaveLength(2)
    })
})
