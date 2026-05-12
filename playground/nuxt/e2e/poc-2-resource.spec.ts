import { expect, test } from '@playwright/test'

test.describe('POC 2 — Resource + schema + fragments', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/poc-2-resource')
    })

    test('affiche le titre', async ({ page }) => {
        await expect(page.locator('h2')).toContainText('POC 2')
    })

    test('affiche les champs du schema UserResource', async ({ page }) => {
        await expect(page.locator('[data-test-id="schema-field-id"]')).toBeVisible()
        await expect(page.locator('[data-test-id="schema-field-name"]')).toBeVisible()
        await expect(page.locator('[data-test-id="schema-field-email"]')).toBeVisible()
    })

    test('toggle de fragment fonctionne', async ({ page }) => {
        const btnDefault = page.locator('[data-test-id="btn-fragment-default"]')
        const btnWithPosts = page.locator('[data-test-id="btn-fragment-withposts"]')

        await expect(btnDefault).toBeVisible()
        await expect(btnWithPosts).toBeVisible()

        await btnWithPosts.click()
        await expect(btnWithPosts).toHaveClass(/v-btn--active/)

        await btnDefault.click()
        await expect(btnDefault).toHaveClass(/v-btn--active/)
    })

    test('mock invalide affiche une erreur Zod', async ({ page }) => {
        await page.locator('[data-test-id="btn-invalid-mock"]').click()
        await expect(page.locator('[data-test-id="result-mock-invalid"]')).toBeVisible()
        await expect(page.locator('[data-test-id="result-mock-invalid"]')).toHaveAttribute('data-test-state', 'error')
    })
})
