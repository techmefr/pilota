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
    setTimeout(() => {
        isAdded.value = false
    }, 2000)
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
    <v-container class="py-10" data-test-id="page-product" style="max-width: 960px;">
        <v-btn
            to="/"
            variant="text"
            prepend-icon="mdi-arrow-left"
            size="small"
            class="mb-8 text-medium-emphasis"
        >
            {{ t('Back to catalog') }}
        </v-btn>

        <div v-if="isLoading" class="text-center py-16">
            <v-progress-circular indeterminate color="primary" size="48" />
        </div>

        <div v-else-if="error !== null" class="text-center py-16">
            <v-icon size="64" color="error" class="mb-4">mdi-alert-circle-outline</v-icon>
            <h2 class="text-h5 mb-6">{{ error }}</h2>
            <v-btn to="/" color="primary" variant="tonal" prepend-icon="mdi-arrow-left">
                {{ t('Back to catalog') }}
            </v-btn>
        </div>

        <v-row v-else-if="product !== null" :data-test-id="`product-detail-${product.id}`">
            <v-col cols="12" md="5">
                <v-card class="d-flex align-center justify-center product-visual" height="360" variant="outlined">
                    <div class="text-center pa-8">
                        <v-icon :icon="categoryIcon" size="100" color="primary" class="mb-6 opacity-50" />
                        <div>
                            <v-chip
                                :color="product.stock > 5 ? 'success' : product.stock > 0 ? 'warning' : 'error'"
                                variant="tonal"
                            >
                                <v-icon start size="16">mdi-package-variant</v-icon>
                                {{ product.stock > 0 ? t('{stock} in stock', { stock: product.stock }) : t('Out of stock') }}
                            </v-chip>
                        </div>
                    </div>
                </v-card>
            </v-col>

            <v-col cols="12" md="7" class="pl-md-8">
                <v-chip color="primary" variant="tonal" size="small" class="mb-4">
                    {{ product.category }}
                </v-chip>

                <h1 class="text-h4 font-weight-bold mb-4">{{ product.name }}</h1>

                <p class="text-body-1 text-medium-emphasis mb-8" style="line-height: 1.7;">
                    {{ product.description || t('No description available.') }}
                </p>

                <div class="price-block mb-8">
                    <span class="text-h3 font-weight-black text-primary">
                        {{ product.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }) }}
                    </span>
                </div>

                <div class="d-flex flex-column gap-3">
                    <v-btn
                        :data-test-id="`btn-add-to-cart-${product.id}`"
                        :disabled="product.stock === 0"
                        :color="isAdded ? 'success' : 'primary'"
                        size="large"
                        block
                        :prepend-icon="isAdded ? 'mdi-check' : 'mdi-cart-plus'"
                        @click="handleAddToCart"
                    >
                        {{ isAdded ? t('Added to cart!') : t('Add to cart') }}
                    </v-btn>

                    <v-btn
                        to="/cart"
                        variant="tonal"
                        color="secondary"
                        size="large"
                        block
                        prepend-icon="mdi-cart-outline"
                    >
                        {{ t('View cart') }}
                    </v-btn>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<style scoped>
.product-visual {
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.06) 0%, rgba(139, 92, 246, 0.06) 100%);
}
.price-block {
    padding: 16px 0;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
</style>
