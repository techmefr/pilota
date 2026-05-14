import { expect, test } from '@playwright/test'
import { MOCK_PRODUCTS, NHOST_GRAPHQL_URL } from './fixtures'

test.describe('Chat SAV — sdk.supabase.messages.subscribe/insert()', () => {
    test.beforeEach(async ({ page }) => {
        await page.route(NHOST_GRAPHQL_URL, route => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ data: { products: MOCK_PRODUCTS } }),
            })
        })
        await page.goto('/')
    })

    test('bouton chat visible sur toutes les pages', async ({ page }) => {
        await expect(page.locator('[data-test-id="chat-fab"]')).toBeVisible()
    })

    test('clic ouvre la fenêtre de chat', async ({ page }) => {
        await page.locator('[data-test-id="chat-fab"]').click()
        await expect(page.locator('[data-test-id="chat-window"]')).toBeVisible()
    })

    test('fenêtre de chat affiche le message de bienvenue', async ({ page }) => {
        await page.locator('[data-test-id="chat-fab"]').click()
        await expect(page.locator('[data-test-id="chat-empty"]')).toContainText('Hello! How can I help you?')
    })

    test('saisir et envoyer un message l\'affiche dans le chat', async ({ page }) => {
        await page.locator('[data-test-id="chat-fab"]').click()
        await page.locator('[data-test-id="chat-input"]').fill('Bonjour, j\'ai une question')
        await page.keyboard.press('Enter')

        await expect(page.locator('[data-test-class="chat-message"]').first()).toContainText('Bonjour')
    })

    test('second clic ferme la fenêtre de chat', async ({ page }) => {
        await page.locator('[data-test-id="chat-fab"]').click()
        await expect(page.locator('[data-test-id="chat-window"]')).toBeVisible()

        await page.locator('[data-test-id="chat-fab"]').click()
        await expect(page.locator('[data-test-id="chat-window"]')).not.toBeVisible()
    })

    test('bouton chat visible sur la page panier aussi', async ({ page }) => {
        await page.goto('/cart')
        await expect(page.locator('[data-test-id="chat-fab"]')).toBeVisible()
    })
})
