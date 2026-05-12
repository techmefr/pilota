<script setup lang="ts">
import type { Product } from '../composables/useProducts'

defineProps<{ product: Product }>()
defineEmits<{ addToCart: [product: Product] }>()

const CATEGORY_ICONS: Record<string, string> = {
    Informatique: 'mdi-laptop',
    Smartphones: 'mdi-cellphone',
    Audio: 'mdi-headphones',
    Tablettes: 'mdi-tablet',
    TV: 'mdi-television',
}
</script>

<template>
    <v-card
        :data-test-id="`product-card-${product.id}`"
        data-test-class="product-card"
        variant="outlined"
        class="product-card h-100 d-flex flex-column"
    >
        <NuxtLink :to="`/products/${product.id}`" class="text-decoration-none">
            <div class="product-image d-flex align-center justify-center product-image-hover">
                <v-icon
                    :icon="CATEGORY_ICONS[product.category] ?? 'mdi-package-variant'"
                    size="64"
                    color="primary"
                    class="opacity-40"
                />
            </div>
        </NuxtLink>

        <v-card-text class="flex-grow-1 pb-2">
            <v-chip size="x-small" variant="tonal" color="primary" class="mb-2">
                {{ product.category }}
            </v-chip>

            <NuxtLink :to="`/products/${product.id}`" class="text-decoration-none">
                <div
                    :data-test-id="`product-name-${product.id}`"
                    class="text-body-1 font-weight-medium mb-1 text-on-surface product-name"
                >
                    {{ product.name }}
                </div>
            </NuxtLink>

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
    height: 160px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%);
    transition: background 0.2s ease;
}
.product-image-hover:hover {
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%);
}
.product-name:hover {
    color: rgb(var(--v-theme-primary)) !important;
}
</style>
