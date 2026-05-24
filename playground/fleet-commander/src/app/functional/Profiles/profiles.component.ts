import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Subscription } from 'rxjs'
import { SdkService } from '../../technical/Sdk/sdk.service'
import { TranslatePipe } from '../../technical/I18n/translate.pipe'
import type { PcProfile } from '../../technical/Sdk/resources'

@Component({
    selector: 'fc-profiles',
    standalone: true,
    imports: [FormsModule, TranslatePipe],
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
        .specs-col { font-size: 0.78rem; color: var(--text-2); }
        .spec-line { display: flex; flex-direction: column; gap: 0.1rem; }

        .tier-badge {
            display: inline-flex; font-size: 0.6rem; font-weight: 700;
            letter-spacing: 0.04em; text-transform: uppercase;
            padding: 0.18rem 0.5rem; border-radius: 4px; white-space: nowrap;
        }
        .tier-perf  { background: var(--accent-bg); color: var(--accent); border: 1px solid var(--accent-brd); }
        .tier-std   { background: var(--card);      color: var(--text-3); border: 1px solid var(--border); }

        .num { text-align: right; font-variant-numeric: tabular-nums; }
        .to-order-pos { color: var(--accent-2); font-weight: 700; }
        .to-order-neg { color: var(--danger); font-weight: 700; }

        .empty { text-align: center; padding: 3rem 1rem; color: var(--text-3); font-size: 0.85rem; }
    `],
    template: `
        <div class="page">
            <div class="page-header">
                <h1 class="page-title">{{ 'profiles_title' | translate }}</h1>
                <p class="page-sub">{{ 'profiles_sub' | translate }}</p>
            </div>

            <div class="filters">
                <input
                    class="fc-input"
                    type="text"
                    [placeholder]="'search' | translate"
                    [(ngModel)]="searchQuery"
                />
                <select class="fc-select" [(ngModel)]="selectedTier">
                    <option value="">{{ 'all_types' | translate }}</option>
                    <option value="performance">{{ 'perf' | translate }}</option>
                    <option value="standard">{{ 'std' | translate }}</option>
                </select>
            </div>

            <div class="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>{{ 'col_profile' | translate }}</th>
                            <th>{{ 'col_model' | translate }}</th>
                            <th>{{ 'col_specs' | translate }}</th>
                            <th>{{ 'col_screens' | translate }}</th>
                            <th class="num">{{ 'col_total' | translate }}</th>
                            <th class="num">{{ 'col_stock' | translate }}</th>
                            <th class="num">{{ 'col_to_order' | translate }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        @for (p of filteredProfiles(); track p.id) {
                            <tr>
                                <td>
                                    <div>{{ p.role }}</div>
                                    <div style="margin-top:0.2rem">
                                        <span class="tier-badge" [class]="p.model_tier === 'performance' ? 'tier-perf' : 'tier-std'">
                                            @if (p.model_tier === 'performance') { Perf }
                                            @else { Std }
                                        </span>
                                    </div>
                                </td>
                                <td class="mono">{{ p.model_name }}</td>
                                <td>
                                    <div class="spec-line specs-col">
                                        <span>{{ p.cpu }}</span>
                                        <span>{{ p.ram }} · {{ p.storage }}</span>
                                        <span>{{ p.gpu }}</span>
                                    </div>
                                </td>
                                <td>{{ p.screens }}× {{ p.screen_spec }}</td>
                                <td class="num">{{ p.total }}</td>
                                <td class="num">{{ p.stock }}</td>
                                <td class="num">
                                    @if (p.total - p.stock > 0) {
                                        <span class="to-order-neg">{{ p.total - p.stock }}</span>
                                    } @else {
                                        <span class="to-order-pos">OK</span>
                                    }
                                </td>
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
export class ProfilesComponent implements OnInit, OnDestroy {
    private readonly sdk = inject(SdkService)

    readonly profiles = signal<PcProfile[]>([])

    searchQuery = ''
    selectedTier = ''

    readonly filteredProfiles = computed(() => {
        const query = this.searchQuery.toLowerCase()
        const tier = this.selectedTier

        return this.profiles().filter(p => {
            const matchesQuery =
                !query ||
                p.role.toLowerCase().includes(query) ||
                p.model_name.toLowerCase().includes(query) ||
                p.cpu.toLowerCase().includes(query)

            const matchesTier = !tier || p.model_tier === tier

            return matchesQuery && matchesTier
        })
    })

    private sub: Subscription | null = null

    ngOnInit(): void {
        this.sub = this.sdk.pcProfiles$().subscribe(data => this.profiles.set(data))
    }

    ngOnDestroy(): void {
        this.sub?.unsubscribe()
    }
}
