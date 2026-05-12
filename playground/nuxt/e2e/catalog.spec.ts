import { expect, test } from '@playwright/test'
import { MOCK_PRODUCTS, NHOST_GRAPHQL_URL } from './fixtures'

test.describe('Catalogue produits — sdk.nhost.products.query()', () => {
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

    test('affiche le titre et la référence SDK', async ({ page }) => {
        await expect(page.locator('[data-test-id="page-catalog"] h1')).toContainText('Catalogue')
        await expect(page.locator('[data-test-id="page-catalog"]')).toContainText('sdk.nhost.products.query()')
    })

    test('affiche 6 fiches produit', async ({ page }) => {
        await expect(page.locator('[data-test-class="product-card"]')).toHaveCount(6)
    })

    test('chaque carte affiche nom, catégorie et prix', async ({ page }) => {
        await expect(page.locator('[data-test-id="product-name-1"]')).toContainText('MacBook Pro M3')
        await expect(page.locator('[data-test-id="product-price-1"]')).toContainText('2 499')
        await expect(page.locator('[data-test-id="product-category-1"]')).toContainText('Informatique')
    })

    test('filtre par catégorie Audio → 2 produits', async ({ page }) => {
        await page.locator('[data-test-id="filter-Audio"]').click()
        await expect(page.locator('[data-test-class="product-card"]')).toHaveCount(2)
    })

    test('filtre Tous réaffiche tous les produits', async ({ page }) => {
        await page.locator('[data-test-id="filter-Audio"]').click()
        await expect(page.locator('[data-test-class="product-card"]')).toHaveCount(2)

        await page.locator('[data-test-id="filter-all"]').click()
        await expect(page.locator('[data-test-class="product-card"]')).toHaveCount(6)
    })

    test('ajouter au panier met à jour le badge de navigation', async ({ page }) => {
        await page.locator('[data-test-id="btn-add-to-cart-1"]').click()
        await expect(page.locator('[data-test-id="cart-badge"]')).toBeVisible()
    })

    test('erreur backend → affiche état erreur avec retry', async ({ page }) => {
        await page.route(NHOST_GRAPHQL_URL, route => route.fulfill({ status: 500, body: 'error' }))
        await page.goto('/')
        await expect(page.locator('[data-test-id="catalog-error"]')).toBeVisible({ timeout: 8_000 })
    })
})
