import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { Device } from '@capacitor/device';
import { TextZoom } from '@capacitor/text-zoom';
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { BehaviorSubject, from } from 'rxjs';
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
  Order
} from '@app/interfaces/interfaces';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private baseUrl = environment.mobileApiUrl;

  public filters$ = new BehaviorSubject<Filter[] | null>(null);
  public outdoorPractices$ = new BehaviorSubject<Filter[] | null>(null);
  public order$ = new BehaviorSubject<{
    type: Order;
    value: number[] | undefined;
  } | null>(null);
  public userLocation$ = new BehaviorSubject<number[]>([0, 0]);
  public data$ = new BehaviorSubject<DataSetting[] | null>(null);
  public settingsError$ = new BehaviorSubject<boolean | null>(false);

  constructor(
    private platform: Platform,
    private translate: TranslateService
  ) {}

  public initializeSettings(): Promise<any> {
    return new Promise(async (resolve) => {
      this.platform.ready().then(async () => {
        let defaultLanguage;
        try {
          if (this.platform.is('ios') || this.platform.is('android')) {
            defaultLanguage = (await Device.getLanguageCode()).value;
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
        } catch (error) {
          defaultLanguage = 'fr';
        }

        try {
          if (this.platform.is('ios') || this.platform.is('android')) {
            const textZoomPreferred = await TextZoom.getPreferred();
            await TextZoom.set({ value: textZoomPreferred.value });
          }
        } catch (error) {
          await TextZoom.set({ value: 1 });
        }

        this.translate.setDefaultLang(defaultLanguage);

        await this.loadSettings();

        resolve(true);
      });
    });
  }

  public loadSettings() {
    return new Promise(async (resolve) => {
      from(this.getSettings()).subscribe({
        next: async (value) => {
          this.settingsError$.next(false);
          await Preferences.set({
            key: 'settings',
            value: JSON.stringify(value.data)
          });
          this.filters$.next(this.getFilters(value.data));
          this.data$.next(value.data.data);
          resolve(true);
        },
        error: async () => {
          const settings = await this.getSettingsFromStorage();
          if (settings) {
            this.settingsError$.next(false);
            this.filters$.next(this.getFilters(settings));
            this.data$.next(settings.data);
          } else {
            this.settingsError$.next(true);
          }
          resolve(true);
        }
      });

      from(this.getZoneFromUrl()).subscribe({
        next: async (value) => {
          await Preferences.set({
            key: 'zone',
            value: JSON.stringify(value.data)
          });
        },
        error: () => {
          return true;
        }
      });
    });
  }

  private async getSettingsFromStorage() {
    const defaultSettings = JSON.parse(
      (await Preferences.get({ key: `settings` })).value!
    );
    return defaultSettings;
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

  public getSettings(): Promise<HttpResponse> {
    const httpOptions = {
      method: 'GET',
      url: this.baseUrl + '/settings.json',
      headers: {
        'Accept-Language': this.translate.getDefaultLang()
      }
    };
    return CapacitorHttp.request(httpOptions);
  }

  public getZoneFromUrl(): Promise<HttpResponse> {
    const httpOptions = {
      method: 'GET',
      url: this.baseUrl + '/contour/contour.geojson',
      headers: {
        'Accept-Language': this.translate.getDefaultLang()
      }
    };
    return CapacitorHttp.request(httpOptions);
  }

  public async getZoneFromStorage() {
    const zone = JSON.parse((await Preferences.get({ key: 'zone' })).value!);
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

    const regexp = new RegExp(`src="${this.baseUrl}`, 'gi');

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

  public loadOutdoorPractices(): Promise<any> {
    return new Promise(async (resolve) => {
      from(this.getOutdoorPractices()).subscribe({
        next: async (value) => {
          await Preferences.set({
            key: 'outdoorPractices',
            value: JSON.stringify(value.data.results)
          });
          this.outdoorPractices$.next(value.data.results);
          resolve(true);
        },
        error: async () => {
          const outdoorPractices = await this.getOutdoorPracticesFromStorage();
          if (outdoorPractices) {
            this.outdoorPractices$.next(outdoorPractices);
          }
          resolve(true);
        }
      });
    });
  }

  public getOutdoorPractices(): Promise<HttpResponse> {
    const httpOptions = {
      method: 'GET',
      url: `${environment.adminApiUrl}/v2/outdoor_practice/?language=fr${environment.enableOutdoorPracticesShortcuts && (environment.enableOutdoorPracticesShortcuts as any).portals.length > 0 ? `&portals=${(environment.enableOutdoorPracticesShortcuts as any).portals.join(',')}` : ''}&page_size=999`,
      headers: {
        'Accept-Language': this.translate.getDefaultLang()
      }
    };

    return CapacitorHttp.request(httpOptions);
  }

  private async getOutdoorPracticesFromStorage() {
    const treks = JSON.parse(
      (await Preferences.get({ key: `outdoorPractices` })).value!
    );
    return treks;
  }
}
