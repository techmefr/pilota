import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { Subscription } from 'rxjs'
import { SdkService } from '../../technical/Sdk/sdk.service'
import { TranslatePipe } from '../../technical/I18n/translate.pipe'
import type { Alert } from '../../technical/Sdk/resources'

@Component({
    selector: 'fc-alerts',
    standalone: true,
    imports: [FormsModule, RouterLink, TranslatePipe],
    styles: [`
        .page { padding: 2rem; overflow-y: auto; height: 100%; }
        .page-header { margin-bottom: 1.75rem; }
        .page-title { font-size: 1.35rem; font-weight: 800; color: var(--text); letter-spacing: -0.02em; margin-bottom: 0.25rem; }
        .page-sub { font-size: 0.8rem; color: var(--text-2); }

        .filters {
            display: flex; align-items: center; gap: 0.75rem;
            margin-bottom: 1.25rem; flex-wrap: wrap;
        }
        .fc-input {
            background: var(--surface); border: 1px solid var(--border);
            border-radius: 7px; color: var(--text); padding: 0.45rem 0.8rem;
            font-size: 0.82rem; outline: none; transition: border-color 0.15s; min-width: 220px;
        }
        .fc-input:focus { border-color: var(--accent); }
        .fc-input::placeholder { color: var(--text-3); }
        .fc-select {
            background: var(--surface); border: 1px solid var(--border);
            border-radius: 7px; color: var(--text); padding: 0.45rem 0.8rem;
            font-size: 0.82rem; outline: none; cursor: pointer;
        }
        .fc-select option { background: var(--surface); color: var(--text); }

        .table-wrap { overflow-x: auto; border: 1px solid var(--border); border-radius: 10px; }
        table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
        th {
            background: var(--surface); color: var(--text-3);
            font-size: 0.6rem; font-weight: 700; letter-spacing: 0.06em;
            text-transform: uppercase; padding: 0.6rem 1rem;
            text-align: left; border-bottom: 1px solid var(--border); white-space: nowrap;
        }
        td { padding: 0.75rem 1rem; border-bottom: 1px solid var(--border); color: var(--text); }
        tbody tr:last-child td { border-bottom: none; }
        tbody tr:hover td { background: var(--card-hi); }
        .mono { font-family: ui-monospace, 'Cascadia Code', monospace; font-size: 0.75rem; color: var(--text-2); }
        .link { color: var(--accent); }
        .link:hover { text-decoration: underline; }

        .badge {
            display: inline-flex; font-size: 0.62rem; font-weight: 700;
            letter-spacing: 0.04em; text-transform: uppercase;
            padding: 0.18rem 0.5rem; border-radius: 4px; white-space: nowrap;
        }
        .badge-critical { background: var(--danger-bg); color: var(--danger);   border: 1px solid var(--danger-brd); }
        .badge-warning  { background: var(--warn-bg);   color: var(--warn);     border: 1px solid var(--warn-brd); }
        .badge-info     { background: var(--accent-bg); color: var(--accent);   border: 1px solid var(--accent-brd); }
        .badge-active        { background: var(--danger-bg); color: var(--danger);    border: 1px solid var(--danger-brd); }
        .badge-acknowledged  { background: var(--card);      color: var(--text-3);    border: 1px solid var(--border); }
        .badge-resolved      { background: var(--green-bg);  color: var(--accent-2);  border: 1px solid var(--green-brd); }

        .type-chip {
            display: inline-flex; font-size: 0.6rem; font-weight: 600;
            padding: 0.15rem 0.45rem; border-radius: 4px; white-space: nowrap;
            background: var(--surface); color: var(--text-3); border: 1px solid var(--border);
        }

        .empty { text-align: center; padding: 3rem 1rem; color: var(--text-3); font-size: 0.85rem; }
    `],
    template: `
        <div class="page">
            <div class="page-header">
                <h1 class="page-title">{{ 'alerts_title' | translate }}</h1>
                <p class="page-sub">{{ 'alerts_sub' | translate }}</p>
            </div>

            <div class="filters">
                <input
                    class="fc-input"
                    type="text"
                    [placeholder]="'search' | translate"
                    [ngModel]="searchQuery()"
                    (ngModelChange)="searchQuery.set($event)"
                />
                <select class="fc-select" [ngModel]="selectedSeverity()" (ngModelChange)="selectedSeverity.set($event)">
                    <option value="">Toutes sévérités</option>
                    <option value="critical">Critique</option>
                    <option value="warning">Avertissement</option>
                    <option value="info">Info</option>
                </select>
                <select class="fc-select" [ngModel]="selectedType()" (ngModelChange)="selectedType.set($event)">
                    <option value="">{{ 'all_types' | translate }}</option>
                    <option value="warranty">Garantie</option>
                    <option value="age">Ancienneté</option>
                    <option value="performance">Performance</option>
                    <option value="security">Sécurité</option>
                </select>
            </div>

            <div class="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>Sévérité</th>
                            <th>{{ 'col_type' | translate }}</th>
                            <th>{{ 'col_device_emp' | translate }}</th>
                            <th>Description</th>
                            <th>{{ 'col_due' | translate }}</th>
                            <th>{{ 'col_status' | translate }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        @for (a of filteredAlerts(); track a.id) {
                            <tr>
                                <td>
                                    <span class="badge" [class]="'badge-' + a.severity">
                                        @switch (a.severity) {
                                            @case ('critical') { Critique }
                                            @case ('warning')  { Avertissement }
                                            @case ('info')     { Info }
                                        }
                                    </span>
                                </td>
                                <td>
                                    <span class="type-chip">
                                        @switch (a.type) {
                                            @case ('warranty')    { Garantie }
                                            @case ('age')         { Ancienneté }
                                            @case ('performance') { Performance }
                                            @case ('security')    { Sécurité }
                                        }
                                    </span>
                                </td>
                                <td>
                                    <div>{{ a.device }}</div>
                                    <div style="font-size:0.76rem; color:var(--text-2)">{{ a.employee }}</div>
                                    <a class="mono link" [routerLink]="['/pc', a.serial]">{{ a.serial }}</a>
                                </td>
                                <td style="max-width:260px; font-size:0.8rem; color:var(--text-2)">{{ a.description }}</td>
                                <td class="mono">{{ a.due_date }}</td>
                                <td>
                                    <span class="badge" [class]="'badge-' + a.status">
                                        @switch (a.status) {
                                            @case ('active')       { {{ 'status_active' | translate }} }
                                            @case ('acknowledged') { {{ 'status_acknowledged' | translate }} }
                                            @case ('resolved')     { {{ 'status_resolved' | translate }} }
                                        }
                                    </span>
                                </td>
                            </tr>
                        } @empty {
                            <tr>
                                <td colspan="6" class="empty">{{ 'no_results' | translate }}</td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
        </div>
    `,
})
export class AlertsComponent implements OnInit, OnDestroy {
    private readonly sdk = inject(SdkService)

    readonly alerts = signal<Alert[]>([])

    readonly searchQuery = signal('')
    readonly selectedSeverity = signal('')
    readonly selectedType = signal('')

    readonly filteredAlerts = computed(() => {
        const query = this.searchQuery().toLowerCase()
        const severity = this.selectedSeverity()
        const type = this.selectedType()

        return this.alerts().filter(a => {
            const matchesQuery =
                !query ||
                a.device.toLowerCase().includes(query) ||
                a.employee.toLowerCase().includes(query) ||
                a.serial.toLowerCase().includes(query) ||
                a.description.toLowerCase().includes(query)

            const matchesSeverity = !severity || a.severity === severity
            const matchesType = !type || a.type === type

            return matchesQuery && matchesSeverity && matchesType
        })
    })

    private sub: Subscription | null = null

    ngOnInit(): void {
        this.sub = this.sdk.alerts$().subscribe(data => this.alerts.set(data))
    }

    ngOnDestroy(): void {
        this.sub?.unsubscribe()
    }
}
