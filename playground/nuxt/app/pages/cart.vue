<script setup lang="ts">
import { onMounted } from 'vue'
import { useCart } from '../composables/useCart'

const { items, count, total, isLoading, loadCart, removeItem, updateQuantity } = useCart()

onMounted(loadCart)

function formatPrice(n: number): string {
    return n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
}
</script>

<template>
    <v-container class="py-8" data-test-id="page-cart">
        <div class="d-flex align-center gap-3 mb-6">
            <h1 class="text-h4 font-weight-bold">Panier</h1>
            <v-chip v-if="count > 0" color="primary" size="small">{{ count }} article{{ count > 1 ? 's' : '' }}</v-chip>
        </div>

        <p class="text-medium-emphasis mb-6 text-body-2">
            Géré via <code class="text-primary">sdk.lomkit.cartItems.get/mutate/delete()</code> — REST Laravel
        </p>

        <div v-if="isLoading" data-test-id="cart-loading" class="text-center py-12">
            <v-progress-circular indeterminate color="primary" />
        </div>

        <v-row v-else-if="items.length > 0">
            <v-col cols="12" md="8">
                <v-card variant="outlined">
                    <v-list data-test-id="cart-items" lines="two">
                        <template v-for="(item, i) in items" :key="item.product_id">
                            <v-list-item :data-test-class="'cart-item'" :data-test-id="`cart-item-${item.product_id}`">
                                <template #prepend>
                                    <v-avatar color="surface-variant" rounded="sm" size="56" class="mr-3">
                                        <v-icon>mdi-package-variant</v-icon>
                                    </v-avatar>
                                </template>

                                <v-list-item-title class="font-weight-medium">
                                    {{ item.product_name }}
                                </v-list-item-title>
                                <v-list-item-subtitle>
                                    {{ formatPrice(item.unit_price) }} / unité
                                </v-list-item-subtitle>

                                <template #append>
                                    <div class="d-flex align-center gap-2">
                                        <v-btn
                                            :data-test-id="`btn-decrease-${item.product_id}`"
                                            icon="mdi-minus"
                                            size="x-small"
                                            variant="tonal"
                                            @click="updateQuantity(item.product_id, item.quantity - 1)"
                                        />
                                        <span :data-test-id="`quantity-${item.product_id}`" class="text-body-1 font-weight-bold" style="min-width: 24px; text-align: center;">
                                            {{ item.quantity }}
                                        </span>
                                        <v-btn
                                            :data-test-id="`btn-increase-${item.product_id}`"
                                            icon="mdi-plus"
                                            size="x-small"
                                            variant="tonal"
                                            @click="updateQuantity(item.product_id, item.quantity + 1)"
                                        />
                                        <v-btn
                                            :data-test-id="`btn-remove-${item.product_id}`"
                                            icon="mdi-trash-can-outline"
                                            size="x-small"
                                            color="error"
                                            variant="text"
                                            class="ml-2"
                                            @click="removeItem(item.product_id)"
                                        />
                                    </div>
                                </template>
                            </v-list-item>

                            <v-divider v-if="i < items.length - 1" />
                        </template>
                    </v-list>
                </v-card>
            </v-col>

            <v-col cols="12" md="4">
                <v-card variant="outlined" data-test-id="order-summary">
                    <v-card-title class="text-body-1 font-weight-medium">Récapitulatif</v-card-title>
                    <v-card-text>
                        <div
                            v-for="item in items"
                            :key="item.product_id"
                            class="d-flex justify-space-between text-body-2 mb-1"
                        >
                            <span class="text-medium-emphasis">{{ item.product_name }} × {{ item.quantity }}</span>
                            <span>{{ formatPrice(item.unit_price * item.quantity) }}</span>
                        </div>

                        <v-divider class="my-3" />

                        <div class="d-flex justify-space-between text-body-1 font-weight-bold">
                            <span>Total</span>
                            <span data-test-id="cart-total" class="text-primary">{{ formatPrice(total) }}</span>
                        </div>
                    </v-card-text>

                    <v-card-actions class="px-4 pb-4">
                        <v-btn
                            data-test-id="btn-checkout"
                            color="primary"
                            block
                            size="large"
                            prepend-icon="mdi-lock-outline"
                        >
                            Commander
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>

        <div v-else data-test-id="cart-empty" class="text-center py-16">
            <v-icon size="80" color="medium-emphasis" class="mb-4">mdi-cart-outline</v-icon>
            <h2 class="text-h5 mb-2">Panier vide</h2>
            <p class="text-medium-emphasis mb-6">Ajoutez des produits depuis le catalogue</p>
            <v-btn color="primary" variant="tonal" to="/" prepend-icon="mdi-arrow-left">
                Retour au catalogue
            </v-btn>
        </div>
    </v-container>
</template>
