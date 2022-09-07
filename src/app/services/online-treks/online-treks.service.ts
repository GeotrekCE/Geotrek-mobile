import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Preferences } from '@capacitor/preferences';

import {
  MinimalTrek,
  MinimalTreks,
  Picture,
  Pois,
  Trek,
  TreksService,
  TouristicContents,
  TouristicEvents
} from '@app/interfaces/interfaces';
import { FilterTreksService } from '@app/services/filter-treks/filter-treks.service';
import { environment } from '@env/environment';
import { cloneDeep } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class OnlineTreksService implements TreksService {
  public offline = false;
  private baseUrl = environment.mobileApiUrl;

  public treks$ = new BehaviorSubject<MinimalTreks | null>(null);
  public filteredTreks$!: Observable<MinimalTrek[]>;
  public onlineTreksError$ = new BehaviorSubject<boolean | null>(false);

  constructor(
    private http: HttpClient,
    private filterTreks: FilterTreksService,
    private translate: TranslateService
  ) {}

  public loadTreks() {
    return new Promise(async (resolve) => {
      this.filteredTreks$ = this.filterTreks.getFilteredTreks(this.treks$);
      this.getTreks().subscribe({
        next: async (value) => {
          this.onlineTreksError$.next(false);
          await Preferences.set({ key: 'treks', value: JSON.stringify(value) });
          this.treks$.next(value);
          resolve(true);
        },
        error: async () => {
          const treks = await this.getTreksFromStorage();
          if (treks) {
            this.onlineTreksError$.next(false);
            this.treks$.next(treks);
          } else {
            this.onlineTreksError$.next(true);
          }
          resolve(true);
        }
      });
    });
  }

  private async getTreksFromStorage() {
    const treks = JSON.parse((await Preferences.get({ key: `treks` })).value!);
    return treks;
  }

  public getTrekImageSrc(trek: Trek, picture?: Picture): string {
    if (picture || trek.properties.first_picture) {
      return (
        this.baseUrl +
        (!!picture ? picture.url : trek.properties.first_picture.url)
      );
    }
    return '';
  }

  public getCommonImgSrc(): string {
    return this.baseUrl;
  }

  public getTreksUrl(): string {
    return '/tabs/treks';
  }

  public getTrekDetailsUrl(trekId: number, parentId?: number): string {
    return !parentId
      ? `/trek-details/${trekId}`
      : `/trek-details/${parentId}/${trekId}`;
  }

  public getTrekMapUrl(trekId: number, parentId?: number): string {
    return !parentId ? `/map/${trekId}` : `/map/${parentId}/${trekId}`;
  }

  public getTreksMapUrl(): string {
    return `/treks-map/`;
  }

  private getTreks(): Observable<MinimalTreks> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept-Language': this.translate.getDefaultLang()
      })
    };

    return this.http.get<MinimalTreks>(
      `${this.baseUrl}/treks.geojson`,
      httpOptions
    );
  }

  public getTrekById(trekId: number, parentId?: number): Observable<Trek> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept-Language': this.translate.getDefaultLang()
      })
    };
    if (parentId) {
      return this.http.get<Trek>(
        `${this.baseUrl}/${parentId}/treks/${trekId}.geojson`,
        httpOptions
      );
    } else {
      return this.http.get<Trek>(
        `${this.baseUrl}/${trekId}/trek.geojson`,
        httpOptions
      );
    }
  }

  public getPoisForTrekById(
    trekId: number,
    parentId?: number
  ): Observable<Pois> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept-Language': this.translate.getDefaultLang()
      })
    };

    if (parentId) {
      return this.http.get<Pois>(
        `${this.baseUrl}/${parentId}/pois/${trekId}.geojson`,
        httpOptions
      );
    } else {
      return this.http.get<Pois>(
        `${this.baseUrl}/${trekId}/pois.geojson`,
        httpOptions
      );
    }
  }

  public getTouristicContentsForTrekById(
    trekId: number,
    parentId?: number
  ): Observable<TouristicContents> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept-Language': this.translate.getDefaultLang()
      })
    };
    if (parentId) {
      return this.http.get<TouristicContents>(
        `${this.baseUrl}/${parentId}/touristic_contents/${trekId}.geojson`,
        httpOptions
      );
    } else {
      return this.http.get<TouristicContents>(
        `${this.baseUrl}/${trekId}/touristic_contents.geojson`,
        httpOptions
      );
    }
  }

  public getTouristicEventsForTrekById(
    trekId: number,
    parentId?: number
  ): Observable<TouristicEvents> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept-Language': this.translate.getDefaultLang()
      })
    };
    if (parentId) {
      return this.http.get<TouristicEvents>(
        `${this.baseUrl}/${parentId}/touristic_events/${trekId}.geojson`,
        httpOptions
      );
    } else {
      return this.http.get<TouristicEvents>(
        `${this.baseUrl}/${trekId}/touristic_events.geojson`,
        httpOptions
      );
    }
  }

  public getMinimalTrekById(trekId: number): MinimalTrek | undefined {
    const trek = this.treks$.getValue();
    if (!!trek) {
      return trek.features.find((feature) => feature.properties.id === trekId);
    } else {
      return undefined;
    }
  }

  public getMapConfigForTrekById(trek: Trek): any {
    const mapConfig: any = {
      ...cloneDeep(environment.onlineMapConfig),
      zoom: environment.trekZoom.zoom
    };
    (mapConfig as any).trekBounds = (trek as any).bbox as [
      number,
      number,
      number,
      number
    ];
    mapConfig.center = undefined;

    return mapConfig;
  }
}
