import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';

import { UnSubscribe } from '@app/components/abstract/unsubscribe';
import { Filter, FilterValue, MinimalTreks } from '@app/interfaces/interfaces';
import { FilterTreksService } from '@app/services/filter-treks/filter-treks.service';
import { OfflineTreksService } from '@app/services/offline-treks/offline-treks.service';
import { OnlineTreksService } from '@app/services/online-treks/online-treks.service';
import { SettingsService } from '@app/services/settings/settings.service';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
})
export class FiltersComponent extends UnSubscribe implements OnInit, OnDestroy {
  public temporaryFilters$ = new BehaviorSubject<Filter[]>([]);
  public nbTemporaryFiltersTreks = 0;
  public commonSrc: string;
  public filters: Filter[];
  private filtersSubscription: Subscription;
  @Input() public isOnline: boolean;

  constructor(
    private modalCtrl: ModalController,
    public settings: SettingsService,
    private onlineTreks: OnlineTreksService,
    private offlineTreks: OfflineTreksService,
    private platform: Platform,
  ) {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  ionViewDidEnter(): void {
    const treks$ = this.isOnline ? this.onlineTreks.treks$ : this.offlineTreks.treks$;
    this.commonSrc = this.isOnline ? this.onlineTreks.getCommonImgSrc() : this.offlineTreks.getCommonImgSrc();

    this.filtersSubscription = this.settings.filters$.subscribe(filters => {
      this.filters = filters || [];
      this.temporaryFilters$.next(filters || []);
    });

    this.subscriptions$$.push(
      this.platform.backButton.subscribeWithPriority(99999, () => {
        this.close();
      }),

      combineLatest(treks$, this.temporaryFilters$).subscribe(
        ([treks, temporaryFilters]: [MinimalTreks | null, Filter[]]) => {
          this.nbTemporaryFiltersTreks = !!treks ? FilterTreksService.filter(treks, temporaryFilters).length : 0;
        },
      ),
    );
  }

  public handleFiltersState(checkState: boolean, filter: Filter, value: FilterValue): void {
    const temporaryFilters = [...this.temporaryFilters$.getValue()];
    const temporaryFilter = temporaryFilters.find(tempFilter => tempFilter.id === filter.id) as Filter;
    const filterValue = temporaryFilter.values.find(tempValue => tempValue.id === value.id) as FilterValue;
    filterValue.checked = checkState;
    this.temporaryFilters$.next(temporaryFilters);
  }

  public handleSelect(event: { filter: Filter }): void {
    const temporaryFilters = [...this.temporaryFilters$.getValue()];
    let temporaryFilterIndex = temporaryFilters.findIndex(tempFilter => tempFilter.id === event.filter.id);
    if (temporaryFilterIndex) {
      temporaryFilters[temporaryFilterIndex] = event.filter;
      this.temporaryFilters$.next(temporaryFilters);
    }
  }

  public applyFilters(): void {
    this.unsubscribeFilters();
    this.settings.saveFiltersState(this.temporaryFilters$.getValue());
    this.modalCtrl.dismiss(true);
  }

  public eraseFilters(): void {
    const temporaryFilters = [...this.temporaryFilters$.getValue()];
    temporaryFilters.forEach(filter => {
      filter.values.forEach(value => (value.checked = false));
    });
    this.temporaryFilters$.next(temporaryFilters);
  }

  public close(): void {
    this.modalCtrl.dismiss();
  }

  public trackFilters(index: number, element: Filter): string | null {
    return element ? element.id : null;
  }

  public unsubscribeFilters(): void {
    if (this.filtersSubscription) {
      this.filtersSubscription.unsubscribe();
    }
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.unsubscribeFilters();
  }

  public trackByFilterId(index: number, element: Filter): string | null {
    return element ? element.id : null;
  }
}
