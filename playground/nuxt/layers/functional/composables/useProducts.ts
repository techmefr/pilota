import { computed, ref } from 'vue'
import { createNotify } from '@pilota/hooks'
import { sdk } from '../../technical/sdk'
import { createSnackAdapter } from './useNotify'
import type { Product } from '../../technical/sdk/resources'

export type { Product }

const products = ref<Product[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

export function useProducts() {
    async function fetchProducts(): Promise<void> {
        isLoading.value = true
        error.value = null
        try {
            const result = await sdk.nhost.products.query(
                {},
                createNotify(createSnackAdapter({
                    success: 'Catalogue chargé',
                    error: 'Unable to load catalog',
                })),
            )
            products.value = result.data?.products ?? []
        } catch {
            error.value = 'Unable to load catalog'
        } finally {
            isLoading.value = false
        }
    }

    async function findProduct(id: number): Promise<Product | null> {
        if (products.value.length === 0) await fetchProducts()
        return products.value.find(p => p.id === id) ?? null
    }

    const categories = computed(() => [...new Set(products.value.map(p => p.category))])

    return { products, categories, isLoading, error, fetchProducts, findProduct }
}
