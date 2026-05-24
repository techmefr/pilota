import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core'
import { interval, Subscription } from 'rxjs'
import { map } from 'rxjs/operators'
import { SdkService } from '../../technical/Sdk/sdk.service'
import { I18nService } from '../../technical/I18n/i18n.service'
import { TranslatePipe } from '../../technical/I18n/translate.pipe'
import { mockAlerts } from '../../technical/Sdk/mock'
import type { Assignment, Repair, Order, Alert } from '../../technical/Sdk/resources'

interface FeedEvent {
    device: string
    description: string
    serial: string
    timestamp: string
}

@Component({
    selector: 'fc-fleet',
    standalone: true,
    imports: [TranslatePipe],
    styles: [`
        .dashboard { padding: 2rem; overflow-y: auto; height: 100%; }

        .page-header { margin-bottom: 1.75rem; }
        .page-title {
            font-size: 1.35rem; font-weight: 800;
            color: var(--text); letter-spacing: -0.02em; margin-bottom: 0.25rem;
        }
        .page-sub { font-size: 0.8rem; color: var(--text-2); }

        .kpi-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 1rem;
            margin-bottom: 2rem;
        }
        .kpi-card {
            background: var(--card); border: 1px solid var(--border);
            border-radius: 10px; padding: 1.25rem;
            display: flex; flex-direction: column; gap: 0.35rem;
            transition: border-color 0.15s, box-shadow 0.15s;
        }
        .kpi-card:hover {
            border-color: var(--border-hi);
            box-shadow: 0 4px 16px var(--shadow);
        }
        .kpi-label {
            font-size: 0.62rem; font-weight: 700;
            letter-spacing: 0.06em; text-transform: uppercase; color: var(--text-3);
        }
        .kpi-value {
            font-size: 2rem; font-weight: 900;
            letter-spacing: -0.03em; line-height: 1;
        }
        .kpi-value.blue  { color: var(--accent); }
        .kpi-value.green { color: var(--accent-2); }
        .kpi-value.amber { color: var(--warn); }
        .kpi-value.red   { color: var(--danger); }
        .kpi-sub { font-size: 0.72rem; color: var(--text-2); }

        .dash-grid {
            display: grid;
            grid-template-columns: 1fr 340px;
            gap: 1.25rem;
            align-items: start;
        }

        .section-card {
            background: var(--card); border: 1px solid var(--border); border-radius: 10px; overflow: hidden;
        }
        .section-card-header {
            display: flex; align-items: center; justify-content: space-between;
            padding: 0.875rem 1.25rem; border-bottom: 1px solid var(--border);
        }
        .section-card-title {
            font-size: 0.68rem; font-weight: 700;
            letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-2);
        }
        .section-card-count {
            font-size: 0.62rem; color: var(--text-3);
            background: var(--surface); border: 1px solid var(--border);
            padding: 0.15rem 0.5rem; border-radius: 999px;
        }
        .section-card-body {
            padding: 0.5rem 1.25rem;
            max-height: 360px;
            overflow-y: auto;
        }

        .event-item {
            padding: 0.65rem 0; border-bottom: 1px solid var(--border);
            display: flex; flex-direction: column; gap: 0.2rem;
        }
        .event-item:last-child { border-bottom: none; }
        .event-device { font-size: 0.82rem; font-weight: 600; color: var(--text); }
        .event-desc { font-size: 0.76rem; color: var(--text-2); }
        .event-meta {
            font-size: 0.63rem; color: var(--text-3);
            font-family: ui-monospace, 'Cascadia Code', monospace;
        }

        .alert-item {
            display: flex; align-items: flex-start; gap: 0.75rem;
            padding: 0.65rem 0; border-bottom: 1px solid var(--border);
        }
        .alert-item:last-child { border-bottom: none; }
        .alert-dot {
            width: 7px; height: 7px; border-radius: 50%;
            flex-shrink: 0; margin-top: 0.35rem;
        }
        .dot-critical { background: var(--danger); }
        .dot-warning  { background: var(--warn); }
        .dot-info     { background: var(--accent); }
        .alert-device { font-size: 0.8rem; font-weight: 600; color: var(--text); }
        .alert-desc { font-size: 0.73rem; color: var(--text-2); margin-top: 0.1rem; }
        .alert-emp { font-size: 0.65rem; color: var(--text-3); margin-top: 0.1rem; }

        .live-dot {
            display: inline-block;
            width: 6px; height: 6px; border-radius: 50%;
            background: var(--accent-2);
            animation: pulse-green 2.4s ease-out infinite;
        }
        @keyframes pulse-green {
            0%   { box-shadow: 0 0 0 0   oklch(70% 0.14 155 / 0.7); }
            70%  { box-shadow: 0 0 0 5px oklch(70% 0.14 155 / 0); }
            100% { box-shadow: 0 0 0 0   oklch(70% 0.14 155 / 0); }
        }
        .header-row {
            display: flex; align-items: center; gap: 0.5rem;
        }
    `],
    template: `
        <div class="dashboard">
            <div class="page-header">
                <h1 class="page-title">{{ 'kpi_total' | translate }}</h1>
                <p class="page-sub">Fleet Commander · Pilota SDK Angular 19</p>
            </div>

            <div class="kpi-grid">
                <div class="kpi-card">
                    <span class="kpi-label">{{ 'kpi_total' | translate }}</span>
                    <span class="kpi-value blue">{{ assignments().length }}</span>
                    <span class="kpi-sub">appareils assignés</span>
                </div>
                <div class="kpi-card">
                    <span class="kpi-label">{{ 'kpi_repairs' | translate }}</span>
                    <span class="kpi-value amber">{{ openRepairsCount() }}</span>
                    <span class="kpi-sub">{{ 'kpi_repairs_sub' | translate }}</span>
                </div>
                <div class="kpi-card">
                    <span class="kpi-label">{{ 'kpi_orders' | translate }}</span>
                    <span class="kpi-value blue">{{ inFlightOrdersCount() }}</span>
                    <span class="kpi-sub">{{ 'kpi_orders_sub' | translate }}</span>
                </div>
                <div class="kpi-card">
                    <span class="kpi-label">{{ 'kpi_alerts' | translate }}</span>
                    <span class="kpi-value red">{{ criticalAlertsCount() }}</span>
                    <span class="kpi-sub">{{ 'kpi_alerts_sub' | translate }}</span>
                </div>
            </div>

            <div class="dash-grid">
                <div class="section-card">
                    <div class="section-card-header">
                        <div class="header-row">
                            <span class="live-dot"></span>
                            <span class="section-card-title">{{ 'realtime_feed' | translate }}</span>
                        </div>
                        <span class="section-card-count">Supabase Realtime</span>
                    </div>
                    <div class="section-card-body">
                        @for (event of feedEvents(); track event.serial + event.timestamp) {
                            <div class="event-item">
                                <span class="event-device">{{ event.device }}</span>
                                <span class="event-desc">{{ event.description }}</span>
                                <span class="event-meta">{{ event.serial }} · {{ event.timestamp }}</span>
                            </div>
                        } @empty {
                            <div class="event-item">
                                <span class="event-desc">{{ 'no_events' | translate }}</span>
                            </div>
                        }
                    </div>
                </div>

                <div class="section-card">
                    <div class="section-card-header">
                        <span class="section-card-title">{{ 'critical_alerts' | translate }}</span>
                        <span class="section-card-count">{{ topCriticalAlerts().length }}</span>
                    </div>
                    <div class="section-card-body">
                        @for (alert of topCriticalAlerts(); track alert.id) {
                            <div class="alert-item">
                                <span class="alert-dot" [class]="'dot-' + alert.severity"></span>
                                <div>
                                    <div class="alert-device">{{ alert.device }}</div>
                                    <div class="alert-desc">{{ alert.description }}</div>
                                    <div class="alert-emp">{{ alert.employee }}</div>
                                </div>
                            </div>
                        } @empty {
                            <div class="alert-item">
                                <span class="alert-desc">Aucune alerte critique</span>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    `,
})
export class FleetComponent implements OnInit, OnDestroy {
    private readonly sdk = inject(SdkService)
    private readonly i18n = inject(I18nService)

    readonly assignments = signal<Assignment[]>([])
    readonly repairs = signal<Repair[]>([])
    readonly orders = signal<Order[]>([])
    readonly alerts = signal<Alert[]>([])
    readonly feedEvents = signal<FeedEvent[]>([])

    readonly openRepairsCount = computed(
        () => this.repairs().filter(r => r.status !== 'closed').length,
    )

    readonly inFlightOrdersCount = computed(
        () => this.orders().filter(o => o.status === 'pending' || o.status === 'approved' || o.status === 'ordered').length,
    )

    readonly criticalAlertsCount = computed(
        () => this.alerts().filter(a => a.severity === 'critical' && a.status === 'active').length,
    )

    readonly topCriticalAlerts = computed(
        () => this.alerts().filter(a => a.severity === 'critical' && a.status === 'active').slice(0, 3),
    )

    private readonly subs: Subscription[] = []

    ngOnInit(): void {
        this.subs.push(
            this.sdk.assignments$().subscribe(data => this.assignments.set(data)),
            this.sdk.repairs$().subscribe(data => this.repairs.set(data)),
            this.sdk.orders$().subscribe(data => this.orders.set(data)),
            this.sdk.alerts$().subscribe(data => this.alerts.set(data)),
        )

        const feedSub = interval(3000)
            .pipe(
                map(i => {
                    const alert = mockAlerts[i % mockAlerts.length]
                    return {
                        device: alert.device,
                        description: alert.description,
                        serial: alert.serial,
                        timestamp: new Date().toLocaleTimeString(this.i18n.lang() === 'fr' ? 'fr-FR' : 'en-US'),
                    }
                }),
            )
            .subscribe(event => {
                this.feedEvents.update(prev => [event, ...prev].slice(0, 8))
            })

        this.subs.push(feedSub)
    }

    ngOnDestroy(): void {
        this.subs.forEach(s => s.unsubscribe())
    }
}
