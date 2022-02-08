import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GeoJSON } from 'geojson';

import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Platform } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';
import { BehaviorSubject, Observable } from 'rxjs';
import { cloneDeep } from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Globalization } from '@ionic-native/globalization/ngx';

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
  Order
} from '@app/interfaces/interfaces';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private apiUrl = `${environment.onlineBaseUrl}`;

  public filters$ = new BehaviorSubject<Filter[] | null>(null);
  public order$ = new BehaviorSubject<{
    type: Order;
    value: number[] | undefined;
  } | null>(null);
  public userLocation$ = new BehaviorSubject<number[]>([0, 0]);
  public data$ = new BehaviorSubject<DataSetting[] | null>(null);

  constructor(
    public http: HttpClient,
    public storage: Storage,
    private platform: Platform,
    private network: Network,
    private translate: TranslateService,
    private statusBar: StatusBar,
    private globalization: Globalization
  ) {}

  public initializeSettings(): Promise<any> {
    return new Promise(async (resolve) => {
      this.platform.ready().then(async () => {
        let defaultLanguage;

        if (this.platform.is('ios') || this.platform.is('android')) {
          defaultLanguage = (
            await this.globalization.getPreferredLanguage()
          ).value.slice(0, 2);
          this.statusBar.styleLightContent();
        } else {
          defaultLanguage = navigator.language.slice(0, 2);
        }

        if (
          environment.availableLanguage &&
          environment.availableLanguage.length > 0
        ) {
          if (environment.availableLanguage.indexOf(defaultLanguage) === -1) {
            defaultLanguage = environment.availableLanguage[0];
          }
        } else {
          defaultLanguage = 'fr';
        }

        this.translate.setDefaultLang(defaultLanguage);

        await this.storage.create();

        await this.loadSettings();

        resolve(true);
      });
    });
  }

  public loadSettings() {
    return new Promise(async (resolve) => {
      this.setOfflineSettings();

      this.getSettings().subscribe({
        next: async (value) => {
          await this.storage.set('settings', JSON.stringify(value));
          this.filters$.next(this.getFilters(value));
          this.data$.next(value.data);
          resolve(true);
        },
        error: () => {
          resolve(true);
        }
      });

      this.getZoneFromUrl().subscribe({
        next: async (value) => {
          await this.storage.set('zone', JSON.stringify(value));
        },
        error: async () => {
          if (
            ((this.platform.is('ios') || this.platform.is('android')) &&
              this.network.type !== 'none') ||
            (!this.platform.is('ios') && !this.platform.is('android'))
          ) {
            await this.storage.remove('zone');
          }
        }
      });
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
      settings.filters.forEach((filter) => {
        const currentDataSetting = settings.data.find(
          (data: DataSetting) => data.id === filter.id
        );
        if (currentDataSetting) {
          filter = { ...filter, ...currentDataSetting, values: [] };
          filter.values = currentDataSetting.values.map((value) => ({
            ...value,
            checked: false
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
        'Accept-Language': this.translate.getDefaultLang()
      })
    };
    return this.http.get<Settings>(this.apiUrl + '/settings.json', httpOptions);
  }

  public getZoneFromUrl(): Observable<GeoJSON> {
    return this.http.get<GeoJSON>(this.apiUrl + '/contour/contour.geojson');
  }

  public async getZoneFromStorage() {
    const zone = JSON.parse(await this.storage.get('zone'));
    return zone
      ? zone
      : {
          type: 'FeatureCollection',
          features: []
        };
  }

  public saveFiltersState(filters: Filter[]): void {
    this.filters$.next(filters);
  }

  public saveOrderState(order: Order, geolocation?: number[]): void {
    this.order$.next({ type: order, value: geolocation });
  }

  public resetFilters(): void {
    let filters = cloneDeep(this.filters$.getValue());
    if (!!filters) {
      filters.forEach((filter) => {
        filter.values.forEach((value) => (value.checked = false));
      });
    } else {
      filters = [];
    }
    this.saveFiltersState(filters);
  }

  private getValueForPropertyById(
    propertyName: string,
    id: number | string
  ): Property | InformationDesk | TouristicCategorie | string {
    const dataSetting = this.data$.getValue();

    if (dataSetting) {
      const property = dataSetting.find((data) => data.id === propertyName);
      if (property) {
        const propertyValue = property.values.find((value) => value.id === id);
        if (propertyValue) {
          return propertyValue;
        } else {
          return { id: -1, name: '' };
        }
      }
    }

    return { id: -1, name: '' };
  }

  public getHydratedTrek(trek: Trek, commonSrc: string): HydratedTrek {
    const hydratedTrek: HydratedTrek = cloneDeep(trek) as any;

    if (trek.properties.difficulty) {
      hydratedTrek.properties.difficulty = this.getValueForPropertyById(
        'difficulty',
        trek.properties.difficulty
      ) as Property;
    }

    if (trek.properties.practice) {
      hydratedTrek.properties.practice = this.getValueForPropertyById(
        'practice',
        trek.properties.practice
      ) as Property;
    }

    if (trek.properties.route) {
      hydratedTrek.properties.route = this.getValueForPropertyById(
        'route',
        trek.properties.route
      ) as Property;
    }

    if (trek.properties.departure_city) {
      hydratedTrek.properties.departure_city = this.getValueForPropertyById(
        'cities',
        trek.properties.departure_city
      ) as Property;
    }

    if (trek.properties.arrival_city) {
      hydratedTrek.properties.arrival_city = this.getValueForPropertyById(
        'cities',
        trek.properties.arrival_city
      ) as Property;
    }

    if (trek.properties.cities) {
      hydratedTrek.properties.cities = trek.properties.cities.map(
        (city) => this.getValueForPropertyById('cities', city) as Property
      );
    }

    if (trek.properties.networks) {
      hydratedTrek.properties.networks = trek.properties.networks.map(
        (network) =>
          this.getValueForPropertyById('networks', network) as Property
      );
    }

    if (trek.properties.themes) {
      hydratedTrek.properties.themes = trek.properties.themes.map(
        (theme) => this.getValueForPropertyById('themes', theme) as Property
      );
    }

    if (trek.properties.information_desks) {
      hydratedTrek.properties.information_desks.forEach((information_desk) => {
        information_desk.type = this.getValueForPropertyById(
          'information_desk_types',
          information_desk.type as number
        ) as Property;
      });
    }

    const regexp = new RegExp(`src="${this.apiUrl}`, 'gi');

    if (trek.properties.description) {
      hydratedTrek.properties.description = trek.properties.description
        .replace(regexp, 'src="')
        .replace(/src\=\"\//gi, `src="${commonSrc}/`);
    }

    if (trek.properties.advice) {
      hydratedTrek.properties.advice = trek.properties.advice
        .replace(regexp, 'src="')
        .replace(/src\=\"\//gi, `src="${commonSrc}/`);
    }

    return hydratedTrek;
  }

  public getTouristicCategoriesWithFeatures(
    touristicContents: TouristicContents
  ): TouristicCategoryWithFeatures[] {
    const touristicCategoriesWithFeatures: TouristicCategoryWithFeatures[] = [];
    if (touristicContents && Array.isArray(touristicContents.features)) {
      const categories = touristicContents.features
        .map((touristicContent) => touristicContent.properties.category)
        .filter((v, i, a) => a.indexOf(v) === i);
      categories.forEach((categoryId) => {
        const category = this.getValueForPropertyById(
          'touristiccontent_categories',
          categoryId
        ) as TouristicCategorie;
        touristicCategoriesWithFeatures.push({
          id: categoryId,
          name: category ? category.name : '',
          features: touristicContents.features.filter(
            (touristicContent) =>
              touristicContent.properties.category === categoryId
          )
        });
      });
    }

    return touristicCategoriesWithFeatures;
  }
}
