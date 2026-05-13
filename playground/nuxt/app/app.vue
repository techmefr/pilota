<script setup lang="ts">
import { useTranslate, useTolgee } from '@tolgee/vue'
import { useTheme } from 'vuetify'

const { count } = useCart()
const { t } = useTranslate()
const tolgee = useTolgee(['language'])
const currentLang = computed(() => tolgee.value.getLanguage() ?? 'en')
const theme = useTheme()
const isDark = computed(() => theme.global.current.value.dark)

function toggleTheme(): void {
    const next = isDark.value ? 'light' : 'dark'
    theme.global.name.value = next
    localStorage.setItem('pilota-theme', next)
}

function setLanguage(lang: string): void {
    tolgee.value.changeLanguage(lang)
}

onMounted(() => {
    const saved = localStorage.getItem('pilota-theme')
    if (saved === 'light' || saved === 'dark') {
        theme.global.name.value = saved
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
        theme.global.name.value = 'light'
    }
})
</script>

<template>
    <v-app>
        <v-app-bar :elevation="0" class="pilota-nav" height="60">
            <v-container class="d-flex align-center h-100 px-4 px-md-8" style="max-width: 1400px; margin: 0 auto;">
                <NuxtLink to="/" class="text-decoration-none d-flex align-center gap-3">
                    <span class="nav-logo">PILOTA</span>
                    <span class="nav-sub">SHOP</span>
                </NuxtLink>

                <div class="d-none d-md-flex gap-1 ml-10">
                    <v-btn to="/" variant="text" size="small" class="nav-link">
                        {{ t('Catalog') }}
                    </v-btn>
                </div>

                <v-spacer />

                <div class="d-flex align-center gap-3">
                    <div class="lang-switcher">
                        <button class="lang-btn" :class="{ active: currentLang === 'en' }" @click="setLanguage('en')">EN</button>
                        <button class="lang-btn" :class="{ active: currentLang === 'fr' }" @click="setLanguage('fr')">FR</button>
                    </div>

                    <button class="icon-btn" :title="isDark ? 'Light mode' : 'Dark mode'" @click="toggleTheme">
                        <Transition name="spin" mode="out-in">
                            <v-icon v-if="isDark" key="sun" size="18">mdi-weather-sunny</v-icon>
                            <v-icon v-else key="moon" size="18">mdi-weather-night</v-icon>
                        </Transition>
                    </button>

                    <NuxtLink to="/cart" class="cart-btn" data-test-id="nav-cart">
                        <v-badge :content="count" :model-value="count > 0" color="primary" data-test-id="cart-badge" offset-x="2" offset-y="2">
                            <v-icon size="20">mdi-shopping-outline</v-icon>
                        </v-badge>
                    </NuxtLink>
                </div>
            </v-container>
        </v-app-bar>

        <v-main class="pilota-main">
            <NuxtPage :transition="{ name: 'page', mode: 'out-in' }" />
        </v-main>

        <footer class="pilota-footer">
            <v-container style="max-width: 1400px; margin: 0 auto;">
                <div class="d-flex align-center justify-space-between flex-wrap gap-4 py-10 px-4 px-md-8">
                    <div>
                        <p class="nav-logo mb-2" style="font-size: 22px; letter-spacing: 0.16em;">PILOTA</p>
                        <p class="footer-note">sdk.[driver].[resource].[method]() — GraphQL · REST · Realtime</p>
                    </div>
                    <div class="d-flex gap-2">
                        <v-chip size="x-small" variant="tonal" color="primary" label>GraphQL</v-chip>
                        <v-chip size="x-small" variant="tonal" color="secondary" label>REST</v-chip>
                        <v-chip size="x-small" variant="tonal" color="success" label>WebSocket</v-chip>
                    </div>
                </div>
            </v-container>
        </footer>

        <ChatWidget />
    </v-app>
</template>

<style>
* { box-sizing: border-box; }

.v-application {
    font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif !important;
}

/* Smooth theme transitions */
.v-application, .v-application * {
    transition-property: background-color, border-color, color, box-shadow;
    transition-duration: 0.3s;
    transition-timing-function: ease;
}

/* Page transitions */
.page-enter-active { animation: fadeUp 0.35s cubic-bezier(0.22, 1, 0.36, 1) both; }
.page-leave-active { animation: fadeOut 0.18s ease both; }

@keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeOut {
    from { opacity: 1; }
    to   { opacity: 0; }
}

/* Icon spin transition */
.spin-enter-active, .spin-leave-active { transition: all 0.22s ease; }
.spin-enter-from { opacity: 0; transform: rotate(-120deg) scale(0.4); }
.spin-leave-to   { opacity: 0; transform: rotate(120deg) scale(0.4); }
</style>

<style scoped>
.pilota-nav {
    background: rgba(var(--v-theme-background), 0.82) !important;
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border-bottom: 1px solid rgba(128, 128, 128, 0.1) !important;
}

.nav-logo {
    font-size: 15px;
    font-weight: 900;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgb(var(--v-theme-on-background));
    line-height: 1;
}

.nav-sub {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgb(var(--v-theme-primary));
    padding: 2px 6px;
    border-radius: 4px;
    border: 1px solid rgba(var(--v-theme-primary), 0.35);
}

.nav-link {
    font-size: 12px !important;
    font-weight: 600 !important;
    letter-spacing: 0.08em !important;
    text-transform: uppercase !important;
    opacity: 0.55;
    transition: opacity 0.2s !important;
}
.nav-link:hover { opacity: 1; }

.icon-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    border: 1px solid rgba(128, 128, 128, 0.2);
    background: transparent;
    cursor: pointer;
    color: rgb(var(--v-theme-on-background));
    transition: background 0.2s, border-color 0.2s;
}
.icon-btn:hover { background: rgba(128, 128, 128, 0.1); }

.cart-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    text-decoration: none;
    color: rgb(var(--v-theme-on-background));
    transition: opacity 0.2s;
}
.cart-btn:hover { opacity: 0.6; }

.lang-switcher {
    display: flex;
    border: 1px solid rgba(128, 128, 128, 0.2);
    border-radius: 8px;
    overflow: hidden;
}
.lang-btn {
    padding: 4px 9px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.04em;
    cursor: pointer;
    border: none;
    background: transparent;
    color: rgb(var(--v-theme-on-background));
    opacity: 0.45;
    transition: opacity 0.15s, background 0.15s;
}
.lang-btn.active {
    opacity: 1;
    background: rgba(var(--v-theme-primary), 0.18);
    color: rgb(var(--v-theme-primary));
}

.pilota-main {
    min-height: calc(100vh - 60px);
}

.pilota-footer {
    border-top: 1px solid rgba(128, 128, 128, 0.1);
}

.footer-note {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.04em;
    opacity: 0.35;
}
</style>
