<script setup lang="ts">
import { apiBase } from '../../../technical/sdk/index'
import type { ShopOrder } from '../../../technical/sdk/resources'
import { useCart } from '../../composables/useCart'

const route = useRoute()
const orderId = Number(route.params.id)
const sessionId = route.query.session_id as string | undefined
const isSimulated = route.query.simulated === '1'

const order = ref<ShopOrder | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)

const { clearCart } = useCart()

onMounted(async () => {
    try {
        if (sessionId) {
            order.value = await $fetch<ShopOrder>(`${apiBase()}/api/stripe/confirm/${sessionId}`)
        } else {
            order.value = await $fetch<ShopOrder>(`${apiBase()}/api/stripe/order/${orderId}`)
        }
        await clearCart()
    } catch {
        error.value = 'Impossible de récupérer les détails de la commande.'
    } finally {
        isLoading.value = false
    }
})

function formatPrice(n: number): string {
    return n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
}

function formatDate(d: string | null | undefined): string {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
}
</script>

<template>
    <div class="success-page px-4 px-md-8" style="max-width: 700px; margin: 0 auto;">
        <!-- Loading -->
        <div v-if="isLoading" class="d-flex justify-center align-center" style="min-height: 60vh;">
            <v-progress-circular indeterminate color="primary" size="40" />
        </div>

        <!-- Error -->
        <div v-else-if="error" class="d-flex flex-column align-center text-center" style="min-height: 60vh; justify-content: center;">
            <v-icon size="48" color="error" class="mb-4">mdi-alert-circle-outline</v-icon>
            <p style="opacity: 0.55;">{{ error }}</p>
            <v-btn to="/orders" variant="tonal" color="primary" class="mt-6">Mes commandes</v-btn>
        </div>

        <!-- Success -->
        <div v-else-if="order" class="success-content">
            <div class="success-header">
                <div class="success-ring">
                    <v-icon size="52" color="success">mdi-check</v-icon>
                </div>
                <h1 class="success-title">Commande confirmée !</h1>
                <p class="success-sub">
                    Merci {{ order.full_name }}, votre commande <strong>#{{ order.id }}</strong> a bien été enregistrée.
                </p>
                <div v-if="isSimulated" class="dev-badge">
                    <v-icon size="13" class="mr-1">mdi-code-tags</v-icon>
                    Mode dev — paiement simulé
                </div>
            </div>

            <!-- Order card -->
            <div class="order-card">
                <div class="order-card-header">
                    <div>
                        <p class="order-ref">Commande #{{ order.id }}</p>
                        <p class="order-date">{{ formatDate(order.created_at) }}</p>
                    </div>
                    <span class="status-badge" :class="`status-${order.status}`">
                        {{ order.status === 'paid' ? 'Payée' : order.status === 'cancelled' ? 'Annulée' : 'En attente' }}
                    </span>
                </div>

                <div class="order-items">
                    <div v-for="item in order.items" :key="item.id" class="order-item">
                        <span class="item-name">{{ item.product_name }}</span>
                        <span class="item-qty">× {{ item.quantity }}</span>
                        <span class="item-price">{{ formatPrice(item.unit_price * item.quantity) }}</span>
                    </div>
                </div>

                <div class="order-total">
                    <span>Total</span>
                    <span class="total-value">{{ formatPrice(order.total_amount) }}</span>
                </div>

                <div class="order-address">
                    <p class="address-label">Livraison</p>
                    <p>{{ order.address }}, {{ order.zip_code }} {{ order.city }}</p>
                </div>
            </div>

            <!-- Actions -->
            <div class="success-actions">
                <NuxtLink :to="`/orders/${order.id}`" class="text-decoration-none">
                    <button class="btn-secondary">
                        <v-icon size="16" class="mr-2">mdi-file-document-outline</v-icon>
                        Voir la facture PDF
                    </button>
                </NuxtLink>
                <NuxtLink to="/orders" class="text-decoration-none">
                    <button class="btn-ghost">
                        <v-icon size="16" class="mr-2">mdi-list-box-outline</v-icon>
                        Mes commandes
                    </button>
                </NuxtLink>
                <NuxtLink to="/" class="text-decoration-none">
                    <button class="btn-ghost">
                        <v-icon size="16" class="mr-2">mdi-store-outline</v-icon>
                        Retour au catalogue
                    </button>
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<style scoped>
.success-page { padding-top: 60px; padding-bottom: 80px; }

.success-content { display: flex; flex-direction: column; gap: 32px; }

.success-header { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 16px; }

.success-ring {
    width: 96px; height: 96px; border-radius: 50%;
    background: rgba(var(--v-theme-success), 0.10);
    border: 2px solid rgba(var(--v-theme-success), 0.25);
    display: flex; align-items: center; justify-content: center;
}

.success-title { font-size: 32px; font-weight: 900; letter-spacing: -0.03em; margin: 0; }
.success-sub { font-size: 15px; opacity: 0.55; line-height: 1.6; max-width: 400px; margin: 0; }

.dev-badge {
    display: inline-flex; align-items: center;
    font-size: 11px; font-weight: 600;
    padding: 4px 10px; border-radius: 6px;
    background: rgba(var(--v-theme-warning), 0.12);
    border: 1px solid rgba(var(--v-theme-warning), 0.3);
    color: rgb(var(--v-theme-warning));
}

.order-card {
    background: rgb(var(--v-theme-surface));
    border-radius: 20px; border: 1px solid rgba(128,128,128,0.10);
    padding: 28px; display: flex; flex-direction: column; gap: 20px;
}

.order-card-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
.order-ref { font-size: 15px; font-weight: 700; margin: 0; }
.order-date { font-size: 12px; opacity: 0.4; margin: 0; margin-top: 2px; }

.status-badge {
    font-size: 11px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase;
    padding: 4px 10px; border-radius: 999px;
}
.status-paid { background: rgba(var(--v-theme-success), 0.12); color: rgb(var(--v-theme-success)); }
.status-pending { background: rgba(var(--v-theme-warning), 0.12); color: rgb(var(--v-theme-warning)); }
.status-cancelled { background: rgba(var(--v-theme-error), 0.12); color: rgb(var(--v-theme-error)); }

.order-items { display: flex; flex-direction: column; gap: 10px; }

.order-item {
    display: flex; align-items: baseline; gap: 8px;
    font-size: 14px;
}
.item-name { flex: 1; }
.item-qty { opacity: 0.4; font-size: 12px; }
.item-price { font-weight: 600; flex-shrink: 0; }

.order-total {
    display: flex; justify-content: space-between; align-items: baseline;
    padding-top: 16px; border-top: 1px solid rgba(128,128,128,0.10);
    font-size: 15px; font-weight: 700;
}
.total-value { font-size: 22px; font-weight: 900; letter-spacing: -0.02em; color: rgb(var(--v-theme-primary)); }

.order-address { padding-top: 16px; border-top: 1px solid rgba(128,128,128,0.10); font-size: 13px; }
.address-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; opacity: 0.4; margin-bottom: 4px; }

.success-actions { display: flex; flex-direction: column; gap: 10px; }

.btn-secondary {
    display: flex; align-items: center; justify-content: center;
    width: 100%; height: 48px; border-radius: 12px;
    background: rgb(var(--v-theme-primary)); color: #fff;
    border: 2px solid rgb(var(--v-theme-primary));
    cursor: pointer; font-size: 15px; font-weight: 600;
    transition: all 0.2s ease;
}
.btn-secondary:hover { background: #006E52; border-color: #006E52; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(0,128,96,0.3); }

.btn-ghost {
    display: flex; align-items: center; justify-content: center;
    width: 100%; height: 44px; border-radius: 12px;
    background: transparent; color: inherit;
    border: 1px solid rgba(128,128,128,0.20);
    cursor: pointer; font-size: 14px; font-weight: 500;
    transition: all 0.2s ease; opacity: 0.65;
}
.btn-ghost:hover { opacity: 1; border-color: rgba(128,128,128,0.4); }
</style>
