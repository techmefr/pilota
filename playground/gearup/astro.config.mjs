import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import sentry from '@sentry/astro'

export default defineConfig({
    integrations: [
        react(),
        sentry({
            dsn: process.env.PUBLIC_SENTRY_DSN,
            sourceMapsUploadOptions: { disable: true },
        }),
    ],
})
