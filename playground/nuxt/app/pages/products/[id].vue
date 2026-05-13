<script setup lang="ts">
import { useTranslate } from '@tolgee/vue'

const route = useRoute()
const id = computed(() => parseInt(route.params.id as string))

const { findProduct } = useProducts()
const { addItem } = useCart()
const { t } = useTranslate()

const product = ref<Awaited<ReturnType<typeof findProduct>>>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)
const isAdded = ref(false)

onMounted(async () => {
    try {
        product.value = await findProduct(id.value)
        if (product.value === null) error.value = t.value('Product not found')
    } catch {
        error.value = t.value('Error loading product')
    } finally {
        isLoading.value = false
    }
})

async function handleAddToCart(): Promise<void> {
    if (product.value === null) return
    await addItem(product.value)
    isAdded.value = true
    setTimeout(() => { isAdded.value = false }, 2200)
}

const CATEGORY_ICONS: Record<string, string> = {
    Informatique: 'mdi-laptop',
    Smartphones: 'mdi-cellphone',
    Audio: 'mdi-headphones',
    Tablettes: 'mdi-tablet',
    TV: 'mdi-television',
}

const categoryIcon = computed(() => {
    if (product.value === null) return 'mdi-package-variant'
    return CATEGORY_ICONS[product.value.category] ?? 'mdi-package-variant'
})
</script>

<template>
    <div data-test-id="page-product" class="product-page px-4 px-md-8" style="max-width: 1400px; margin: 0 auto;">
        <div class="pt-10 pb-4">
            <v-btn
                to="/"
                variant="text"
                prepend-icon="mdi-arrow-left"
                size="small"
                class="back-btn"
            >
                {{ t('Back to catalog') }}
            </v-btn>
        </div>

        <!-- Loading -->
        <div v-if="isLoading" class="text-center py-32">
            <v-progress-circular indeterminate color="primary" size="40" width="2" />
        </div>

        <!-- Error -->
        <div v-else-if="error !== null" class="text-center py-32">
            <v-icon size="52" color="error" class="mb-6" style="opacity: 0.6;">mdi-alert-circle-outline</v-icon>
            <h2 class="text-h5 font-weight-bold mb-8">{{ error }}</h2>
            <v-btn to="/" color="primary" variant="flat" prepend-icon="mdi-arrow-left">
                {{ t('Back to catalog') }}
            </v-btn>
        </div>

        <!-- Product -->
        <div
            v-else-if="product !== null"
            :data-test-id="`product-detail-${product.id}`"
            class="product-layout pb-24"
        >
            <!-- Visual -->
            <div class="product-visual">
                <div class="product-visual-inner">
                    <v-icon :icon="categoryIcon" size="120" color="primary" class="product-visual-icon" />
                    <div class="product-visual-badge">
                        <v-chip
                            :color="product.stock > 5 ? 'success' : product.stock > 0 ? 'warning' : 'error'"
                            variant="flat"
                            size="small"
                        >
                            <v-icon start size="14">mdi-package-variant</v-icon>
                            {{ product.stock > 0 ? t('{stock} in stock', { stock: product.stock }) : t('Out of stock') }}
                        </v-chip>
                    </div>
                </div>
            </div>

            <!-- Info -->
            <div class="product-info">
                <p class="product-overline">{{ product.category }}</p>
                <h1 class="product-title">{{ product.name }}</h1>

                <p class="product-desc">
                    {{ product.description || t('No description available.') }}
                </p>

                <div class="product-price-row">
                    <span class="product-price">
                        {{ product.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }) }}
                    </span>
                </div>

                <div class="product-actions">
                    <button
                        :data-test-id="`btn-add-to-cart-${product.id}`"
                        class="btn-primary-action"
                        :class="{ success: isAdded }"
                        :disabled="product.stock === 0"
                        @click="handleAddToCart"
                    >
                        <v-icon size="20" class="mr-2">{{ isAdded ? 'mdi-check' : 'mdi-cart-plus' }}</v-icon>
                        {{ isAdded ? t('Added to cart!') : t('Add to cart') }}
                    </button>

                    <v-btn
                        to="/cart"
                        variant="outlined"
                        color="primary"
                        size="large"
                        class="btn-secondary-action"
                        prepend-icon="mdi-cart-outline"
                    >
                        {{ t('View cart') }}
                    </v-btn>
                </div>

                <p class="product-secure">
                    <v-icon size="14" class="mr-1">mdi-shield-check-outline</v-icon>
                    {{ t('Secure payment') }}
                </p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.back-btn {
    font-size: 12px !important;
    font-weight: 600 !important;
    letter-spacing: 0.06em !important;
    opacity: 0.45;
    transition: opacity 0.2s !important;
}
.back-btn:hover { opacity: 1; }

.product-layout {
    display: grid;
    grid-template-columns: 1fr;
    gap: 48px;
}
@media (min-width: 768px) {
    .product-layout { grid-template-columns: 1fr 1fr; gap: 64px; align-items: start; }
}

/* Visual */
.product-visual {
    background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.07) 0%, rgba(var(--v-theme-secondary), 0.07) 100%);
    border-radius: 24px;
    border: 1px solid rgba(128, 128, 128, 0.1);
    padding: 64px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 360px;
    position: relative;
}

.product-visual-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
}

.product-visual-icon { opacity: 0.5; }

/* Info */
.product-overline {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgb(var(--v-theme-primary));
    margin-bottom: 14px;
}

.product-title {
    font-size: clamp(28px, 4vw, 48px);
    font-weight: 900;
    line-height: 1.05;
    letter-spacing: -0.03em;
    color: rgb(var(--v-theme-on-background));
    margin-bottom: 20px;
}

.product-desc {
    font-size: 15px;
    line-height: 1.7;
    opacity: 0.55;
    margin-bottom: 36px;
}

.product-price-row {
    padding: 24px 0;
    border-top: 1px solid rgba(128, 128, 128, 0.12);
    border-bottom: 1px solid rgba(128, 128, 128, 0.12);
    margin-bottom: 32px;
}

.product-price {
    font-size: 42px;
    font-weight: 900;
    letter-spacing: -0.03em;
    color: rgb(var(--v-theme-primary));
}

.product-actions {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 20px;
}

.btn-primary-action {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 52px;
    border-radius: 12px;
    background: rgb(var(--v-theme-primary));
    color: #fff;
    border: none;
    cursor: pointer;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.btn-primary-action:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(var(--v-theme-primary), 0.4); }
.btn-primary-action:active { transform: translateY(0); }
.btn-primary-action.success { background: rgb(var(--v-theme-success)); }
.btn-primary-action:disabled { opacity: 0.35; cursor: not-allowed; transform: none; box-shadow: none; }

.btn-secondary-action { width: 100%; }

.product-secure {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.04em;
    opacity: 0.35;
    display: flex;
    align-items: center;
}
</style>
