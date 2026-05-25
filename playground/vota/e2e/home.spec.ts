import { expect, test } from '@playwright/test'

test.describe('Page d\'accueil', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/')
    })

    test('affiche le titre et le tagline', async ({ page }) => {
        await expect(page.locator('.logo-text')).toContainText('Vota')
        await expect(page.locator('.logo-sub')).toContainText('Planning Poker')
    })

    test('boutons désactivés sans prénom', async ({ page }) => {
        await expect(page.getByRole('button', { name: 'Créer une session' })).toBeDisabled()
        await expect(page.getByRole('button', { name: 'Rejoindre avec un code' })).toBeDisabled()
    })

    test('boutons actifs après saisie du prénom', async ({ page }) => {
        await page.locator('#global-name').fill('Alice')
        await expect(page.getByRole('button', { name: 'Créer une session' })).toBeEnabled()
        await expect(page.getByRole('button', { name: 'Rejoindre avec un code' })).toBeEnabled()
    })

    test('ouvre le formulaire de création', async ({ page }) => {
        await page.locator('#global-name').fill('Alice')
        await page.getByRole('button', { name: 'Créer une session' }).click()
        await expect(page.locator('#session-name')).toBeVisible()
        await expect(page.locator('#project')).toBeVisible()
        await expect(page.locator('.scale-fieldset')).toBeVisible()
    })

    test('ouvre le formulaire de rejoindre', async ({ page }) => {
        await page.locator('#global-name').fill('Alice')
        await page.getByRole('button', { name: 'Rejoindre avec un code' }).click()
        await expect(page.locator('#join-code')).toBeVisible()
    })

    test('bouton retour ramène à l\'accueil depuis création', async ({ page }) => {
        await page.locator('#global-name').fill('Alice')
        await page.getByRole('button', { name: 'Créer une session' }).click()
        await page.getByRole('button', { name: '← Retour' }).click()
        await expect(page.getByRole('button', { name: 'Créer une session' })).toBeVisible()
    })

    test('bouton retour ramène à l\'accueil depuis rejoindre', async ({ page }) => {
        await page.locator('#global-name').fill('Alice')
        await page.getByRole('button', { name: 'Rejoindre avec un code' }).click()
        await page.getByRole('button', { name: '← Retour' }).click()
        await expect(page.getByRole('button', { name: 'Créer une session' })).toBeVisible()
    })

    test('bouton soumettre désactivé sans nom de session', async ({ page }) => {
        await page.locator('#global-name').fill('Alice')
        await page.getByRole('button', { name: 'Créer une session' }).click()
        await expect(page.getByRole('button', { name: 'Démarrer' })).toBeDisabled()
    })

    test('bouton rejoindre désactivé avec code incomplet', async ({ page }) => {
        await page.locator('#global-name').fill('Alice')
        await page.getByRole('button', { name: 'Rejoindre avec un code' }).click()
        await page.locator('#join-code').fill('ABC')
        await expect(page.getByRole('button', { name: 'Rejoindre' })).toBeDisabled()
    })

    test('bouton rejoindre actif avec code de 6 caractères', async ({ page }) => {
        await page.locator('#global-name').fill('Alice')
        await page.getByRole('button', { name: 'Rejoindre avec un code' }).click()
        await page.locator('#join-code').fill('ABC123')
        await expect(page.getByRole('button', { name: 'Rejoindre' })).toBeEnabled()
    })

    test('champ personnalisé visible uniquement pour l\'échelle custom', async ({ page }) => {
        await page.locator('#global-name').fill('Alice')
        await page.getByRole('button', { name: 'Créer une session' }).click()
        await expect(page.locator('#custom-scale')).not.toBeVisible()
        await page.getByText('Personnalisée').click()
        await expect(page.locator('#custom-scale')).toBeVisible()
    })

    test('erreur rejoindre avec code inexistant', async ({ page }) => {
        await page.locator('#global-name').fill('Alice')
        await page.getByRole('button', { name: 'Rejoindre avec un code' }).click()
        await page.locator('#join-code').fill('XXXXXX')
        await page.getByRole('button', { name: 'Rejoindre' }).click()
        await expect(page.locator('.error-banner')).toBeVisible({ timeout: 10_000 })
        await expect(page.locator('.error-banner')).toContainText('XXXXXX')
    })
})
