import { computed, ref } from 'vue'
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

type ProductsApi = { query: (p: object) => Promise<NhostQueryResult<{ products: Product[] }>> }
const productsApi = (sdk.nhost as unknown as { products: ProductsApi }).products

export function useProducts() {
    async function fetchProducts(): Promise<void> {
        isLoading.value = true
        error.value = null
        try {
            const result = await productsApi.query({})
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
