import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { ContainsFilter, Filter, IntervalFilter, MinimalTrek, MinimalTreks } from '@app/interfaces/interfaces';
import { SettingsService } from '@app/services/settings/settings.service';

@Injectable({
  providedIn: 'root',
})
export class FilterTreksService {
  public activeFiltersNumber$: Observable<number>;

  public static filter(treks: MinimalTreks | null, filters: Filter[] | null): MinimalTrek[] {
    if (!treks) {
      return [];
    }

    let filteredFeatures = treks.features;

    if (filters) {
      filters.forEach(filter => {
        filteredFeatures = filteredFeatures.filter(feature => {
          if (!FilterTreksService.isFilterActive(filter)) {
            return true;
          }
          if (filter.type === 'contains') {
            return FilterTreksService.containsFilter(filter as ContainsFilter, feature);
          } else if (filter.type === 'interval') {
            return FilterTreksService.intervalFilter(filter as IntervalFilter, feature);
          } else {
            // TODO: not necessary but ts < 3.3 detecs a missing path. fixed in typescript 3.3
            return false;
          }
        });
      });
    }

    return filteredFeatures;
  }

  private static isFilterActive(filter: Filter): boolean {
    return filter.values.filter(value => value.checked).length > 0;
  }

  private static getNumberOfActiveFilters(filters: Filter[] | null): number {
    let numberOfActiveFilters = 0;
    if (!!filters) {
      filters.forEach(filter => {
        numberOfActiveFilters += FilterTreksService.getCheckedIdForFilter(filter).length;
      });
    }
    return numberOfActiveFilters;
  }

  private static intervalFilter(filter: IntervalFilter, feature: MinimalTrek) {
    let isInInterval = false;
    FilterTreksService.getCheckedInterval(filter).forEach(([min, max]: [number, number]) => {
      const criterionValue: number = feature.properties[filter.id];
      if (criterionValue >= min && criterionValue <= max) {
        isInInterval = true;
        return;
      }
    });
    return isInInterval;
  }

  private static containsFilter(filter: ContainsFilter, feature: MinimalTrek): boolean {
    if (Array.isArray(feature.properties[filter.id])) {
      return (
        FilterTreksService.getCheckedIdForFilter(filter).find(
          filterValue => (feature.properties[filter.id] as any).indexOf(filterValue) !== -1,
        ) !== undefined
      );
    } else {
      return FilterTreksService.getCheckedIdForFilter(filter).indexOf(feature.properties[filter.id] as any) !== -1;
    }
  }

  private static getCheckedIdForFilter(filter: Filter): number[] {
    return filter.values.filter(value => value.checked).map(checkedValue => checkedValue.id);
  }

  private static getCheckedInterval(filter: Filter): [number, number][] {
    return filter.values
      .filter(value => !!value.interval && value.checked)
      .map(checkedValue => checkedValue.interval) as [number, number][];
  }

  constructor(private settings: SettingsService) {
    this.activeFiltersNumber$ = settings.filters$.pipe(
      map(filters => FilterTreksService.getNumberOfActiveFilters(filters)),
    );
  }

  public getFilteredTreks(treks$: Observable<MinimalTreks | null>): Observable<MinimalTrek[]> {
    return combineLatest(treks$, this.settings.filters$).pipe(
      map(([treks, filters]) => FilterTreksService.filter(treks, filters)),
    );
  }
}
