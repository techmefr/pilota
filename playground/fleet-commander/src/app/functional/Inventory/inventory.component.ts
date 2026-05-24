import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { Subscription } from 'rxjs'
import { SdkService } from '../../technical/Sdk/sdk.service'
import { TranslatePipe } from '../../technical/I18n/translate.pipe'
import type { Assignment } from '../../technical/Sdk/resources'

@Component({
    selector: 'fc-inventory',
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
            font-size: 0.82rem; outline: none; cursor: pointer; transition: border-color 0.15s;
        }
        .fc-select:focus { border-color: var(--accent); }
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
        .link { color: var(--accent); cursor: pointer; }
        .link:hover { text-decoration: underline; }

        .badge {
            display: inline-flex; align-items: center;
            font-size: 0.62rem; font-weight: 700; letter-spacing: 0.04em;
            text-transform: uppercase; padding: 0.18rem 0.5rem; border-radius: 4px; white-space: nowrap;
        }
        .badge-active    { background: var(--green-bg);  color: var(--accent-2); border: 1px solid var(--green-brd); }
        .badge-repair    { background: var(--warn-bg);   color: var(--warn);     border: 1px solid var(--warn-brd); }
        .badge-returned  { background: var(--card);      color: var(--text-3);   border: 1px solid var(--border); }

        .empty { text-align: center; padding: 3rem 1rem; color: var(--text-3); font-size: 0.85rem; }
    `],
    template: `
        <div class="page">
            <div class="page-header">
                <h1 class="page-title">{{ 'inventory_title' | translate }}</h1>
                <p class="page-sub">{{ 'inventory_sub' | translate }}</p>
            </div>

            <div class="filters">
                <input
                    class="fc-input"
                    type="text"
                    [placeholder]="'search' | translate"
                    [(ngModel)]="searchQuery"
                />
                <select class="fc-select" [(ngModel)]="selectedTeam">
                    <option value="">{{ 'all_teams' | translate }}</option>
                    @for (team of availableTeams(); track team) {
                        <option [value]="team">{{ team }}</option>
                    }
                </select>
                <select class="fc-select" [(ngModel)]="selectedStatus">
                    <option value="">{{ 'all_statuses' | translate }}</option>
                    <option value="active">{{ 'status_active' | translate }}</option>
                    <option value="repair">{{ 'status_repair' | translate }}</option>
                    <option value="returned">{{ 'status_returned' | translate }}</option>
                </select>
                <span class="result-count">{{ filteredAssignments().length }} résultats</span>
            </div>

            <div class="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>{{ 'col_employee' | translate }}</th>
                            <th>{{ 'col_team' | translate }}</th>
                            <th>{{ 'col_device' | translate }}</th>
                            <th>{{ 'col_serial' | translate }}</th>
                            <th>{{ 'col_assigned' | translate }}</th>
                            <th>{{ 'col_status' | translate }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        @for (a of filteredAssignments(); track a.id) {
                            <tr>
                                <td>
                                    <div>{{ a.employee }}</div>
                                    <div class="mono">{{ a.email }}</div>
                                </td>
                                <td>{{ a.team }}</td>
                                <td>{{ a.model }}</td>
                                <td>
                                    <a class="mono link" [routerLink]="['/pc', a.serial]">{{ a.serial }}</a>
                                </td>
                                <td class="mono">{{ a.assigned_at }}</td>
                                <td>
                                    <span class="badge" [class]="'badge-' + a.status">
                                        @switch (a.status) {
                                            @case ('active')   { {{ 'status_active' | translate }} }
                                            @case ('repair')   { {{ 'status_repair' | translate }} }
                                            @case ('returned') { {{ 'status_returned' | translate }} }
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
export class InventoryComponent implements OnInit, OnDestroy {
    private readonly sdk = inject(SdkService)

    readonly assignments = signal<Assignment[]>([])

    searchQuery = ''
    selectedTeam = ''
    selectedStatus = ''

    readonly availableTeams = computed(() => {
        const teams = new Set(this.assignments().map(a => a.team))
        return Array.from(teams).sort()
    })

    readonly filteredAssignments = computed(() => {
        const query = this.searchQuery.toLowerCase()
        const team = this.selectedTeam
        const status = this.selectedStatus

        return this.assignments().filter(a => {
            const matchesQuery =
                !query ||
                a.employee.toLowerCase().includes(query) ||
                a.model.toLowerCase().includes(query) ||
                a.serial.toLowerCase().includes(query) ||
                a.team.toLowerCase().includes(query)

            const matchesTeam = !team || a.team === team
            const matchesStatus = !status || a.status === status

            return matchesQuery && matchesTeam && matchesStatus
        })
    })

    private sub: Subscription | null = null

    ngOnInit(): void {
        this.sub = this.sdk.assignments$().subscribe(data => this.assignments.set(data))
    }

    ngOnDestroy(): void {
        this.sub?.unsubscribe()
    }
}
