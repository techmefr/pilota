<script setup lang="ts">
import { useResourceForm } from '@pilota/hooks'
import { orderResource } from '../resources/order.resource'

const { items, total, count } = useCart()
const isSuccess = ref(false)
const isSubmitting = ref(false)

const { values, errors, isDirty, handleSubmit, reset } = useResourceForm(orderResource)

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
    <v-container class="py-10" data-test-id="page-checkout" style="max-width: 1100px;">
        <v-btn
            to="/cart"
            variant="text"
            prepend-icon="mdi-arrow-left"
            size="small"
            class="mb-8 text-medium-emphasis"
        >
            Retour au panier
        </v-btn>

        <h1 class="text-h4 font-weight-bold mb-8">Finaliser la commande</h1>

        <v-row v-if="!isSuccess">
            <v-col cols="12" md="7">
                <v-card variant="outlined" class="pa-6 mb-4">
                    <p class="text-caption text-medium-emphasis font-mono mb-6">
                        useResourceForm(orderResource) — validation Zod, isDirty: {{ isDirty }}
                    </p>

                    <v-row>
                        <v-col cols="12">
                            <v-text-field
                                v-model="values.full_name"
                                :error-messages="errors.full_name"
                                label="Nom complet"
                                placeholder="Jean Dupont"
                                prepend-inner-icon="mdi-account-outline"
                            />
                        </v-col>

                        <v-col cols="12" sm="6">
                            <v-text-field
                                v-model="values.email"
                                :error-messages="errors.email"
                                label="Adresse email"
                                placeholder="jean@exemple.fr"
                                type="email"
                                prepend-inner-icon="mdi-email-outline"
                            />
                        </v-col>

                        <v-col cols="12" sm="6">
                            <v-text-field
                                v-model="values.phone"
                                :error-messages="errors.phone"
                                label="Téléphone (optionnel)"
                                placeholder="06 12 34 56 78"
                                prepend-inner-icon="mdi-phone-outline"
                            />
                        </v-col>

                        <v-col cols="12">
                            <v-divider class="my-2" />
                            <p class="text-caption text-medium-emphasis mt-4 mb-2">Adresse de livraison</p>
                        </v-col>

                        <v-col cols="12">
                            <v-text-field
                                v-model="values.address"
                                :error-messages="errors.address"
                                label="Adresse"
                                placeholder="12 rue de la Paix"
                                prepend-inner-icon="mdi-map-marker-outline"
                            />
                        </v-col>

                        <v-col cols="12" sm="8">
                            <v-text-field
                                v-model="values.city"
                                :error-messages="errors.city"
                                label="Ville"
                                placeholder="Paris"
                                prepend-inner-icon="mdi-city-variant-outline"
                            />
                        </v-col>

                        <v-col cols="12" sm="4">
                            <v-text-field
                                v-model="values.zip_code"
                                :error-messages="errors.zip_code"
                                label="Code postal"
                                placeholder="75001"
                                prepend-inner-icon="mdi-post-outline"
                                maxlength="5"
                            />
                        </v-col>

                        <v-col cols="12">
                            <v-textarea
                                v-model="values.notes"
                                :error-messages="errors.notes"
                                label="Notes (optionnel)"
                                placeholder="Instructions de livraison…"
                                rows="2"
                                variant="outlined"
                                rounded="lg"
                            />
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>

            <v-col cols="12" md="5">
                <v-card variant="outlined" class="pa-6" data-test-id="checkout-summary">
                    <h2 class="text-body-1 font-weight-medium mb-4">Récapitulatif</h2>

                    <div v-if="count === 0" class="text-center py-6">
                        <p class="text-medium-emphasis text-body-2">Panier vide</p>
                        <v-btn to="/" variant="text" color="primary" size="small" class="mt-2">
                            Voir le catalogue
                        </v-btn>
                    </div>

                    <template v-else>
                        <div
                            v-for="item in items"
                            :key="item.product_id"
                            class="d-flex justify-space-between text-body-2 mb-2"
                        >
                            <span class="text-medium-emphasis">
                                {{ item.product_name }} × {{ item.quantity }}
                            </span>
                            <span class="font-weight-medium">
                                {{ formatPrice(item.unit_price * item.quantity) }}
                            </span>
                        </div>

                        <v-divider class="my-4" />

                        <div class="d-flex justify-space-between text-body-1 font-weight-bold mb-6">
                            <span>Total</span>
                            <span data-test-id="checkout-total" class="text-primary">
                                {{ formatPrice(total) }}
                            </span>
                        </div>

                        <v-btn
                            data-test-id="btn-place-order"
                            color="primary"
                            size="large"
                            block
                            :loading="isSubmitting"
                            prepend-icon="mdi-lock-outline"
                            @click="submit"
                        >
                            Confirmer la commande
                        </v-btn>

                        <p class="text-caption text-medium-emphasis text-center mt-3">
                            <v-icon size="12" class="mr-1">mdi-shield-check-outline</v-icon>
                            Paiement sécurisé
                        </p>
                    </template>
                </v-card>
            </v-col>
        </v-row>

        <div v-else class="text-center py-16" data-test-id="checkout-success">
            <div class="success-icon mb-6">
                <v-icon size="80" color="success">mdi-check-circle-outline</v-icon>
            </div>
            <h2 class="text-h4 font-weight-bold mb-4">Commande confirmée !</h2>
            <p class="text-body-1 text-medium-emphasis mb-8">
                Merci pour votre commande. Vous recevrez une confirmation par email.
            </p>
            <v-btn to="/" color="primary" size="large" prepend-icon="mdi-store-outline">
                Retour au catalogue
            </v-btn>
        </div>
    </v-container>
</template>

<style scoped>
.font-mono {
    font-family: 'Fira Code', 'Consolas', monospace;
}
</style>
