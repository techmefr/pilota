<script setup lang="ts">
const { count } = useCart()
</script>

<template>
    <v-app>
        <v-app-bar color="surface" elevation="0" border="b" height="64">
            <v-container class="d-flex align-center py-0 px-4">
                <NuxtLink to="/" class="text-decoration-none d-flex align-center gap-2 mr-6">
                    <v-icon color="primary" size="26">mdi-store-outline</v-icon>
                    <span class="text-subtitle-1 font-weight-black text-on-surface">Pilota</span>
                    <span class="text-subtitle-1 font-weight-light text-medium-emphasis">Shop</span>
                </NuxtLink>

                <v-btn to="/" variant="text" size="small" class="text-medium-emphasis">
                    Catalogue
                </v-btn>

                <v-spacer />

                <v-btn
                    data-test-id="nav-cart"
                    to="/cart"
                    icon
                    variant="text"
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
            </v-container>
        </v-app-bar>

        <v-main>
            <NuxtPage />
        </v-main>

        <v-footer color="surface" border="t" class="py-6">
            <v-container>
                <div class="d-flex align-center justify-space-between flex-wrap gap-3">
                    <p class="text-caption text-medium-emphasis">
                        <span class="font-weight-medium text-on-surface">Pilota POC</span> —
                        sdk.[driver].[resource].[method]() unifié sur GraphQL, REST et WebSocket
                    </p>
                    <div class="d-flex gap-2">
                        <v-chip size="x-small" variant="tonal" color="primary" label>GraphQL</v-chip>
                        <v-chip size="x-small" variant="tonal" color="secondary" label>REST</v-chip>
                        <v-chip size="x-small" variant="tonal" color="success" label>Realtime</v-chip>
                    </div>
                </div>
            </v-container>
        </v-footer>

        <ChatWidget />
    </v-app>
</template>
