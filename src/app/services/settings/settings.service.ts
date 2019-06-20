import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject, Observable } from 'rxjs';
import { cloneDeep } from 'lodash';
import { TranslateService } from '@ngx-translate/core';

import {
  Trek,
  Filter,
  Settings,
  DataSetting,
  HydratedTrek,
  Property,
  InformationDesk,
  TouristicCategoryWithFeatures,
  TouristicContents,
  TouristicCategorie,
  Order,
} from '@app/interfaces/interfaces';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private apiUrl = `${environment.onlineBaseUrl}`;

  public filters$ = new BehaviorSubject<Filter[] | null>(null);
  public order$ = new BehaviorSubject<Order>('default');
  public orderGeolocation$ = new BehaviorSubject<number[]>([0,0]);
  public data$ = new BehaviorSubject<DataSetting[] | null>(null);

  constructor(public http: HttpClient, public storage: Storage, private translate: TranslateService) {}

  public loadSettings() {
    this.setOfflineSettings();

    this.getSettings().subscribe(async settings => {
      await this.storage.set('settings', JSON.stringify(settings));
      this.filters$.next(this.getFilters(settings));
      this.data$.next(settings.data);
    });
  }

  private async setOfflineSettings() {
    const defaultSettings = JSON.parse(await this.storage.get(`settings`));
    if (defaultSettings) {
      this.filters$.next(this.getFilters(defaultSettings));
      this.data$.next(defaultSettings.data);
    }
  }

  private getFilters(settings: Settings) {
    const filters: Filter[] = [];
    if (settings && settings.filters && settings.data) {
      settings.filters.forEach(filter => {
        const currentDataSetting = settings.data.find((data: DataSetting) => data.id === filter.id);
        if (currentDataSetting) {
          filter = { ...filter, ...currentDataSetting, values: [] };
          filter.values = currentDataSetting.values.map(value => ({
            ...value,
            checked: false,
          }));
          filters.push(filter);
        }
      });
    }

    return filters;
  }

  public getSettings(): Observable<Settings> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept-Language': this.translate.getDefaultLang(),
      }),
    };
    return this.http.get<Settings>(this.apiUrl + '/settings.json', httpOptions);
  }

  public saveFiltersState(filters: Filter[]): void {
    this.filters$.next(filters);
  }

  public saveOrderState(order: Order, geolocation?: null): void {
    this.order$.next(order);
    if (geolocation && geolocation !== null) {
      this.orderGeolocation$.next(geolocation)
    }
  }

  public resetFilters(): void {
    let filters = cloneDeep(this.filters$.getValue());
    if (!!filters) {
      filters.forEach(filter => {
        filter.values.forEach(value => (value.checked = false));
      });
    } else {
      filters = [];
    }
    this.saveFiltersState(filters);
  }

  private getValueForPropertyById(
    propertyName: string,
    id: number | string,
  ): Property | InformationDesk | TouristicCategorie | string {
    const dataSetting = this.data$.getValue();

    if (dataSetting) {
      const property = dataSetting.find(data => data.id === propertyName);
      if (property) {
        const propertyValue = property.values.find(value => value.id === id);
        if (propertyValue) {
          return propertyValue;
        } else {
          return { id: -1, name: '' };
        }
      }
    }

    return { id: -1, name: '' };
  }

  public getHydratedTrek(trek: Trek): HydratedTrek {
    const hydratedTrek: HydratedTrek = cloneDeep(trek) as any;

    if (trek.properties.difficulty) {
      hydratedTrek.properties.difficulty = this.getValueForPropertyById(
        'difficulty',
        trek.properties.difficulty,
      ) as Property;
    }

    if (trek.properties.practice) {
      hydratedTrek.properties.practice = this.getValueForPropertyById('practice', trek.properties.practice) as Property;
    }

    if (trek.properties.route) {
      hydratedTrek.properties.route = this.getValueForPropertyById('route', trek.properties.route) as Property;
    }

    if (trek.properties.departure_city) {
      hydratedTrek.properties.departure_city = this.getValueForPropertyById(
        'cities',
        trek.properties.departure_city,
      ) as Property;
    }

    if (trek.properties.arrival_city) {
      hydratedTrek.properties.arrival_city = this.getValueForPropertyById(
        'cities',
        trek.properties.arrival_city,
      ) as Property;
    }

    if (trek.properties.cities) {
      hydratedTrek.properties.cities = trek.properties.cities.map(
        city => this.getValueForPropertyById('cities', city) as Property,
      );
    }

    if (trek.properties.networks) {
      hydratedTrek.properties.networks = trek.properties.networks.map(
        network => this.getValueForPropertyById('networks', network) as Property,
      );
    }

    if (trek.properties.themes) {
      hydratedTrek.properties.themes = trek.properties.themes.map(
        theme => this.getValueForPropertyById('themes', theme) as Property,
      );
    }

    if (trek.properties.information_desks) {
      hydratedTrek.properties.information_desks.forEach(information_desk => {
        information_desk.type = this.getValueForPropertyById(
          'information_desk_types',
          information_desk.type as number,
        ) as Property;
      });
    }

    return hydratedTrek;
  }

  public getTouristicCategoriesWithFeatures(touristicContents: TouristicContents): TouristicCategoryWithFeatures[] {
    const touristicCategoriesWithFeatures: TouristicCategoryWithFeatures[] = [];
    const categories = touristicContents.features
      .map(touristicContent => touristicContent.properties.category)
      .filter((v, i, a) => a.indexOf(v) === i);
    categories.forEach(categoryId => {
      const category = this.getValueForPropertyById('touristiccontent_categories', categoryId) as TouristicCategorie;
      touristicCategoriesWithFeatures.push({
        id: categoryId,
        name: category ? category.name : '',
        features: touristicContents.features.filter(
          touristicContent => touristicContent.properties.category === categoryId,
        ),
      });
    });
    return touristicCategoriesWithFeatures;
  }
}
