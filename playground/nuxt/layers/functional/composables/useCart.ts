import { computed, ref } from 'vue'
import type { LomkitGetResult, LomkitMutateResult } from '@pilota/driver-lomkit'
import { createNotify } from '@pilota/hooks'
import type { Product } from './useProducts'

export type CartItem = {
    id?: number
    product_id: number
    product_name: string
    unit_price: number
    quantity: number
}

const items = ref<CartItem[]>([])
const isLoading = ref(false)

type CartItemsApi = {
    get: (p: object, onEvent?: unknown) => Promise<LomkitGetResult<CartItem>>
    mutate: (p: object, onEvent?: unknown) => Promise<LomkitMutateResult<CartItem>>
    delete: (p: { resources: number[] }, onEvent?: unknown) => Promise<unknown>
}
const cartItemsApi = (sdk.lomkit as unknown as { cartItems: CartItemsApi }).cartItems

export function useCart() {
    const count = computed(() => items.value.reduce((acc, i) => acc + i.quantity, 0))
    const total = computed(() => items.value.reduce((acc, i) => acc + i.unit_price * i.quantity, 0))

    async function loadCart(): Promise<void> {
        isLoading.value = true
        try {
            const result = await cartItemsApi.get({})
            items.value = result.data ?? []
        } catch {
            items.value = []
        } finally {
            isLoading.value = false
        }
    }

    async function addItem(product: Product): Promise<void> {
        const existing = items.value.find(i => i.product_id === product.id)
        if (existing !== undefined) {
            existing.quantity++
            await cartItemsApi.mutate(
                { ...existing },
                createNotify(createSnackAdapter({
                    success: 'Quantité mise à jour',
                    error: 'Failed to update cart',
                })),
            ).catch(() => null)
        } else {
            const item: CartItem = {
                product_id: product.id,
                product_name: product.name,
                unit_price: product.price,
                quantity: 1,
            }
            items.value.push({ ...item, id: Date.now() })
            await cartItemsApi.mutate(
                item,
                createNotify(createSnackAdapter({
                    success: `${product.name} ajouté au panier`,
                    error: 'Failed to add to cart',
                })),
            ).catch(() => null)
        }
    }

    async function removeItem(productId: number): Promise<void> {
        const item = items.value.find(i => i.product_id === productId)
        if (item?.id !== undefined) {
            await cartItemsApi.delete(
                { resources: [item.id] },
                createNotify(createSnackAdapter({
                    success: 'Article retiré',
                    error: 'Failed to remove item',
                })),
            ).catch(() => null)
        }
        items.value = items.value.filter(i => i.product_id !== productId)
    }

    async function updateQuantity(productId: number, quantity: number): Promise<void> {
        if (quantity <= 0) {
            await removeItem(productId)
            return
        }
        const item = items.value.find(i => i.product_id === productId)
        if (item === undefined) return
        item.quantity = quantity
        await cartItemsApi.mutate(
            { ...item },
            createNotify(createSnackAdapter({ error: 'Failed to update quantity' })),
        ).catch(() => null)
    }

    return { items, count, total, isLoading, loadCart, addItem, removeItem, updateQuantity }
}
