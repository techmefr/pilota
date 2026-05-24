import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core'
import { ActivatedRoute, RouterLink } from '@angular/router'
import { Subscription } from 'rxjs'
import { SdkService } from '../../technical/Sdk/sdk.service'
import { TranslatePipe } from '../../technical/I18n/translate.pipe'
import { mockAssignments, mockRepairs, mockAlerts } from '../../technical/Sdk/mock'
import type { Assignment, Repair, Alert } from '../../technical/Sdk/resources'

interface DriverBlock {
    name: string
    driver: string
    color: 'accent' | 'green' | 'warn'
    rows: { label: string; value: string }[]
}

@Component({
    selector: 'fc-pc-detail',
    standalone: true,
    imports: [RouterLink, TranslatePipe],
    styles: [`
        .page { padding: 2rem; overflow-y: auto; height: 100%; }

        .breadcrumb {
            display: flex; align-items: center; gap: 0.4rem;
            font-size: 0.75rem; color: var(--text-3); margin-bottom: 1.25rem;
        }
        .breadcrumb a { color: var(--accent); }
        .breadcrumb a:hover { text-decoration: underline; }
        .breadcrumb-sep { opacity: 0.5; }

        .page-header { margin-bottom: 1.75rem; }
        .page-title { font-size: 1.35rem; font-weight: 800; color: var(--text); letter-spacing: -0.02em; margin-bottom: 0.25rem; }
        .page-sub { font-size: 0.8rem; color: var(--text-2); }

        .serial-chip {
            display: inline-flex; font-family: ui-monospace, 'Cascadia Code', monospace;
            font-size: 0.75rem; color: var(--accent); background: var(--accent-bg);
            border: 1px solid var(--accent-brd); padding: 0.2rem 0.6rem; border-radius: 5px;
            margin-top: 0.5rem;
        }

        .drivers-grid {
            display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 2rem;
        }

        .driver-card {
            background: var(--card); border: 1px solid var(--border);
            border-radius: 10px; overflow: hidden;
        }
        .driver-header {
            padding: 0.875rem 1.25rem; border-bottom: 1px solid var(--border);
            display: flex; flex-direction: column; gap: 0.2rem;
        }
        .driver-title { font-size: 0.78rem; font-weight: 700; color: var(--text); }
        .driver-badge {
            font-size: 0.6rem; font-weight: 600; padding: 0.15rem 0.45rem;
            border-radius: 4px; white-space: nowrap; align-self: flex-start;
        }
        .driver-badge.accent  { background: var(--accent-bg);  color: var(--accent);   border: 1px solid var(--accent-brd); }
        .driver-badge.green   { background: var(--green-bg);   color: var(--accent-2); border: 1px solid var(--green-brd); }
        .driver-badge.warn    { background: var(--warn-bg);    color: var(--warn);     border: 1px solid var(--warn-brd); }

        .driver-rows { padding: 0.5rem 1.25rem 0.75rem; }
        .driver-row {
            display: flex; justify-content: space-between; align-items: center; gap: 0.5rem;
            padding: 0.4rem 0; border-bottom: 1px solid var(--border); font-size: 0.82rem;
        }
        .driver-row:last-child { border-bottom: none; }
        .row-key { color: var(--text-3); }
        .row-val { color: var(--text); font-weight: 600; text-align: right; }

        .section-title {
            font-size: 0.68rem; font-weight: 700; letter-spacing: 0.05em;
            text-transform: uppercase; color: var(--text-3); margin-bottom: 0.875rem;
        }

        .repair-card {
            background: var(--card); border: 1px solid var(--border);
            border-radius: 8px; padding: 1rem 1.25rem; margin-bottom: 0.5rem;
        }
        .repair-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem; }
        .repair-ticket { font-family: ui-monospace, 'Cascadia Code', monospace; font-size: 0.78rem; color: var(--accent); }
        .repair-issue { font-size: 0.83rem; color: var(--text-2); }

        .badge {
            display: inline-flex; font-size: 0.62rem; font-weight: 700;
            letter-spacing: 0.04em; text-transform: uppercase;
            padding: 0.18rem 0.5rem; border-radius: 4px; white-space: nowrap;
        }
        .badge-open          { background: var(--danger-bg); color: var(--danger);  border: 1px solid var(--danger-brd); }
        .badge-in_progress   { background: var(--warn-bg);   color: var(--warn);    border: 1px solid var(--warn-brd); }
        .badge-waiting_parts { background: var(--accent-bg); color: var(--accent);  border: 1px solid var(--accent-brd); }
        .badge-closed        { background: var(--card);      color: var(--text-3);  border: 1px solid var(--border); }

        .not-found { text-align: center; padding: 4rem 1rem; color: var(--text-3); }
        .not-found h2 { font-size: 1.1rem; margin-bottom: 0.5rem; color: var(--text-2); }
    `],
    template: `
        <div class="page">
            <div class="breadcrumb">
                <a routerLink="/inventory">{{ 'nav_inventory' | translate }}</a>
                <span class="breadcrumb-sep">/</span>
                <span>{{ serial() }}</span>
            </div>

            @if (assignment()) {
                <div class="page-header">
                    <h1 class="page-title">{{ assignment()!.model }}</h1>
                    <p class="page-sub">{{ assignment()!.employee }} · {{ assignment()!.team }}</p>
                    <span class="serial-chip">{{ serial() }}</span>
                </div>

                <div class="drivers-grid">
                    @for (block of driverBlocks(); track block.driver) {
                        <div class="driver-card">
                            <div class="driver-header">
                                <span class="driver-title">{{ block.name }}</span>
                                <span class="driver-badge" [class]="block.color">{{ block.driver }}</span>
                            </div>
                            <div class="driver-rows">
                                @for (row of block.rows; track row.label) {
                                    <div class="driver-row">
                                        <span class="row-key">{{ row.label }}</span>
                                        <span class="row-val">{{ row.value }}</span>
                                    </div>
                                }
                            </div>
                        </div>
                    }
                </div>

                @if (deviceRepairs().length > 0) {
                    <div>
                        <div class="section-title">{{ 'repairs_title' | translate }}</div>
                        @for (r of deviceRepairs(); track r.id) {
                            <div class="repair-card">
                                <div class="repair-header">
                                    <span class="repair-ticket">{{ r.ticket }}</span>
                                    <span class="badge" [class]="'badge-' + r.status">
                                        @switch (r.status) {
                                            @case ('open')          { {{ 'status_open' | translate }} }
                                            @case ('in_progress')   { {{ 'status_in_progress' | translate }} }
                                            @case ('waiting_parts') { {{ 'status_waiting_parts' | translate }} }
                                            @case ('closed')        { {{ 'status_closed' | translate }} }
                                        }
                                    </span>
                                </div>
                                <div class="repair-issue">{{ r.issue }}</div>
                            </div>
                        }
                    </div>
                }

            } @else {
                <div class="not-found">
                    <h2>Appareil introuvable</h2>
                    <p>Numéro de série : {{ serial() }}</p>
                    <br>
                    <a routerLink="/inventory" style="color: var(--accent)">← Retour à l'inventaire</a>
                </div>
            }
        </div>
    `,
})
export class PcDetailComponent implements OnInit, OnDestroy {
    private readonly route = inject(ActivatedRoute)
    private readonly sdk = inject(SdkService)

    readonly serial = signal<string>('')
    readonly assignments = signal<Assignment[]>([])
    readonly repairs = signal<Repair[]>([])
    readonly deviceAlerts = signal<Alert[]>([])

    readonly assignment = computed(() =>
        this.assignments().find(a => a.serial === this.serial()) ?? null,
    )

    readonly deviceRepairs = computed(() =>
        this.repairs().filter(r => r.serial === this.serial()),
    )

    readonly driverBlocks = computed((): DriverBlock[] => {
        const a = this.assignment()
        if (!a) return []

        return [
            {
                name: 'Affectation',
                driver: 'Lomkit / Laravel',
                color: 'accent',
                rows: [
                    { label: 'Employé',     value: a.employee },
                    { label: 'Équipe',      value: a.team },
                    { label: 'Département', value: a.department },
                    { label: 'Attribution', value: a.assigned_at },
                    { label: 'Statut',      value: a.status },
                ],
            },
            {
                name: 'Événements temps réel',
                driver: 'Supabase Realtime',
                color: 'green',
                rows: [
                    { label: 'Dernier ping',    value: new Date().toLocaleDateString('fr-FR') },
                    { label: 'Connexion',       value: 'Simulée (placeholder)' },
                    { label: 'Table',           value: 'fleet_events' },
                    { label: 'Abonnement',      value: 'Actif' },
                ],
            },
            {
                name: 'Profil matériel',
                driver: 'Nhost / GraphQL',
                color: 'warn',
                rows: [
                    { label: 'Modèle',   value: a.model },
                    { label: 'N° série', value: a.serial },
                    { label: 'Source',   value: 'GraphQL (placeholder)' },
                    { label: 'Endpoint', value: 'Nhost Hasura' },
                ],
            },
        ]
    })

    private readonly subs: Subscription[] = []

    ngOnInit(): void {
        const serialParam = this.route.snapshot.paramMap.get('serial')
        this.serial.set(serialParam ?? '')

        this.assignments.set(mockAssignments)
        this.repairs.set(mockRepairs)

        const alertsForDevice = mockAlerts.filter(a => a.serial === (serialParam ?? ''))
        this.deviceAlerts.set(alertsForDevice)

        this.subs.push(
            this.sdk.assignments$().subscribe(data => this.assignments.set(data)),
            this.sdk.repairs$().subscribe(data => this.repairs.set(data)),
        )
    }

    ngOnDestroy(): void {
        this.subs.forEach(s => s.unsubscribe())
    }
}
