import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { Subscription } from 'rxjs'
import { SdkService } from '../../technical/Sdk/sdk.service'
import { TranslatePipe } from '../../technical/I18n/translate.pipe'
import type { Repair } from '../../technical/Sdk/resources'

@Component({
    selector: 'fc-repairs',
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
        .result-count { margin-left: auto; font-size: 0.72rem; color: var(--text-3); }

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
        .badge-open          { background: var(--danger-bg); color: var(--danger);    border: 1px solid var(--danger-brd); }
        .badge-in_progress   { background: var(--warn-bg);   color: var(--warn);      border: 1px solid var(--warn-brd); }
        .badge-waiting_parts { background: var(--accent-bg); color: var(--accent);    border: 1px solid var(--accent-brd); }
        .badge-closed        { background: var(--card);      color: var(--text-3);    border: 1px solid var(--border); }

        .empty { text-align: center; padding: 3rem 1rem; color: var(--text-3); font-size: 0.85rem; }
        .na { color: var(--text-3); font-style: italic; font-size: 0.78rem; }
    `],
    template: `
        <div class="page">
            <div class="page-header">
                <h1 class="page-title">{{ 'repairs_title' | translate }}</h1>
                <p class="page-sub">{{ 'repairs_sub' | translate }}</p>
            </div>

            <div class="filters">
                <input
                    class="fc-input"
                    type="text"
                    [placeholder]="'search' | translate"
                    [ngModel]="searchQuery()"
                    (ngModelChange)="searchQuery.set($event)"
                />
                <select class="fc-select" [ngModel]="selectedStatus()" (ngModelChange)="selectedStatus.set($event)">
                    <option value="">{{ 'all_statuses' | translate }}</option>
                    <option value="open">{{ 'status_open' | translate }}</option>
                    <option value="in_progress">{{ 'status_in_progress' | translate }}</option>
                    <option value="waiting_parts">{{ 'status_waiting_parts' | translate }}</option>
                    <option value="closed">{{ 'status_closed' | translate }}</option>
                </select>
                <span class="result-count">{{ filteredRepairs().length }} tickets</span>
            </div>

            <div class="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>{{ 'col_ticket' | translate }}</th>
                            <th>{{ 'col_employee' | translate }}</th>
                            <th>{{ 'col_device' | translate }}</th>
                            <th>{{ 'col_issue' | translate }}</th>
                            <th>{{ 'col_technician' | translate }}</th>
                            <th>{{ 'col_status' | translate }}</th>
                            <th>{{ 'col_opened' | translate }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        @for (r of filteredRepairs(); track r.id) {
                            <tr>
                                <td class="mono">{{ r.ticket }}</td>
                                <td>
                                    <div>{{ r.employee }}</div>
                                    <div class="mono">{{ r.team }}</div>
                                </td>
                                <td>
                                    <div>{{ r.device }}</div>
                                    <a class="mono link" [routerLink]="['/pc', r.serial]">{{ r.serial }}</a>
                                </td>
                                <td style="max-width:240px">{{ r.issue }}</td>
                                <td>
                                    @if (r.technician) {
                                        {{ r.technician }}
                                    } @else {
                                        <span class="na">Non assigné</span>
                                    }
                                </td>
                                <td>
                                    <span class="badge" [class]="'badge-' + r.status">
                                        @switch (r.status) {
                                            @case ('open')          { {{ 'status_open' | translate }} }
                                            @case ('in_progress')   { {{ 'status_in_progress' | translate }} }
                                            @case ('waiting_parts') { {{ 'status_waiting_parts' | translate }} }
                                            @case ('closed')        { {{ 'status_closed' | translate }} }
                                        }
                                    </span>
                                </td>
                                <td class="mono">{{ r.opened_at }}</td>
                            </tr>
                        } @empty {
                            <tr>
                                <td colspan="7" class="empty">{{ 'no_results' | translate }}</td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
        </div>
    `,
})
export class RepairsComponent implements OnInit, OnDestroy {
    private readonly sdk = inject(SdkService)

    readonly repairs = signal<Repair[]>([])

    readonly searchQuery = signal('')
    readonly selectedStatus = signal('')

    readonly filteredRepairs = computed(() => {
        const query = this.searchQuery().toLowerCase()
        const status = this.selectedStatus()

        return this.repairs().filter(r => {
            const matchesQuery =
                !query ||
                r.employee.toLowerCase().includes(query) ||
                r.device.toLowerCase().includes(query) ||
                r.ticket.toLowerCase().includes(query) ||
                r.serial.toLowerCase().includes(query)

            const matchesStatus = !status || r.status === status

            return matchesQuery && matchesStatus
        })
    })

    private sub: Subscription | null = null

    ngOnInit(): void {
        this.sub = this.sdk.repairs$().subscribe(data => this.repairs.set(data))
    }

    ngOnDestroy(): void {
        this.sub?.unsubscribe()
    }
}
