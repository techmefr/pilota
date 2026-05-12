import { computed, ref } from 'vue'
import type { LomkitGetResult } from '@pilota/driver-lomkit'
import { sdk } from '../utils/sdk'
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

export function useCart() {
    const count = computed(() => items.value.reduce((acc, i) => acc + i.quantity, 0))
    const total = computed(() => items.value.reduce((acc, i) => acc + i.unit_price * i.quantity, 0))

    async function loadCart(): Promise<void> {
        isLoading.value = true
        try {
            const result = await sdk.lomkit.cartItems.get({}) as LomkitGetResult<CartItem>
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
            await sdk.lomkit.cartItems.mutate({ ...existing }).catch(() => null)
        } else {
            const item: CartItem = {
                product_id: product.id,
                product_name: product.name,
                unit_price: product.price,
                quantity: 1,
            }
            items.value.push({ ...item, id: Date.now() })
            await sdk.lomkit.cartItems.mutate(item).catch(() => null)
        }
    }

    async function removeItem(productId: number): Promise<void> {
        const item = items.value.find(i => i.product_id === productId)
        if (item?.id !== undefined) {
            await sdk.lomkit.cartItems.delete({ id: item.id }).catch(() => null)
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
        await sdk.lomkit.cartItems.mutate({ ...item }).catch(() => null)
    }

    return { items, count, total, isLoading, loadCart, addItem, removeItem, updateQuantity }
}
