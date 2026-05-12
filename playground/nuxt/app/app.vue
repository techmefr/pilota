<script setup lang="ts">
import { useTranslate, useTolgee } from '@tolgee/vue'

const { count } = useCart()
const { t } = useTranslate()
const tolgee = useTolgee(['language'])
const currentLang = computed(() => tolgee.value.getLanguage() ?? 'en')

function setLanguage(lang: string): void {
    tolgee.value.changeLanguage(lang)
}
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
                    {{ t('Catalog') }}
                </v-btn>

                <v-spacer />

                <v-btn-group density="compact" variant="tonal" color="surface-variant" class="mr-3 lang-switcher">
                    <v-btn
                        size="small"
                        :color="currentLang === 'en' ? 'primary' : undefined"
                        :variant="currentLang === 'en' ? 'flat' : 'text'"
                        @click="setLanguage('en')"
                    >
                        EN
                    </v-btn>
                    <v-btn
                        size="small"
                        :color="currentLang === 'fr' ? 'primary' : undefined"
                        :variant="currentLang === 'fr' ? 'flat' : 'text'"
                        @click="setLanguage('fr')"
                    >
                        FR
                    </v-btn>
                </v-btn-group>

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
                        {{ t('Pilota POC — sdk.[driver].[resource].[method]() unified over GraphQL, REST and WebSocket') }}
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

<style scoped>
.lang-switcher {
    border-radius: 8px;
    overflow: hidden;
}
</style>
