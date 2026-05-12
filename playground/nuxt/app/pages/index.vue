<script setup lang="ts">
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
        <div class="hero-section">
            <v-container class="text-center py-16">
                <v-chip color="primary" variant="tonal" size="small" class="mb-5 font-mono">
                    sdk.nhost.products.query() — GraphQL Hasura
                </v-chip>
                <h1 class="text-h3 font-weight-black mb-4 text-on-surface">
                    Découvrez notre <span class="text-gradient">catalogue</span>
                </h1>
                <p class="text-body-1 text-medium-emphasis mx-auto" style="max-width: 480px;">
                    Les meilleures tech, gérées via une architecture driver-based unifiée.
                </p>
            </v-container>
        </div>

        <v-container fluid class="pb-16 px-6">
            <div v-if="isLoading" data-test-id="catalog-loading">
                <v-row>
                    <v-col v-for="n in 8" :key="n" cols="12" sm="6" md="4" lg="3">
                        <v-skeleton-loader type="card" color="surface" />
                    </v-col>
                </v-row>
            </div>

            <div v-else-if="error !== null" data-test-id="catalog-error" class="text-center py-16">
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

                <div v-if="filtered.length === 0" data-test-id="catalog-empty" class="text-center py-16">
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
                        <ProductCard :product="product" @add-to-cart="handleAddToCart" />
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

<style scoped>
.hero-section {
    background: linear-gradient(180deg, rgba(99, 102, 241, 0.1) 0%, transparent 100%);
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}
.text-gradient {
    background: linear-gradient(135deg, #6366f1 0%, #a78bfa 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}
.font-mono {
    font-family: 'Fira Code', 'Consolas', monospace;
    font-size: 0.75rem;
}
</style>
