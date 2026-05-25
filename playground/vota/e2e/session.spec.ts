import { expect, test } from '@playwright/test'

async function createSession(page: import('@playwright/test').Page, sessionName = 'Sprint Test E2E') {
    await page.goto('/')
    await page.locator('#global-name').fill('Alice')
    await page.getByRole('button', { name: 'Créer une session' }).click()
    await page.locator('#session-name').fill(sessionName)
    await page.getByRole('button', { name: 'Démarrer' }).click()
    await page.waitForURL(/\/session\/[A-Z0-9]{6}/, { timeout: 15_000 })
}

test.describe('Création de session', () => {
    test('crée une session et redirige vers la page de session', async ({ page }) => {
        await page.goto('/')
        await page.locator('#global-name').fill('Alice')
        await page.getByRole('button', { name: 'Créer une session' }).click()
        await page.locator('#session-name').fill('Sprint 42')
        await page.getByRole('button', { name: 'Démarrer' }).click()
        await page.waitForURL(/\/session\/[A-Z0-9]{6}/, { timeout: 15_000 })
        await expect(page).toHaveURL(/\/session\/[A-Z0-9]{6}(\?name=Alice)?/)
    })

    test('la page de session affiche le nom de session et le code', async ({ page }) => {
        await createSession(page, 'Demo Poker')
        await expect(page.locator('.topbar-session-name')).toContainText('Demo Poker')
        await expect(page.locator('.code-text')).toBeVisible()
        const code = await page.locator('.code-text').innerText()
        expect(code).toMatch(/^[A-Z0-9]{6}$/)
    })

    test('la page de session affiche l\'état vide des tâches', async ({ page }) => {
        await createSession(page)
        await expect(page.locator('.empty-state')).toContainText('Aucune tâche')
        await expect(page.locator('.no-task-label')).toContainText('Sélectionnez une tâche')
    })

    test('le participant Alice est visible dans la barre de participants', async ({ page }) => {
        await createSession(page)
        await expect(page.locator('.participant-avatar.avatar-me')).toBeVisible()
    })

    test('crée une session avec le projet renseigné', async ({ page }) => {
        await page.goto('/')
        await page.locator('#global-name').fill('Bob')
        await page.getByRole('button', { name: 'Créer une session' }).click()
        await page.locator('#session-name').fill('Sprint avec projet')
        await page.locator('#project').fill('Mon App')
        await page.getByRole('button', { name: 'Démarrer' }).click()
        await page.waitForURL(/\/session\/[A-Z0-9]{6}/, { timeout: 15_000 })
        await expect(page.locator('.topbar-session-name')).toContainText('Sprint avec projet')
    })

    test('crée une session avec l\'échelle T-shirt', async ({ page }) => {
        await page.goto('/')
        await page.locator('#global-name').fill('Charlie')
        await page.getByRole('button', { name: 'Créer une session' }).click()
        await page.locator('#session-name').fill('Sprint T-shirt')
        await page.getByText('T-shirt').click()
        await page.getByRole('button', { name: 'Démarrer' }).click()
        await page.waitForURL(/\/session\/[A-Z0-9]{6}/, { timeout: 15_000 })
        await expect(page).toHaveURL(/\/session\//)
    })

    test('crée une session avec une échelle personnalisée', async ({ page }) => {
        await page.goto('/')
        await page.locator('#global-name').fill('Dana')
        await page.getByRole('button', { name: 'Créer une session' }).click()
        await page.locator('#session-name').fill('Sprint Custom')
        await page.getByText('Personnalisée').click()
        await page.locator('#custom-scale').fill('S, M, L, XL')
        await page.getByRole('button', { name: 'Démarrer' }).click()
        await page.waitForURL(/\/session\/[A-Z0-9]{6}/, { timeout: 15_000 })
        await expect(page).toHaveURL(/\/session\//)
    })
})

test.describe('Flux de la session', () => {
    test('ajoute une tâche et la voir dans la liste', async ({ page }) => {
        await createSession(page, 'Sprint Tâches')

        await page.getByRole('button', { name: '+ Ajouter' }).click()
        await expect(page.locator('#task-title')).toBeVisible()

        await page.locator('#task-title').fill('US-001: Connexion utilisateur')
        await page.locator('.modal-actions .btn-primary').click()

        await expect(page.locator('.task-card')).toHaveCount(1, { timeout: 10_000 })
        await expect(page.locator('.task-card-title')).toContainText('US-001: Connexion utilisateur')
    })

    test('sélectionner une tâche affiche le panneau de vote', async ({ page }) => {
        await createSession(page, 'Sprint Vote')

        await page.getByRole('button', { name: '+ Ajouter' }).click()
        await page.locator('#task-title').fill('US-002: Panier')
        await page.locator('.modal-actions .btn-primary').click()

        await page.locator('.task-card').first().click()

        await expect(page.locator('.vote-section')).toBeVisible({ timeout: 10_000 })
        await expect(page.locator('.cards-row')).toBeVisible()
        await expect(page.locator('.poker-card').first()).toBeVisible()
    })

    test('voter sélectionne une carte', async ({ page }) => {
        await createSession(page, 'Sprint Vote Carte')

        await page.getByRole('button', { name: '+ Ajouter' }).click()
        await page.locator('#task-title').fill('US-003: Login')
        await page.locator('.modal-actions .btn-primary').click()

        await page.locator('.task-card').first().click()
        await expect(page.locator('.cards-row')).toBeVisible({ timeout: 10_000 })

        const firstCard = page.locator('.poker-card').first()
        await firstCard.click()
        await expect(firstCard).toHaveClass(/poker-card-selected/)
    })
})

test.describe('Rejoindre une session', () => {
    test('rejoint une session existante via le code', async ({ page }) => {
        await createSession(page, 'Session à rejoindre')
        const code = await page.locator('.code-text').innerText()

        await page.goto('/')
        await page.locator('#global-name').fill('Bob')
        await page.getByRole('button', { name: 'Rejoindre avec un code' }).click()
        await page.locator('#join-code').fill(code)
        await page.getByRole('button', { name: 'Rejoindre' }).click()

        await page.waitForURL(/\/session\/[A-Z0-9]{6}/, { timeout: 15_000 })
        await expect(page.locator('.topbar-session-name')).toContainText('Session à rejoindre')
    })

    test('erreur si code de session inexistant', async ({ page }) => {
        await page.goto('/')
        await page.locator('#global-name').fill('Bob')
        await page.getByRole('button', { name: 'Rejoindre avec un code' }).click()
        await page.locator('#join-code').fill('ZZZZZZ')
        await page.getByRole('button', { name: 'Rejoindre' }).click()
        await expect(page.locator('.error-banner')).toBeVisible({ timeout: 10_000 })
    })
})
