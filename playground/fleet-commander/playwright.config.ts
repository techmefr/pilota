import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
    testDir: './e2e',
    fullyParallel: false,
    workers: 1,
    retries: 1,
    reporter: [['html', { open: 'never' }], ['list']],
    use: {
        baseURL: process.env['BASE_URL'] ?? 'http://dev-fleet.localhost',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
    },
    projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
})
