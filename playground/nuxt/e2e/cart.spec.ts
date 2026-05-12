import { expect, test } from '@playwright/test'
import { LOMKIT_MUTATE_URL, LOMKIT_SEARCH_URL, MOCK_CART_ITEMS, MOCK_PRODUCTS, NHOST_GRAPHQL_URL } from './fixtures'

test.describe('Panier — sdk.lomkit.cartItems.*', () => {
    test('panier vide affiche l\'état vide', async ({ page }) => {
        await page.route(LOMKIT_SEARCH_URL, route => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ data: [] }),
            })
        })
        await page.goto('/cart')

        await expect(page.locator('[data-test-id="cart-empty"]')).toBeVisible({ timeout: 8_000 })
        await expect(page.locator('[data-test-id="cart-empty"]')).toContainText('Panier vide')
    })

    test('panier avec articles affiche les lignes et le total', async ({ page }) => {
        await page.route(LOMKIT_SEARCH_URL, route => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ data: MOCK_CART_ITEMS }),
            })
        })
        await page.goto('/cart')

        await expect(page.locator('[data-test-class="cart-item"]')).toHaveCount(2, { timeout: 8_000 })
        await expect(page.locator('[data-test-id="cart-item-1"]')).toContainText('MacBook Pro M3')
        await expect(page.locator('[data-test-id="cart-item-3"]')).toContainText('AirPods Pro 2')

        const total = 2499 * 1 + 279 * 2
        await expect(page.locator('[data-test-id="cart-total"]')).toContainText(total.toLocaleString('fr-FR'))
    })

    test('ajouter depuis catalogue → panier mis à jour (optimistic)', async ({ page }) => {
        await page.route(NHOST_GRAPHQL_URL, route => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ data: { products: MOCK_PRODUCTS } }),
            })
        })
        await page.route(LOMKIT_MUTATE_URL, route => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ data: [{ id: 99, product_id: 2, product_name: 'iPhone 15 Pro', unit_price: 1199, quantity: 1 }] }),
            })
        })

        await page.goto('/')
        await page.locator('[data-test-id="btn-add-to-cart-2"]').click()

        await expect(page.locator('[data-test-id="cart-badge"]')).toBeVisible()
    })

    test('supprimer un article retire la ligne du panier', async ({ page }) => {
        await page.route(LOMKIT_SEARCH_URL, route => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ data: MOCK_CART_ITEMS }),
            })
        })
        await page.route('**/api/cartItems', route => route.fulfill({ status: 200, body: '{}' }))

        await page.goto('/cart')
        await expect(page.locator('[data-test-class="cart-item"]')).toHaveCount(2, { timeout: 8_000 })

        await page.locator('[data-test-id="btn-remove-1"]').click()
        await expect(page.locator('[data-test-class="cart-item"]')).toHaveCount(1)
    })

    test('augmenter quantité met à jour l\'affichage', async ({ page }) => {
        await page.route(LOMKIT_SEARCH_URL, route => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ data: [MOCK_CART_ITEMS[0]] }),
            })
        })
        await page.route(LOMKIT_MUTATE_URL, route => route.fulfill({ status: 200, body: '{}' }))

        await page.goto('/cart')
        await expect(page.locator('[data-test-id="quantity-1"]')).toContainText('1', { timeout: 8_000 })

        await page.locator('[data-test-id="btn-increase-1"]').click()
        await expect(page.locator('[data-test-id="quantity-1"]')).toContainText('2')
    })
})
