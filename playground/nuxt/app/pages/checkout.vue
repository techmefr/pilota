<script setup lang="ts">
import { useTranslate } from '@tolgee/vue'
import { useResourceForm } from '@pilota/hooks'
import { orderResource } from '../resources/order.resource'

const { items, total, count } = useCart()
const { t } = useTranslate()
const isSuccess = ref(false)
const isSubmitting = ref(false)

const { values, errors, isDirty, handleSubmit, reset } = useResourceForm(
    orderResource as unknown as Parameters<typeof useResourceForm>[0],
)

const submit = handleSubmit(async () => {
    isSubmitting.value = true
    try {
        isSuccess.value = true
        reset()
    } finally {
        isSubmitting.value = false
    }
})

function formatPrice(n: number): string {
    return n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
}
</script>

<template>
    <div data-test-id="page-checkout" class="checkout-page px-4 px-md-8" style="max-width: 1400px; margin: 0 auto;">
        <div class="pt-12 pb-10">
            <v-btn to="/cart" variant="text" prepend-icon="mdi-arrow-left" size="small" class="back-btn">
                {{ t('Back to cart') }}
            </v-btn>
        </div>

        <!-- Success -->
        <Transition name="success">
            <div v-if="isSuccess" data-test-id="checkout-success" class="success-state">
                <div class="success-ring">
                    <v-icon size="52" color="success">mdi-check</v-icon>
                </div>
                <h2 class="success-title">{{ t('Order confirmed!') }}</h2>
                <p class="success-sub">{{ t('Thank you for your order. You will receive a confirmation by email.') }}</p>
                <NuxtLink to="/" class="text-decoration-none">
                    <button class="success-btn">
                        <v-icon size="18" class="mr-2">mdi-store-outline</v-icon>
                        {{ t('Back to catalog') }}
                    </button>
                </NuxtLink>
            </div>
        </Transition>

        <!-- Form -->
        <div v-if="!isSuccess" class="checkout-layout pb-24">
            <!-- Left: form -->
            <div class="checkout-form-col">
                <h1 class="page-title mb-10">{{ t('Finalize your order') }}</h1>

                <div class="form-section">
                    <p class="form-section-label">{{ t('Your information') }}</p>

                    <v-text-field
                        v-model="values.full_name"
                        :error-messages="errors.full_name"
                        :label="t('Full name')"
                        placeholder="Jean Dupont"
                        prepend-inner-icon="mdi-account-outline"
                    />

                    <div class="form-row">
                        <v-text-field
                            v-model="values.email"
                            :error-messages="errors.email"
                            :label="t('Email address')"
                            placeholder="jean@exemple.fr"
                            type="email"
                            prepend-inner-icon="mdi-email-outline"
                        />
                        <v-text-field
                            v-model="values.phone"
                            :error-messages="errors.phone"
                            :label="t('Phone (optional)')"
                            placeholder="06 12 34 56 78"
                            prepend-inner-icon="mdi-phone-outline"
                        />
                    </div>
                </div>

                <div class="form-section">
                    <p class="form-section-label">{{ t('Delivery address') }}</p>

                    <v-text-field
                        v-model="values.address"
                        :error-messages="errors.address"
                        :label="t('Address')"
                        placeholder="12 rue de la Paix"
                        prepend-inner-icon="mdi-map-marker-outline"
                    />

                    <div class="form-row">
                        <v-text-field
                            v-model="values.city"
                            :error-messages="errors.city"
                            :label="t('City')"
                            placeholder="Paris"
                            prepend-inner-icon="mdi-city-variant-outline"
                        />
                        <v-text-field
                            v-model="values.zip_code"
                            :error-messages="errors.zip_code"
                            :label="t('Postal code')"
                            placeholder="75001"
                            prepend-inner-icon="mdi-post-outline"
                            maxlength="5"
                        />
                    </div>

                    <v-textarea
                        v-model="values.notes"
                        :error-messages="errors.notes"
                        :label="t('Notes (optional)')"
                        placeholder="Instructions de livraison…"
                        rows="2"
                        auto-grow
                    />
                </div>
            </div>

            <!-- Right: summary -->
            <div class="checkout-summary-col">
                <div class="checkout-summary" data-test-id="checkout-summary">
                    <h2 class="summary-title">{{ t('Summary') }}</h2>

                    <div v-if="count === 0" class="text-center py-8">
                        <p class="text-body-2" style="opacity: 0.45;">{{ t('Empty cart') }}</p>
                        <v-btn to="/" variant="text" color="primary" size="small" class="mt-3">
                            {{ t('Catalog') }}
                        </v-btn>
                    </div>

                    <template v-else>
                        <div class="summary-items">
                            <div v-for="item in items" :key="item.product_id" class="summary-line">
                                <span class="summary-line-name">{{ item.product_name }} × {{ item.quantity }}</span>
                                <span class="summary-line-price">{{ formatPrice(item.unit_price * item.quantity) }}</span>
                            </div>
                        </div>

                        <div class="summary-divider" />

                        <div class="summary-total">
                            <span>{{ t('Total') }}</span>
                            <span data-test-id="checkout-total" class="summary-total-value">{{ formatPrice(total) }}</span>
                        </div>

                        <button
                            data-test-id="btn-place-order"
                            class="order-btn"
                            :disabled="isSubmitting"
                            @click="submit"
                        >
                            <v-progress-circular v-if="isSubmitting" indeterminate size="18" width="2" color="white" class="mr-2" />
                            <v-icon v-else size="18" class="mr-2">mdi-lock-outline</v-icon>
                            {{ t('Confirm order') }}
                        </button>

                        <p class="secure-label">
                            <v-icon size="13" class="mr-1">mdi-shield-check-outline</v-icon>
                            {{ t('Secure payment') }}
                        </p>
                    </template>
                </div>

                <p class="dirty-hint" v-if="isDirty">
                    <v-icon size="13" class="mr-1">mdi-pencil-outline</v-icon>
                    {{ t('Form modified') }}
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

/* ─── Layout ─── */
.checkout-layout {
    display: grid;
    grid-template-columns: 1fr;
    gap: 40px;
    align-items: start;
}
@media (min-width: 900px) {
    .checkout-layout { grid-template-columns: 1fr 360px; gap: 56px; }
}

.page-title {
    font-size: clamp(28px, 4vw, 44px);
    font-weight: 900;
    letter-spacing: -0.03em;
    line-height: 1.05;
}

/* ─── Form sections ─── */
.form-section {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 36px;
}

.form-section-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgb(var(--v-theme-primary));
    margin-bottom: 4px;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
}
@media (max-width: 600px) {
    .form-row { grid-template-columns: 1fr; }
}

/* ─── Summary ─── */
.checkout-summary {
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

.summary-items { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }

.summary-line {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 8px;
}

.summary-line-name {
    font-size: 13px;
    opacity: 0.55;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.summary-line-price {
    font-size: 13px;
    font-weight: 600;
    flex-shrink: 0;
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
    font-size: 15px;
    font-weight: 700;
}

.summary-total-value {
    font-size: 26px;
    font-weight: 900;
    letter-spacing: -0.02em;
    color: rgb(var(--v-theme-primary));
}

.order-btn {
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
    margin-bottom: 12px;
}
.order-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(var(--v-theme-primary), 0.4); }
.order-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; box-shadow: none; }

.secure-label {
    font-size: 11px;
    opacity: 0.35;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
}

.dirty-hint {
    font-size: 11px;
    opacity: 0.35;
    display: flex;
    align-items: center;
    margin-top: 12px;
    font-weight: 500;
}

/* ─── Success ─── */
.success-enter-active { animation: fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both; }
@keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }

.success-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 80px 0 120px;
}

.success-ring {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: rgba(var(--v-theme-success), 0.12);
    border: 2px solid rgba(var(--v-theme-success), 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 32px;
}

.success-title {
    font-size: 36px;
    font-weight: 900;
    letter-spacing: -0.03em;
    margin-bottom: 12px;
}

.success-sub {
    font-size: 15px;
    opacity: 0.5;
    max-width: 420px;
    line-height: 1.6;
    margin-bottom: 40px;
}

.success-btn {
    display: inline-flex;
    align-items: center;
    height: 52px;
    padding: 0 32px;
    border-radius: 12px;
    background: rgb(var(--v-theme-primary));
    color: #fff;
    border: none;
    cursor: pointer;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s;
}
.success-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(var(--v-theme-primary), 0.4); }
</style>
