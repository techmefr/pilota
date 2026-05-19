import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
    resolve: {
        alias: {
            '@pilota/core': resolve(__dirname, '../../packages/core/src/index.ts'),
            '@pilota/driver-lomkit': resolve(__dirname, '../../packages/drivers/lomkit/src/index.ts'),
        },
    },
    test: {
        globals: false,
        environment: 'node',
    },
})
