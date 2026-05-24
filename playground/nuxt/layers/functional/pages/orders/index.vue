<script setup lang="ts">
import { useOrders } from '../../composables/useOrders'

const { orders, isLoading, error, fetchOrders } = useOrders()

onMounted(fetchOrders)

function formatPrice(n: number): string {
    return n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
}

function formatDate(d: string | null | undefined): string {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}
</script>

<template>
    <div class="orders-page px-4 px-md-8" style="max-width: 900px; margin: 0 auto;">
        <div class="page-head pt-12 pb-10">
            <h1 class="page-title">Mes commandes</h1>
            <p class="page-sub">Historique de vos achats</p>
        </div>

        <div v-if="isLoading" class="d-flex justify-center py-20">
            <v-progress-circular indeterminate color="primary" size="36" />
        </div>

        <div v-else-if="error" class="error-state">
            <v-icon size="36" color="error" class="mb-3">mdi-alert-circle-outline</v-icon>
            <p>{{ error }}</p>
            <v-btn variant="tonal" color="primary" size="small" class="mt-4" @click="fetchOrders">Réessayer</v-btn>
        </div>

        <div v-else-if="orders.length === 0" class="empty-state">
            <v-icon size="48" class="mb-4" style="opacity: 0.2;">mdi-package-variant-closed</v-icon>
            <p style="opacity: 0.4; font-size: 15px;">Aucune commande pour le moment</p>
            <v-btn to="/" variant="tonal" color="primary" size="small" class="mt-6">Découvrir le catalogue</v-btn>
        </div>

        <div v-else class="orders-list pb-20">
            <NuxtLink
                v-for="order in orders"
                :key="order.id"
                :to="`/orders/${order.id}`"
                class="order-row text-decoration-none"
            >
                <div class="order-row-left">
                    <p class="order-row-ref">#{{ order.id }}</p>
                    <p class="order-row-date">{{ formatDate(order.created_at) }}</p>
                </div>
                <div class="order-row-center">
                    <p class="order-row-name">{{ order.full_name }}</p>
                    <p class="order-row-email">{{ order.email }}</p>
                </div>
                <div class="order-row-right">
                    <span class="order-amount">{{ formatPrice(order.total_amount) }}</span>
                    <span class="status-badge" :class="`status-${order.status}`">
                        {{ order.status === 'paid' ? 'Payée' : order.status === 'cancelled' ? 'Annulée' : 'En attente' }}
                    </span>
                </div>
                <v-icon size="16" style="opacity: 0.25; flex-shrink: 0;">mdi-chevron-right</v-icon>
            </NuxtLink>
        </div>
    </div>
</template>

<style scoped>
.page-head { display: flex; flex-direction: column; gap: 6px; }
.page-title { font-size: clamp(28px, 4vw, 40px); font-weight: 330; letter-spacing: -0.01em; margin: 0; }
.page-sub { font-size: 14px; opacity: 0.4; margin: 0; }

.error-state, .empty-state {
    display: flex; flex-direction: column; align-items: center;
    text-align: center; padding: 60px 0;
}

.orders-list { display: flex; flex-direction: column; gap: 8px; }

.order-row {
    display: flex; align-items: center; gap: 20px;
    padding: 18px 20px; border-radius: 16px;
    background: rgb(var(--v-theme-surface));
    border: 1px solid rgba(128,128,128,0.08);
    transition: border-color 0.2s, transform 0.15s;
    cursor: pointer;
}
.order-row:hover { border-color: rgba(var(--v-theme-primary), 0.4); transform: translateX(2px); }

.order-row-left { min-width: 80px; }
.order-row-ref { font-size: 13px; font-weight: 700; margin: 0; color: rgb(var(--v-theme-primary)); }
.order-row-date { font-size: 11px; opacity: 0.4; margin: 0; margin-top: 3px; }

.order-row-center { flex: 1; min-width: 0; }
.order-row-name { font-size: 14px; font-weight: 500; margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.order-row-email { font-size: 12px; opacity: 0.4; margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.order-row-right { display: flex; flex-direction: column; align-items: flex-end; gap: 5px; flex-shrink: 0; }
.order-amount { font-size: 15px; font-weight: 700; }

.status-badge {
    font-size: 10px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase;
    padding: 3px 8px; border-radius: 999px;
}
.status-paid { background: rgba(var(--v-theme-success), 0.12); color: rgb(var(--v-theme-success)); }
.status-pending { background: rgba(var(--v-theme-warning), 0.12); color: rgb(var(--v-theme-warning)); }
.status-cancelled { background: rgba(var(--v-theme-error), 0.12); color: rgb(var(--v-theme-error)); }
</style>
