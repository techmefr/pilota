<script setup lang="ts">
import { useCart } from './composables/useCart'

const { count } = useCart()
</script>

<template>
    <v-app>
        <v-app-bar color="surface" elevation="0" border="b">
            <NuxtLink to="/" class="text-decoration-none ml-4 d-flex align-center gap-1">
                <v-icon color="primary" size="24">mdi-store-outline</v-icon>
                <span class="text-h6 font-weight-bold text-primary">Pilota</span>
                <span class="text-h6 font-weight-light">Shop</span>
            </NuxtLink>

            <v-spacer />

            <v-btn
                data-test-id="nav-cart"
                :to="'/cart'"
                icon
                variant="text"
                class="mr-2"
            >
                <v-badge
                    data-test-id="cart-badge"
                    :content="count"
                    :model-value="count > 0"
                    color="error"
                >
                    <v-icon>mdi-cart-outline</v-icon>
                </v-badge>
            </v-btn>
        </v-app-bar>

        <v-main>
            <NuxtPage />
        </v-main>

        <ChatWidget />
    </v-app>
</template>
