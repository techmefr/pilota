import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
    resolve: {
        alias: {
            nexdk: resolve(__dirname, '../../packages/nexdk/src/index.ts'),
            beepr: resolve(__dirname, '../../packages/beepr/src/index.ts'),
            chaff: resolve(__dirname, '../../packages/chaff/src/index.ts'),
            '@pilota/driver-lomkit': resolve(__dirname, '../../packages/drivers/lomkit/src/index.ts'),
        },
    },
    test: {
        globals: false,
        environment: 'node',
    },
})
