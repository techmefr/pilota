<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useCart } from '../composables/useCart'
import { useProducts } from '../composables/useProducts'

const { products, categories, isLoading, error, fetchProducts } = useProducts()
const { count, addItem } = useCart()

const activeCategory = ref<string | null>(null)
const addedIds = ref<Set<number>>(new Set())

const filtered = computed(() =>
    activeCategory.value === null
        ? products.value
        : products.value.filter(p => p.category === activeCategory.value),
)

async function handleAddToCart(product: Parameters<typeof addItem>[0]): Promise<void> {
    await addItem(product)
    addedIds.value.add(product.id)
    setTimeout(() => addedIds.value.delete(product.id), 1500)
}

onMounted(fetchProducts)
</script>

<template>
    <div data-test-id="page-catalog">
        <v-container fluid class="py-8 px-6">
            <div class="mb-8">
                <h1 class="text-h4 font-weight-bold mb-1">Catalogue</h1>
                <p class="text-medium-emphasis">
                    Produits via
                    <code class="text-primary">sdk.nhost.products.query()</code>
                    — GraphQL Hasura
                </p>
            </div>

            <div v-if="isLoading" data-test-id="catalog-loading">
                <v-row>
                    <v-col v-for="n in 6" :key="n" cols="12" sm="6" md="4" lg="3">
                        <v-skeleton-loader type="card" />
                    </v-col>
                </v-row>
            </div>

            <div v-else-if="error !== null" data-test-id="catalog-error" class="text-center py-12">
                <v-icon size="64" color="error" class="mb-4">mdi-wifi-off</v-icon>
                <p class="text-body-1 text-medium-emphasis mb-4">{{ error }}</p>
                <v-btn color="primary" variant="tonal" prepend-icon="mdi-refresh" @click="fetchProducts">
                    Réessayer
                </v-btn>
            </div>

            <template v-else>
                <div v-if="categories.length > 0" class="d-flex gap-2 flex-wrap mb-6">
                    <v-chip
                        :variant="activeCategory === null ? 'flat' : 'tonal'"
                        :color="activeCategory === null ? 'primary' : 'default'"
                        data-test-id="filter-all"
                        @click="activeCategory = null"
                    >
                        Tous ({{ products.length }})
                    </v-chip>
                    <v-chip
                        v-for="cat in categories"
                        :key="cat"
                        :variant="activeCategory === cat ? 'flat' : 'tonal'"
                        :color="activeCategory === cat ? 'primary' : 'default'"
                        :data-test-class="'filter-category'"
                        :data-test-id="`filter-${cat}`"
                        @click="activeCategory = cat"
                    >
                        {{ cat }}
                    </v-chip>
                </div>

                <div v-if="filtered.length === 0" data-test-id="catalog-empty" class="text-center py-12">
                    <v-icon size="64" color="medium-emphasis" class="mb-4">mdi-package-variant-closed</v-icon>
                    <p class="text-body-1 text-medium-emphasis">Aucun produit disponible</p>
                </div>

                <v-row v-else data-test-id="product-grid">
                    <v-col
                        v-for="product in filtered"
                        :key="product.id"
                        cols="12"
                        sm="6"
                        md="4"
                        lg="3"
                    >
                        <ProductCard
                            :product="product"
                            @add-to-cart="handleAddToCart"
                        />
                    </v-col>
                </v-row>
            </template>
        </v-container>

        <v-snackbar
            :model-value="count > 0 && addedIds.size > 0"
            color="success"
            timeout="1500"
            location="bottom left"
        >
            <v-icon class="mr-2">mdi-check-circle</v-icon>
            Produit ajouté au panier
        </v-snackbar>
    </div>
</template>
