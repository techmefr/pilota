<script setup lang="ts">
import { useTranslate } from '@tolgee/vue'
import { useProducts } from '../composables/useProducts'
import { useCart } from '../composables/useCart'

const { products, categories, isLoading, error, fetchProducts } = useProducts()
const { addItem } = useCart()
const { t } = useTranslate()

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

        <!-- Hero -->
        <section class="hero">
            <div class="hero-inner px-4 px-md-8" style="max-width: 1400px; margin: 0 auto;">
                <p class="hero-overline">{{ t('New collection') }}</p>
                <h1 class="hero-title">
                    {{ t('Discover') }}<br>
                    <span class="hero-title-accent">{{ t('the best') }}</span>
                </h1>
                <p class="hero-sub">{{ t('The best tech, managed via a unified driver-based architecture.') }}</p>
            </div>
        </section>

        <!-- Catalog -->
        <section class="catalog-section px-4 px-md-8" style="max-width: 1400px; margin: 0 auto;">

            <!-- Skeleton -->
            <div v-if="isLoading" data-test-id="catalog-loading">
                <div class="filter-row mb-8">
                    <v-skeleton-loader v-for="n in 5" :key="n" type="chip" width="80" class="mr-2" />
                </div>
                <div class="product-grid">
                    <v-skeleton-loader v-for="n in 8" :key="n" type="card" color="surface" class="product-grid-item" />
                </div>
            </div>

            <!-- Error -->
            <div v-else-if="error !== null" data-test-id="catalog-error" class="text-center py-24">
                <v-icon size="56" color="error" class="mb-5">mdi-wifi-off</v-icon>
                <p class="text-body-1 mb-6" style="opacity: 0.5;">{{ error }}</p>
                <v-btn color="primary" variant="flat" prepend-icon="mdi-refresh" @click="fetchProducts">
                    {{ t('Retry') }}
                </v-btn>
            </div>

            <template v-else>
                <!-- Filters -->
                <div v-if="categories.length > 0" class="filter-row mb-10">
                    <button
                        class="filter-btn"
                        :class="{ active: activeCategory === null }"
                        data-test-id="filter-all"
                        @click="activeCategory = null"
                    >
                        {{ t('All') }}
                        <span class="filter-count">{{ products.length }}</span>
                    </button>
                    <button
                        v-for="cat in categories"
                        :key="cat"
                        class="filter-btn"
                        :class="{ active: activeCategory === cat }"
                        :data-test-class="'filter-category'"
                        :data-test-id="`filter-${cat}`"
                        @click="activeCategory = cat"
                    >
                        {{ cat }}
                    </button>
                </div>

                <!-- Empty -->
                <div v-if="filtered.length === 0" data-test-id="catalog-empty" class="text-center py-24">
                    <v-icon size="56" class="mb-5" style="opacity: 0.2;">mdi-package-variant-closed</v-icon>
                    <p class="text-body-1" style="opacity: 0.4;">{{ t('No products available') }}</p>
                </div>

                <!-- Grid -->
                <div v-else class="product-grid" data-test-id="product-grid">
                    <ProductCard
                        v-for="product in filtered"
                        :key="product.id"
                        :product="product"
                        :data-test-id="`product-card-${product.id}`"
                        data-test-class="product-card"
                        class="product-grid-item"
                        @add-to-cart="handleAddToCart"
                    />
                </div>
            </template>
        </section>

        <v-snackbar
            :model-value="addedIds.size > 0"
            color="success"
            timeout="1500"
            location="bottom left"
            rounded="lg"
        >
            <v-icon class="mr-2" size="18">mdi-check-circle</v-icon>
            <span class="text-body-2 font-weight-medium">{{ t('Product added to cart') }}</span>
        </v-snackbar>
    </div>
</template>

<style scoped>
/* ─── Hero ─── */
.hero {
    padding: 80px 0 72px;
    position: relative;
    overflow: hidden;
}
.hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 80% 60% at 20% 50%, rgba(var(--v-theme-primary), 0.12) 0%, transparent 70%);
    pointer-events: none;
}

.hero-inner { position: relative; }

.hero-overline {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgb(var(--v-theme-primary));
    margin-bottom: 20px;
}

.hero-title {
    font-size: clamp(52px, 8vw, 96px);
    font-weight: 900;
    line-height: 0.93;
    letter-spacing: -0.04em;
    color: rgb(var(--v-theme-on-background));
    margin-bottom: 28px;
    text-transform: uppercase;
}

.hero-title-accent {
    background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgb(var(--v-theme-secondary)) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.hero-sub {
    font-size: 15px;
    font-weight: 400;
    line-height: 1.6;
    max-width: 440px;
    opacity: 0.5;
}

/* ─── Catalog section ─── */
.catalog-section {
    padding-bottom: 100px;
}

/* ─── Filters ─── */
.filter-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
}

.filter-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 7px 16px;
    border-radius: 100px;
    border: 1px solid rgba(128, 128, 128, 0.2);
    background: transparent;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.02em;
    color: rgb(var(--v-theme-on-background));
    opacity: 0.55;
    transition: all 0.2s ease;
    white-space: nowrap;
}
.filter-btn:hover { opacity: 0.85; border-color: rgba(128, 128, 128, 0.4); }
.filter-btn.active {
    background: rgb(var(--v-theme-primary));
    border-color: rgb(var(--v-theme-primary));
    color: #fff;
    opacity: 1;
}

.filter-count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: 700;
    min-width: 18px;
    height: 18px;
    border-radius: 100px;
    background: rgba(255, 255, 255, 0.2);
    padding: 0 4px;
}
.filter-btn:not(.active) .filter-count {
    background: rgba(128, 128, 128, 0.15);
}

/* ─── Product grid ─── */
.product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 20px;
}

.product-grid-item {
    min-width: 0;
}
</style>
