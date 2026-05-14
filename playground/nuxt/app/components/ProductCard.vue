<script setup lang="ts">
import { useTranslate } from '@tolgee/vue'
import type { Product } from '../../layers/technical/sdk/resources'

defineProps<{ product: Product }>()
defineEmits<{ addToCart: [product: Product] }>()

const { t } = useTranslate()

const CATEGORY_ICONS: Record<string, string> = {
    Informatique: 'mdi-laptop',
    Smartphones: 'mdi-cellphone',
    Audio: 'mdi-headphones',
    Tablettes: 'mdi-tablet',
    TV: 'mdi-television',
}
</script>

<template>
    <article class="pcard" :data-test-id="`product-card-${product.id}`" data-test-class="product-card">
        <NuxtLink :to="`/products/${product.id}`" class="pcard-visual">
            <v-icon
                :icon="CATEGORY_ICONS[product.category] ?? 'mdi-package-variant'"
                size="56"
                color="primary"
                class="pcard-icon"
            />
            <v-chip
                :color="product.stock > 5 ? 'success' : product.stock > 0 ? 'warning' : 'error'"
                size="x-small"
                variant="flat"
                class="pcard-stock"
            >
                {{ product.stock > 0 ? t('{stock} in stock', { stock: product.stock }) : t('Out of stock') }}
            </v-chip>
        </NuxtLink>

        <div class="pcard-body">
            <p class="pcard-category">{{ product.category }}</p>

            <NuxtLink :to="`/products/${product.id}`" class="text-decoration-none">
                <h3
                    :data-test-id="`product-name-${product.id}`"
                    class="pcard-name"
                >
                    {{ product.name }}
                </h3>
            </NuxtLink>

            <div class="pcard-footer">
                <span
                    :data-test-id="`product-price-${product.id}`"
                    class="pcard-price"
                >
                    {{ product.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }) }}
                </span>

                <button
                    :data-test-id="`btn-add-to-cart-${product.id}`"
                    class="pcard-add"
                    :disabled="product.stock === 0"
                    @click="$emit('addToCart', product)"
                >
                    <v-icon size="16">mdi-plus</v-icon>
                </button>
            </div>
        </div>
    </article>
</template>

<style scoped>
.pcard {
    background: rgb(var(--v-theme-surface));
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid rgba(128, 128, 128, 0.1);
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease, border-color 0.3s ease;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    height: 100%;
}

.pcard:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 60px rgba(var(--v-theme-primary), 0.15), 0 4px 20px rgba(0, 0, 0, 0.12);
    border-color: rgba(var(--v-theme-primary), 0.25);
}

/* Visual area */
.pcard-visual {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
    background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.06) 0%, rgba(var(--v-theme-secondary), 0.06) 100%);
    text-decoration: none;
    position: relative;
    transition: background 0.3s ease;
}
.pcard:hover .pcard-visual {
    background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.12) 0%, rgba(var(--v-theme-secondary), 0.10) 100%);
}

.pcard-icon {
    opacity: 0.45;
    transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.pcard:hover .pcard-icon {
    opacity: 0.7;
    transform: scale(1.1);
}

.pcard-stock {
    position: absolute;
    top: 12px;
    right: 12px;
    font-size: 10px !important;
    font-weight: 700 !important;
    letter-spacing: 0.04em;
}

/* Body */
.pcard-body {
    padding: 18px 20px 20px;
    flex: 1;
    display: flex;
    flex-direction: column;
}

.pcard-category {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgb(var(--v-theme-primary));
    margin-bottom: 8px;
}

.pcard-name {
    font-size: 15px;
    font-weight: 700;
    line-height: 1.3;
    color: rgb(var(--v-theme-on-surface));
    margin-bottom: 16px;
    flex: 1;
    transition: color 0.2s;
}
.pcard:hover .pcard-name {
    color: rgb(var(--v-theme-primary));
}

/* Footer */
.pcard-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

.pcard-price {
    font-size: 20px;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: rgb(var(--v-theme-on-surface));
}

.pcard-add {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgb(var(--v-theme-primary));
    color: #fff;
    border: none;
    cursor: pointer;
    transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.2s, opacity 0.2s;
    flex-shrink: 0;
}
.pcard-add:hover { transform: scale(1.15); }
.pcard-add:active { transform: scale(0.92); }
.pcard-add:disabled { opacity: 0.3; cursor: not-allowed; transform: none; }
</style>
