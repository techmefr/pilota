<script setup lang="ts">
import { useTranslate, useTolgee } from '@tolgee/vue'
import { useTheme } from 'vuetify'
import { useCart } from './composables/useCart'
import { useNotify } from './composables/useNotify'

const { count } = useCart()
const { t } = useTranslate()
const { queue, dismiss } = useNotify()
const tolgee = useTolgee(['language'])
const currentLang = computed(() => tolgee.value.getLanguage() ?? 'en')
const theme = useTheme()
const isDark = computed(() => theme.global.current.value.dark)

const FONT_SIZES = [
    { label: 'A−', value: 15 },
    { label: 'A',  value: 17 },
    { label: 'A+', value: 19 },
    { label: 'A++', value: 21 },
]
const fontSize = ref(17)

function toggleTheme(): void {
    const next = isDark.value ? 'light' : 'dark'
    theme.global.name.value = next
    localStorage.setItem('shoplab-theme', next)
}

function setLanguage(lang: string): void {
    tolgee.value.changeLanguage(lang)
}

function applyFontSize(size: number): void {
    fontSize.value = size
    localStorage.setItem('shoplab-font-size', String(size))
    document.documentElement.style.fontSize = `${size}px`
}

onMounted(() => {
    const saved = localStorage.getItem('shoplab-theme')
    if (saved === 'light' || saved === 'dark') {
        theme.global.name.value = saved
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
        theme.global.name.value = 'light'
    }

    const savedSize = parseInt(localStorage.getItem('shoplab-font-size') ?? '')
    if ([15, 17, 19, 21].includes(savedSize)) {
        fontSize.value = savedSize
        document.documentElement.style.fontSize = `${savedSize}px`
    }
})
</script>

<template>
    <v-app>
        <div class="grain-overlay" aria-hidden="true" />
        <v-app-bar :elevation="0" class="shoplab-nav" height="60">
            <v-container class="d-flex align-center h-100 px-4 px-md-8" style="max-width: 1400px; margin: 0 auto;">
                <NuxtLink to="/" class="text-decoration-none d-flex align-center gap-3">
                    <span class="nav-logo">SHOPLAB</span>
                    <span class="nav-sub">SHOP</span>
                </NuxtLink>

                <div class="d-none d-md-flex gap-1 ml-10">
                    <v-btn to="/" variant="text" size="small" class="nav-link">
                        {{ t('Catalog') }}
                    </v-btn>
                </div>

                <v-spacer />

                <div class="d-flex align-center gap-3">
                    <div class="fontsize-switcher">
                        <button
                            v-for="opt in FONT_SIZES"
                            :key="opt.value"
                            class="fontsize-btn"
                            :class="{ active: fontSize === opt.value }"
                            :title="`${opt.value}px`"
                            @click="applyFontSize(opt.value)"
                        >{{ opt.label }}</button>
                    </div>

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

        <v-main class="shoplab-main">
            <NuxtPage :transition="{ name: 'page', mode: 'out-in' }" />
        </v-main>

        <footer class="shoplab-footer">
            <v-container style="max-width: 1400px; margin: 0 auto;">
                <div class="d-flex align-center justify-space-between flex-wrap gap-4 py-10 px-4 px-md-8">
                    <div>
                        <p class="nav-logo mb-2" style="font-size: 22px; letter-spacing: 0.16em;">SHOPLAB</p>
                        <p class="footer-note">Tech products, curated for professionals</p>
                    </div>
                    <div class="d-flex gap-2">
                        <v-chip size="x-small" variant="tonal" color="primary" label>Informatique</v-chip>
                        <v-chip size="x-small" variant="tonal" color="secondary" label>Audio</v-chip>
                        <v-chip size="x-small" variant="tonal" color="success" label>Smartphones</v-chip>
                    </div>
                </div>
            </v-container>
        </footer>

        <ChatWidget />

        <!-- Notification stack -->
        <div class="notif-stack" aria-live="polite">
            <TransitionGroup name="notif">
                <div
                    v-for="n in queue"
                    :key="n.id"
                    class="notif"
                    :class="`notif-${n.type}`"
                    @click="dismiss(n.id)"
                >
                    <v-icon size="16" class="notif-icon">
                        {{ n.type === 'success' ? 'mdi-check-circle' : n.type === 'error' ? 'mdi-alert-circle' : 'mdi-information' }}
                    </v-icon>
                    <span class="notif-msg">{{ n.message }}</span>
                </div>
            </TransitionGroup>
        </div>
    </v-app>
</template>

<style>
* { box-sizing: border-box; }

.v-application {
    font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif !important;
}

h1, h2, h3, h4, h5, h6 {
    font-family: 'Inter', system-ui, sans-serif;
    font-weight: 330;
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
.shoplab-nav {
    background: #02090A !important;
    border-bottom: 1px solid #142024 !important;
}

.nav-logo {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #FFFFFF;
    line-height: 1;
}

.nav-sub {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #36F4A4;
    padding: 2px 6px;
    border-radius: 4px;
    border: 1px solid rgba(54, 244, 164, 0.35);
}

.nav-link {
    font-size: 14px !important;
    font-weight: 450 !important;
    letter-spacing: 0em !important;
    color: rgba(255, 255, 255, 0.75) !important;
    transition: color 0.2s !important;
}
.nav-link:hover { color: #FFFFFF !important; }

.icon-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.15);
    background: transparent;
    cursor: pointer;
    color: rgba(255, 255, 255, 0.8);
    transition: background 0.2s, border-color 0.2s, color 0.2s;
}
.icon-btn:hover { background: rgba(255, 255, 255, 0.08); color: #FFFFFF; }

.cart-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    text-decoration: none;
    color: rgba(255, 255, 255, 0.8);
    transition: color 0.2s;
}
.cart-btn:hover { color: #FFFFFF; }

.fontsize-switcher {
    display: flex;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 6px;
    overflow: hidden;
}
.fontsize-btn {
    padding: 4px 8px;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    background: transparent;
    color: rgba(255, 255, 255, 0.45);
    transition: color 0.15s, background 0.15s;
}
.fontsize-btn.active {
    background: rgba(54, 244, 164, 0.15);
    color: #36F4A4;
}

.lang-switcher {
    display: flex;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 6px;
    overflow: hidden;
}
.lang-btn {
    padding: 4px 9px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.04em;
    cursor: pointer;
    border: none;
    background: transparent;
    color: rgba(255, 255, 255, 0.45);
    transition: color 0.15s, background 0.15s;
}
.lang-btn.active {
    background: rgba(54, 244, 164, 0.15);
    color: #36F4A4;
}

.shoplab-main {
    min-height: calc(100vh - 60px);
}

.shoplab-footer {
    border-top: 1px solid rgba(128, 128, 128, 0.1);
}

.shoplab-footer {
    background: #02090A;
}

.footer-note {
    font-size: 12px;
    font-weight: 400;
    opacity: 0.45;
}

/* ─── Notification stack ─── */
.notif-stack {
    position: fixed;
    bottom: 88px;
    left: 24px;
    z-index: 2000;
    display: flex;
    flex-direction: column-reverse;
    gap: 8px;
    pointer-events: none;
}

.notif {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 11px 16px;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 600;
    pointer-events: all;
    cursor: pointer;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.18);
    max-width: 320px;
}

.notif-success {
    background: rgba(var(--v-theme-success), 0.15);
    border: 1px solid rgba(var(--v-theme-success), 0.3);
    color: rgb(var(--v-theme-success));
}

.notif-error {
    background: rgba(var(--v-theme-error), 0.15);
    border: 1px solid rgba(var(--v-theme-error), 0.3);
    color: rgb(var(--v-theme-error));
}

.notif-info {
    background: rgba(var(--v-theme-primary), 0.12);
    border: 1px solid rgba(var(--v-theme-primary), 0.25);
    color: rgb(var(--v-theme-primary));
}

.notif-icon { flex-shrink: 0; }
.notif-msg { line-height: 1.3; }

.notif-enter-active { animation: notifIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
.notif-leave-active { animation: notifOut 0.2s ease both; }
@keyframes notifIn  { from { opacity: 0; transform: translateX(-16px) scale(0.95); } }
@keyframes notifOut { to   { opacity: 0; transform: translateX(-8px) scale(0.97); } }
</style>
