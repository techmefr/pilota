<script setup lang="ts">
import { useOrders } from '../../composables/useOrders'
import type { ShopOrder } from '../../../technical/sdk/resources'

const route = useRoute()
const orderId = Number(route.params.id)

const { fetchOrder } = useOrders()
const order = ref<ShopOrder | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
    order.value = await fetchOrder(orderId)
    if (!order.value) error.value = 'Commande introuvable.'
    isLoading.value = false
})

function formatPrice(n: number): string {
    return n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
}

function formatDate(d: string | null | undefined): string {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
}

function downloadPdf(): void {
    window.print()
}
</script>

<template>
    <div class="order-detail-page px-4 px-md-8" style="max-width: 700px; margin: 0 auto;">
        <!-- Nav -->
        <div class="pt-12 pb-8 no-print">
            <v-btn to="/orders" variant="text" prepend-icon="mdi-arrow-left" size="small" style="opacity: 0.45; font-size: 12px; font-weight: 600; letter-spacing: 0.06em;">
                Mes commandes
            </v-btn>
        </div>

        <div v-if="isLoading" class="d-flex justify-center py-20">
            <v-progress-circular indeterminate color="primary" size="36" />
        </div>

        <div v-else-if="error" class="d-flex flex-column align-center text-center py-20">
            <v-icon size="36" color="error" class="mb-3">mdi-alert-circle-outline</v-icon>
            <p style="opacity: 0.55;">{{ error }}</p>
        </div>

        <div v-else-if="order" class="invoice pb-20">
            <!-- Header -->
            <div class="invoice-header">
                <div>
                    <p class="invoice-brand">SHOPLAB</p>
                    <p class="invoice-tagline">Tech products, curated for professionals</p>
                </div>
                <div class="invoice-meta">
                    <p class="invoice-label">Facture</p>
                    <p class="invoice-number">#{{ order.id }}</p>
                    <p class="invoice-date">{{ formatDate(order.created_at) }}</p>
                </div>
            </div>

            <div class="invoice-divider" />

            <!-- Status + download -->
            <div class="invoice-actions no-print">
                <span class="status-badge" :class="`status-${order.status}`">
                    {{ order.status === 'paid' ? 'Payée' : order.status === 'cancelled' ? 'Annulée' : 'En attente' }}
                </span>
                <button class="btn-pdf" @click="downloadPdf">
                    <v-icon size="16" class="mr-2">mdi-download</v-icon>
                    Télécharger PDF
                </button>
            </div>

            <!-- Customer info -->
            <div class="invoice-grid">
                <div class="invoice-section">
                    <p class="section-label">Client</p>
                    <p class="section-value">{{ order.full_name }}</p>
                    <p class="section-detail">{{ order.email }}</p>
                    <p v-if="order.phone" class="section-detail">{{ order.phone }}</p>
                </div>
                <div class="invoice-section">
                    <p class="section-label">Adresse de livraison</p>
                    <p class="section-value">{{ order.address }}</p>
                    <p class="section-detail">{{ order.zip_code }} {{ order.city }}</p>
                </div>
            </div>

            <div v-if="order.notes" class="invoice-notes">
                <p class="section-label">Notes</p>
                <p style="font-size: 13px; opacity: 0.65; margin: 0;">{{ order.notes }}</p>
            </div>

            <!-- Items table -->
            <div class="items-table">
                <div class="items-head">
                    <span class="col-desc">Article</span>
                    <span class="col-qty">Qté</span>
                    <span class="col-unit">P.U.</span>
                    <span class="col-total">Total</span>
                </div>
                <div v-for="item in order.items" :key="item.id" class="items-row">
                    <span class="col-desc">{{ item.product_name }}</span>
                    <span class="col-qty">{{ item.quantity }}</span>
                    <span class="col-unit">{{ formatPrice(item.unit_price) }}</span>
                    <span class="col-total">{{ formatPrice(item.unit_price * item.quantity) }}</span>
                </div>
            </div>

            <!-- Totals -->
            <div class="invoice-totals">
                <div class="total-row">
                    <span>Sous-total HT</span>
                    <span>{{ formatPrice(order.total_amount / 1.2) }}</span>
                </div>
                <div class="total-row">
                    <span>TVA (20%)</span>
                    <span>{{ formatPrice(order.total_amount - order.total_amount / 1.2) }}</span>
                </div>
                <div class="total-row total-final">
                    <span>Total TTC</span>
                    <span>{{ formatPrice(order.total_amount) }}</span>
                </div>
            </div>

            <!-- Footer -->
            <div class="invoice-footer">
                <p>Shoplab — Pilota POC demo — Paiement sécurisé via Stripe</p>
                <p v-if="order.stripe_payment_intent_id" style="opacity: 0.35;">
                    Réf. paiement : {{ order.stripe_payment_intent_id }}
                </p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.order-detail-page { padding-bottom: 40px; }

/* ─── Invoice layout ─── */
.invoice { display: flex; flex-direction: column; gap: 28px; }

.invoice-header {
    display: flex; justify-content: space-between; align-items: flex-start; gap: 20px;
}
.invoice-brand { font-size: 18px; font-weight: 700; letter-spacing: 0.1em; margin: 0; }
.invoice-tagline { font-size: 11px; opacity: 0.35; margin: 0; margin-top: 3px; }
.invoice-meta { text-align: right; }
.invoice-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; opacity: 0.4; margin: 0; }
.invoice-number { font-size: 22px; font-weight: 900; letter-spacing: -0.02em; margin: 0; color: rgb(var(--v-theme-primary)); }
.invoice-date { font-size: 12px; opacity: 0.4; margin: 0; }

.invoice-divider { height: 1px; background: rgba(128,128,128,0.12); }

.invoice-actions { display: flex; align-items: center; justify-content: space-between; }

.status-badge {
    font-size: 11px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase;
    padding: 4px 10px; border-radius: 999px;
}
.status-paid { background: rgba(var(--v-theme-success), 0.12); color: rgb(var(--v-theme-success)); }
.status-pending { background: rgba(var(--v-theme-warning), 0.12); color: rgb(var(--v-theme-warning)); }
.status-cancelled { background: rgba(var(--v-theme-error), 0.12); color: rgb(var(--v-theme-error)); }

.btn-pdf {
    display: inline-flex; align-items: center;
    height: 36px; padding: 0 16px; border-radius: 10px;
    background: rgb(var(--v-theme-primary)); color: #fff;
    border: none; cursor: pointer; font-size: 13px; font-weight: 600;
    transition: all 0.2s;
}
.btn-pdf:hover { background: #006E52; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,128,96,0.3); }

.invoice-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
@media (max-width: 600px) { .invoice-grid { grid-template-columns: 1fr; } }

.invoice-section { display: flex; flex-direction: column; gap: 3px; }
.section-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; opacity: 0.4; margin: 0 0 4px; }
.section-value { font-size: 14px; font-weight: 600; margin: 0; }
.section-detail { font-size: 12px; opacity: 0.5; margin: 0; }

.invoice-notes { padding: 16px; background: rgba(128,128,128,0.05); border-radius: 10px; }

/* ─── Items table ─── */
.items-table { border-radius: 12px; overflow: hidden; border: 1px solid rgba(128,128,128,0.10); }

.items-head, .items-row {
    display: grid;
    grid-template-columns: 1fr 60px 90px 90px;
    gap: 12px; padding: 12px 16px;
    font-size: 13px;
}

.items-head {
    background: rgba(128,128,128,0.06);
    font-size: 11px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.05em; opacity: 0.5;
}

.items-row { border-top: 1px solid rgba(128,128,128,0.07); }
.items-row:hover { background: rgba(128,128,128,0.03); }

.col-qty, .col-unit, .col-total { text-align: right; }
.col-total { font-weight: 600; }

/* ─── Totals ─── */
.invoice-totals { display: flex; flex-direction: column; gap: 8px; align-items: flex-end; }

.total-row {
    display: flex; gap: 48px; justify-content: flex-end;
    font-size: 13px; opacity: 0.7;
    min-width: 260px;
}
.total-row > span:first-child { flex: 1; }
.total-row > span:last-child { font-weight: 600; text-align: right; }

.total-final {
    font-size: 16px; font-weight: 900; opacity: 1;
    padding-top: 10px; border-top: 2px solid rgba(128,128,128,0.15);
    color: rgb(var(--v-theme-primary));
}

/* ─── Footer ─── */
.invoice-footer {
    padding-top: 20px; border-top: 1px solid rgba(128,128,128,0.10);
    font-size: 11px; opacity: 0.35;
    display: flex; flex-direction: column; gap: 4px; align-items: center; text-align: center;
}

/* ─── Print styles ─── */
@media print {
    .no-print { display: none !important; }

    :global(.shoplab-nav),
    :global(.shoplab-footer),
    :global(.grain-overlay),
    :global(.notif-stack) { display: none !important; }

    :global(body) { background: #fff !important; color: #000 !important; }
    :global(.v-application) { background: #fff !important; }
    :global(.v-main) { padding: 0 !important; }

    .invoice-brand { color: #008060 !important; }
    .invoice-number { color: #008060 !important; }
    .total-final { color: #008060 !important; }

    .order-detail-page { max-width: 100% !important; padding: 0 !important; }
    .invoice { gap: 20px !important; }
    .items-head { background: #f5f5f5 !important; }
}
</style>
