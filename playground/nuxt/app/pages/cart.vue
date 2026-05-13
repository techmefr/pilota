<script setup lang="ts">
import { useTranslate } from '@tolgee/vue'

const { items, count, total, isLoading, loadCart, removeItem, updateQuantity } = useCart()
const { t } = useTranslate()

onMounted(loadCart)

function formatPrice(n: number): string {
    return n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
}
</script>

<template>
    <div data-test-id="page-cart" class="cart-page px-4 px-md-8" style="max-width: 1400px; margin: 0 auto;">
        <div class="d-flex align-center gap-4 pt-12 pb-10">
            <h1 class="page-title">{{ t('Cart') }}</h1>
            <span v-if="count > 0" class="count-badge">{{ count }}</span>
        </div>

        <!-- Loading -->
        <div v-if="isLoading" data-test-id="cart-loading" class="text-center py-24">
            <v-progress-circular indeterminate color="primary" size="36" width="2" />
        </div>

        <!-- Items -->
        <div v-else-if="items.length > 0" class="cart-layout pb-24">
            <!-- Item list -->
            <div class="cart-items">
                <TransitionGroup name="list">
                    <div
                        v-for="(item, i) in items"
                        :key="item.product_id"
                        :data-test-class="'cart-item'"
                        :data-test-id="`cart-item-${item.product_id}`"
                        class="cart-item"
                    >
                        <div class="cart-item-visual">
                            <v-icon color="primary" size="28" style="opacity: 0.5;">mdi-package-variant</v-icon>
                        </div>

                        <div class="cart-item-info">
                            <p class="cart-item-name">{{ item.product_name }}</p>
                            <p class="cart-item-unit">{{ formatPrice(item.unit_price) }} {{ t('per unit') }}</p>
                        </div>

                        <div class="cart-item-controls">
                            <button
                                :data-test-id="`btn-decrease-${item.product_id}`"
                                class="qty-btn"
                                @click="updateQuantity(item.product_id, item.quantity - 1)"
                            >
                                <v-icon size="14">mdi-minus</v-icon>
                            </button>
                            <span :data-test-id="`quantity-${item.product_id}`" class="qty-value">{{ item.quantity }}</span>
                            <button
                                :data-test-id="`btn-increase-${item.product_id}`"
                                class="qty-btn"
                                @click="updateQuantity(item.product_id, item.quantity + 1)"
                            >
                                <v-icon size="14">mdi-plus</v-icon>
                            </button>
                        </div>

                        <div class="cart-item-price">{{ formatPrice(item.unit_price * item.quantity) }}</div>

                        <button
                            :data-test-id="`btn-remove-${item.product_id}`"
                            class="remove-btn"
                            :aria-label="t('Remove')"
                            @click="removeItem(item.product_id)"
                        >
                            <v-icon size="16">mdi-close</v-icon>
                        </button>

                        <div v-if="i < items.length - 1" class="cart-item-divider" />
                    </div>
                </TransitionGroup>
            </div>

            <!-- Summary -->
            <div class="cart-summary" data-test-id="order-summary">
                <h2 class="summary-title">{{ t('Summary') }}</h2>

                <div class="summary-lines">
                    <div v-for="item in items" :key="item.product_id" class="summary-line">
                        <span class="summary-line-name">{{ item.product_name }} × {{ item.quantity }}</span>
                        <span>{{ formatPrice(item.unit_price * item.quantity) }}</span>
                    </div>
                </div>

                <div class="summary-divider" />

                <div class="summary-total">
                    <span>{{ t('Total') }}</span>
                    <span data-test-id="cart-total" class="summary-total-value">{{ formatPrice(total) }}</span>
                </div>

                <NuxtLink to="/checkout" class="text-decoration-none" data-test-id="btn-checkout">
                    <button class="checkout-btn">
                        <v-icon size="18" class="mr-2">mdi-lock-outline</v-icon>
                        {{ t('Checkout') }}
                    </button>
                </NuxtLink>
            </div>
        </div>

        <!-- Empty -->
        <div v-else data-test-id="cart-empty" class="empty-state">
            <div class="empty-icon">
                <v-icon size="52" color="primary" style="opacity: 0.25;">mdi-cart-outline</v-icon>
            </div>
            <h2 class="empty-title">{{ t('Empty cart') }}</h2>
            <p class="empty-sub">{{ t('Add products from the catalog') }}</p>
            <NuxtLink to="/" class="text-decoration-none">
                <button class="browse-btn">
                    {{ t('Browse catalog') }}
                </button>
            </NuxtLink>
        </div>
    </div>
</template>

<style scoped>
.page-title {
    font-size: clamp(32px, 5vw, 56px);
    font-weight: 900;
    letter-spacing: -0.03em;
    line-height: 1;
}

.count-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 28px;
    height: 28px;
    border-radius: 100px;
    background: rgb(var(--v-theme-primary));
    color: #fff;
    font-size: 12px;
    font-weight: 800;
    padding: 0 8px;
}

/* ─── Layout ─── */
.cart-layout {
    display: grid;
    grid-template-columns: 1fr;
    gap: 32px;
    align-items: start;
}
@media (min-width: 900px) {
    .cart-layout { grid-template-columns: 1fr 360px; gap: 48px; }
}

/* ─── Items ─── */
.cart-items {
    background: rgb(var(--v-theme-surface));
    border-radius: 20px;
    border: 1px solid rgba(128, 128, 128, 0.1);
    padding: 8px 0;
    position: relative;
}

.cart-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px 24px;
    position: relative;
}

.cart-item-visual {
    width: 52px;
    height: 52px;
    border-radius: 12px;
    background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.08), rgba(var(--v-theme-secondary), 0.08));
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.cart-item-info { flex: 1; min-width: 0; }

.cart-item-name {
    font-size: 14px;
    font-weight: 700;
    color: rgb(var(--v-theme-on-surface));
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.cart-item-unit {
    font-size: 12px;
    opacity: 0.45;
    margin-top: 2px;
}

.cart-item-controls {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
}

.qty-btn {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 1px solid rgba(128, 128, 128, 0.2);
    background: transparent;
    cursor: pointer;
    color: rgb(var(--v-theme-on-surface));
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s, border-color 0.15s;
}
.qty-btn:hover { background: rgba(128, 128, 128, 0.1); border-color: rgba(128, 128, 128, 0.4); }

.qty-value {
    font-size: 15px;
    font-weight: 800;
    min-width: 20px;
    text-align: center;
}

.cart-item-price {
    font-size: 15px;
    font-weight: 800;
    letter-spacing: -0.01em;
    flex-shrink: 0;
}

.remove-btn {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: none;
    background: transparent;
    cursor: pointer;
    color: rgb(var(--v-theme-on-surface));
    opacity: 0.3;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.15s, background 0.15s;
    flex-shrink: 0;
}
.remove-btn:hover { opacity: 0.8; background: rgba(var(--v-theme-error), 0.1); color: rgb(var(--v-theme-error)); }

.cart-item-divider {
    position: absolute;
    bottom: 0;
    left: 24px;
    right: 24px;
    height: 1px;
    background: rgba(128, 128, 128, 0.08);
}

/* List transition */
.list-enter-active, .list-leave-active { transition: all 0.25s ease; }
.list-enter-from, .list-leave-to { opacity: 0; transform: translateX(-12px); }

/* ─── Summary ─── */
.cart-summary {
    background: rgb(var(--v-theme-surface));
    border-radius: 20px;
    border: 1px solid rgba(128, 128, 128, 0.1);
    padding: 28px;
    position: sticky;
    top: 80px;
}

.summary-title {
    font-size: 18px;
    font-weight: 800;
    letter-spacing: -0.02em;
    margin-bottom: 20px;
}

.summary-lines { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }

.summary-line {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 8px;
}

.summary-line-name {
    font-size: 13px;
    opacity: 0.55;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
}

.summary-divider {
    height: 1px;
    background: rgba(128, 128, 128, 0.12);
    margin-bottom: 16px;
}

.summary-total {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 28px;
    font-size: 16px;
    font-weight: 700;
}

.summary-total-value {
    font-size: 24px;
    font-weight: 900;
    letter-spacing: -0.02em;
    color: rgb(var(--v-theme-primary));
}

.checkout-btn {
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
.checkout-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(var(--v-theme-primary), 0.4); }

/* ─── Empty ─── */
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 80px 0 120px;
}

.empty-icon {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: rgba(var(--v-theme-primary), 0.06);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 28px;
}

.empty-title {
    font-size: 28px;
    font-weight: 900;
    letter-spacing: -0.03em;
    margin-bottom: 10px;
}

.empty-sub {
    font-size: 15px;
    opacity: 0.45;
    margin-bottom: 36px;
}

.browse-btn {
    display: inline-flex;
    align-items: center;
    height: 48px;
    padding: 0 28px;
    border-radius: 100px;
    background: rgb(var(--v-theme-primary));
    color: #fff;
    border: none;
    cursor: pointer;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s;
}
.browse-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(var(--v-theme-primary), 0.35); }
</style>
