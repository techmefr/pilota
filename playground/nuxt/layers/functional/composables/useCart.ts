import { computed, ref } from 'vue'
import { createNotify } from '@pilota/hooks'
import { sdk } from '../../technical/sdk'
import { createSnackAdapter } from './useNotify'
import type { CartItem, Product } from '../../technical/sdk/resources'

export type { CartItem }

const items = ref<CartItem[]>([])
const isLoading = ref(false)

export function useCart() {
    const count = computed(() => items.value.reduce((acc, i) => acc + i.quantity, 0))
    const total = computed(() => items.value.reduce((acc, i) => acc + i.unit_price * i.quantity, 0))

    async function loadCart(): Promise<void> {
        if (items.value.length > 0) return
        isLoading.value = true
        try {
            const result = await sdk.lomkit.cartItems.get({})
            items.value = result.data ?? []
        } catch {
        } finally {
            isLoading.value = false
        }
    }

    async function addItem(product: Product): Promise<void> {
        const existing = items.value.find(i => i.product_id === product.id)
        if (existing !== undefined) {
            existing.quantity++
            await sdk.lomkit.cartItems.mutate(
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
            await sdk.lomkit.cartItems.mutate(
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
            await sdk.lomkit.cartItems.delete(
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
        await sdk.lomkit.cartItems.mutate(
            { ...item },
            createNotify(createSnackAdapter({ error: 'Failed to update quantity' })),
        ).catch(() => null)
    }

    return { items, count, total, isLoading, loadCart, addItem, removeItem, updateQuantity }
}
