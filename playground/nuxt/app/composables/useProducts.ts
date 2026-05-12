import { ref } from 'vue'
import type { NhostQueryResult } from '@pilota/driver-nhost'
import { sdk } from '../utils/sdk'

export type Product = {
    id: number
    name: string
    description: string
    price: number
    image: string
    category: string
    stock: number
}

const products = ref<Product[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

export function useProducts() {
    async function fetchProducts(): Promise<void> {
        isLoading.value = true
        error.value = null
        try {
            const result = await sdk.nhost.products.query({}) as NhostQueryResult<{ products: Product[] }>
            products.value = result.data?.products ?? []
        } catch {
            error.value = 'Impossible de charger le catalogue'
        } finally {
            isLoading.value = false
        }
    }

    const categories = computed(() => [...new Set(products.value.map(p => p.category))])

    return { products, categories, isLoading, error, fetchProducts }
}
