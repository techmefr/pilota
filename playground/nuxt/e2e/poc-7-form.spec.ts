import { expect, test } from '@playwright/test'

test.describe('POC 7 — useResourceForm', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/poc-7-form')
    })

    test('formulaire propre à l\'initialisation', async ({ page }) => {
        await expect(page.locator('[data-test-id="dirty-chip"]')).toHaveAttribute('data-test-state', 'clean')
        await expect(page.locator('[data-test-id="dirty-chip"]')).toContainText('propre')
    })

    test('valeurs initiales nulles', async ({ page }) => {
        const output = await page.locator('[data-test-id="values-output"]').textContent()
        const parsed = JSON.parse(output ?? '{}')
        expect(parsed.name).toBeNull()
        expect(parsed.email).toBeNull()
    })

    test('soumettre formulaire vide → erreurs de validation Zod', async ({ page }) => {
        await page.locator('[data-test-id="btn-submit"]').click()

        await expect(page.locator('[data-test-id="errors-output"]')).not.toContainText('{}')

        const errorsText = await page.locator('[data-test-id="errors-output"]').textContent()
        const errors = JSON.parse(errorsText ?? '{}')
        expect(errors).toHaveProperty('name')
        expect(errors).toHaveProperty('email')
    })

    test('saisir un champ marque isDirty', async ({ page }) => {
        await page.locator('[data-test-id="field-name"] input').fill('Alice')

        await expect(page.locator('[data-test-id="dirty-chip"]')).toHaveAttribute('data-test-state', 'dirty')
        await expect(page.locator('[data-test-id="dirty-chip"]')).toContainText('modifié')
    })

    test('reset remet le formulaire à zéro', async ({ page }) => {
        await page.locator('[data-test-id="field-name"] input').fill('Alice')
        await page.locator('[data-test-id="field-email"] input').fill('alice@test.com')

        await expect(page.locator('[data-test-id="dirty-chip"]')).toHaveAttribute('data-test-state', 'dirty')

        await page.locator('[data-test-id="btn-reset"]').click()

        await expect(page.locator('[data-test-id="dirty-chip"]')).toHaveAttribute('data-test-state', 'clean')

        const output = await page.locator('[data-test-id="values-output"]').textContent()
        const parsed = JSON.parse(output ?? '{}')
        expect(parsed.name).toBeNull()
        expect(parsed.email).toBeNull()
    })

    test('reset efface les erreurs de validation', async ({ page }) => {
        await page.locator('[data-test-id="btn-submit"]').click()
        await expect(page.locator('[data-test-id="errors-output"]')).not.toContainText('{}')

        await page.locator('[data-test-id="btn-reset"]').click()

        await expect(page.locator('[data-test-id="errors-output"]')).toContainText('{}')
    })
})
