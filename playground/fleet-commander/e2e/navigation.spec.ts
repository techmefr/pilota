import { expect, test } from '@playwright/test'

const routes = [
    { path: '/',          title: 'Tableau de bord', selector: '.kpi-grid',   titleSelector: '.topbar-title' },
    { path: '/inventory', title: 'Inventaire',       selector: '.table-wrap', titleSelector: '.page-title'   },
    { path: '/profiles',  title: 'Configurateur',    selector: '.table-wrap', titleSelector: '.page-title'   },
    { path: '/repairs',   title: 'Réparations',      selector: '.table-wrap', titleSelector: '.page-title'   },
    { path: '/orders',    title: 'Commandes',         selector: '.table-wrap', titleSelector: '.page-title'   },
    { path: '/alerts',    title: 'Alertes',           selector: '.table-wrap', titleSelector: '.page-title'   },
]

test.describe('Navigation', () => {
    for (const route of routes) {
        test(`charge la page ${route.title}`, async ({ page }) => {
            await page.goto(route.path)
            await page.waitForSelector(route.selector, { timeout: 10_000 })
            await expect(page.locator(route.titleSelector)).toContainText(route.title)
        })
    }

    test('navigation via la sidebar charge les pages correctement', async ({ page }) => {
        await page.goto('/')
        await page.waitForSelector('fc-sidebar', { timeout: 10_000 })

        await page.locator('.nav-link').nth(1).click()
        await page.waitForURL('**/inventory')
        await expect(page.locator('.page-title')).toContainText('Inventaire')

        await page.locator('.nav-link').nth(3).click()
        await page.waitForURL('**/repairs')
        await expect(page.locator('.page-title')).toContainText('Réparations')

        await page.locator('.nav-link').nth(0).click()
        await page.waitForURL('**/')
        await expect(page.locator('.kpi-grid')).toBeVisible()
    })

    test('route inconnue redirige vers le dashboard', async ({ page }) => {
        await page.goto('/route-inexistante')
        await page.waitForSelector('.kpi-grid', { timeout: 10_000 })
        await expect(page).toHaveURL(/\/$|\/\?/)
    })

    test('navigue vers la page détail PC depuis l\'inventaire', async ({ page }) => {
        await page.goto('/inventory')
        await page.waitForSelector('.table-wrap', { timeout: 10_000 })
        const link = page.locator('a.mono.link').first()
        const serial = await link.innerText()
        await link.click()
        await page.waitForURL(/\/pc\//, { timeout: 10_000 })
        await expect(page.locator('.serial-chip')).toContainText(serial)
    })
})
