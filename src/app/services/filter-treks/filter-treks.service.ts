import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { point } from '@turf/helpers';

import {
  ContainsFilter,
  Filter,
  IntervalFilter,
  MinimalTrek,
  MinimalTreks,
  Order
} from '@app/interfaces/interfaces';
import { SettingsService } from '@app/services/settings/settings.service';
import distance from '@turf/distance';

@Injectable({
  providedIn: 'root'
})
export class FilterTreksService {
  public activeFiltersNumber$: Observable<number>;

  public static filter(
    treks: MinimalTreks | null,
    filters: Filter[] | null
  ): MinimalTrek[] {
    if (!treks) {
      return [];
    }

    let filteredFeatures = treks.features;

    if (filters) {
      filters.forEach((filter) => {
        filteredFeatures = filteredFeatures.filter((feature) => {
          if (!FilterTreksService.isFilterActive(filter)) {
            return true;
          }

          if (filter.type === 'contains') {
            return FilterTreksService.containsFilter(
              filter as ContainsFilter,
              feature
            );
          } else if (filter.type === 'interval') {
            return FilterTreksService.intervalFilter(
              filter as IntervalFilter,
              feature
            );
          }

          return false;
        });
      });
    }

    return filteredFeatures;
  }

  public static sort(
    filteredTreks: MinimalTrek[],
    order: Order,
    userLocation?: number[]
  ): MinimalTrek[] {
    return filteredTreks.sort((a: MinimalTrek, b: MinimalTrek) => {
      if (order === 'location' && userLocation && userLocation !== null) {
        if (!a.geometry || !b.geometry) {
          return !a.geometry ? 1 : -1;
        }

        const distanceFromTrekA = distance(
          point(a.geometry.coordinates),
          point(userLocation)
        );
        const distanceFromTrekB = distance(
          point(b.geometry.coordinates),
          point(userLocation)
        );

        if (distanceFromTrekA < distanceFromTrekB) {
          return -1;
        }
        if (distanceFromTrekA > distanceFromTrekB) {
          return 1;
        }
        return 0;
      }
      if (order === 'alphabetical') {
        if (a.properties.name < b.properties.name) {
          return -1;
        }
        if (a.properties.name > b.properties.name) {
          return 1;
        }
        return 0;
      }
      if (order === 'random') {
        return 0.5 - Math.random();
      }
      return 0;
    });
  }

  private static isFilterActive(filter: Filter): boolean {
    return filter.values.filter((value) => value.checked).length > 0;
  }

  private static getNumberOfActiveFilters(filters: Filter[] | null): number {
    let numberOfActiveFilters = 0;
    if (!!filters) {
      filters.forEach((filter) => {
        numberOfActiveFilters +=
          FilterTreksService.getCheckedIdForFilter(filter).length;
      });
    }
    return numberOfActiveFilters;
  }

  private static intervalFilter(filter: IntervalFilter, feature: MinimalTrek) {
    let isInInterval = false;
    FilterTreksService.getCheckedInterval(filter).forEach(
      ([min, max]: [number, number]) => {
        const criterionValue: number = feature.properties[filter.id];
        if (criterionValue >= min && criterionValue <= max) {
          isInInterval = true;
          return;
        }
      }
    );
    return isInInterval;
  }

  private static containsFilter(
    filter: ContainsFilter,
    feature: MinimalTrek
  ): boolean {
    if (Array.isArray(feature.properties[filter.id])) {
      return (
        FilterTreksService.getCheckedIdForFilter(filter).find(
          (filterValue) =>
            (feature.properties[filter.id] as any).indexOf(filterValue) !== -1
        ) !== undefined
      );
    } else {
      return (
        FilterTreksService.getCheckedIdForFilter(filter).indexOf(
          feature.properties[filter.id] as any
        ) !== -1
      );
    }
  }

  private static getCheckedIdForFilter(filter: Filter): number[] {
    return filter.values
      .filter((value) => value.checked)
      .map((checkedValue) => checkedValue.id);
  }

  private static getCheckedInterval(filter: Filter): [number, number][] {
    return filter.values
      .filter((value) => !!value.interval && value.checked)
      .map((checkedValue) => checkedValue.interval) as [number, number][];
  }

  constructor(private settings: SettingsService) {
    this.activeFiltersNumber$ = settings.filters$.pipe(
      map((filters) => FilterTreksService.getNumberOfActiveFilters(filters))
    );
  }

  public getFilteredTreks(
    treks$: Observable<MinimalTreks | null>
  ): Observable<MinimalTrek[]> {
    return combineLatest([
      treks$,
      this.settings.filters$,
      this.settings.order$
    ]).pipe(
      map(([treks, filters, order]) => {
        if (treks && filters && order) {
          return FilterTreksService.sort(
            FilterTreksService.filter(treks, filters),
            order.type,
            order.value
          );
        } else {
          return [];
        }
      })
    );
  }
}
