<script setup lang="ts">
import type { Product } from '../composables/useProducts'

defineProps<{ product: Product }>()
defineEmits<{ addToCart: [product: Product] }>()
</script>

<template>
    <v-card
        :data-test-id="`product-card-${product.id}`"
        data-test-class="product-card"
        variant="outlined"
        class="product-card h-100 d-flex flex-column"
    >
        <div class="product-image d-flex align-center justify-center bg-surface-variant">
            <v-icon size="64" color="medium-emphasis">mdi-image-outline</v-icon>
        </div>

        <v-card-text class="flex-grow-1 pb-2">
            <v-chip
                :data-test-id="`product-category-${product.id}`"
                size="x-small"
                variant="tonal"
                color="primary"
                class="mb-2"
            >
                {{ product.category }}
            </v-chip>

            <div
                :data-test-id="`product-name-${product.id}`"
                class="text-body-1 font-weight-medium mb-1"
            >
                {{ product.name }}
            </div>

            <div
                :data-test-id="`product-price-${product.id}`"
                class="text-h6 font-weight-bold text-primary"
            >
                {{ product.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }) }}
            </div>
        </v-card-text>

        <v-card-actions class="pt-0 px-4 pb-4">
            <v-chip
                :color="product.stock > 5 ? 'success' : product.stock > 0 ? 'warning' : 'error'"
                size="x-small"
                variant="tonal"
            >
                {{ product.stock > 0 ? `${product.stock} en stock` : 'Rupture' }}
            </v-chip>

            <v-spacer />

            <v-btn
                :data-test-id="`btn-add-to-cart-${product.id}`"
                :disabled="product.stock === 0"
                color="primary"
                size="small"
                variant="tonal"
                prepend-icon="mdi-cart-plus"
                @click="$emit('addToCart', product)"
            >
                Ajouter
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<style scoped>
.product-card {
    transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.product-card:hover {
    transform: translateY(-2px);
}
.product-image {
    height: 180px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
</style>
