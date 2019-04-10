import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MapboxOptions } from 'mapbox-gl';
import { BehaviorSubject, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import {
  MinimalTrek,
  MinimalTreks,
  Picture,
  Pois,
  Trek,
  TreksService,
  TouristicContents,
  TouristicEvents,
} from '@app/interfaces/interfaces';
import { CacheService } from '@app/services/cache/cache.service';
import { FilterTreksService } from '@app/services/filter-treks/filter-treks.service';
import { environment } from '@env/environment';

const cloneDeep = require('lodash.clonedeep');

@Injectable({
  providedIn: 'root',
})
export class OnlineTreksService implements TreksService {
  public offline = false;
  private apiUrl = `${environment.onlineBaseUrl}`;

  public treks$ = new BehaviorSubject<MinimalTreks | null>(null);
  public filteredTreks$: Observable<MinimalTrek[]>;
  public onlineTreksError$ = new BehaviorSubject<boolean | null>(null);

  constructor(
    private http: HttpClient,
    private cache: CacheService,
    private filterTreks: FilterTreksService,
    private translate: TranslateService,
  ) {
    this.filteredTreks$ = this.filterTreks.getFilteredTreks(this.treks$);
  }

  public loadTreks() {
    this.onlineTreksError$.next(null);
    this.getTreks().subscribe(
      data => {
        this.treks$.next(data);
      },
      error => {
        this.onlineTreksError$.next(error);
      },
    );
  }

  /* get the src of the image. if picture is not given, it returs the thumbnail */
  public getTrekImageSrc(trek: Trek, picture?: Picture): string {
    if (picture || trek.properties.first_picture) {
      return environment.onlineBaseUrl + (!!picture ? picture.url : trek.properties.first_picture.url);
    }
    return '';
  }

  public getCommonImgSrc(): string {
    return `${environment.onlineBaseUrl}`;
  }

  public getTreksUrl(): string {
    return '/app/tabs/treks';
  }

  public getTrekDetailsUrl(trekId: number): string {
    return `/app/tabs/treks/trek-details/${trekId}`;
  }

  public getTrekMapUrl(trekId: number): string {
    return `/app/map/${trekId}`;
  }

  public getTreksMapUrl(): string {
    return `/app/tabs/treks/treks-map/`;
  }

  private getTreks(): Observable<MinimalTreks> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept-Language': this.translate.getDefaultLang(),
      }),
    };

    return this.http.get<MinimalTreks>(`${this.apiUrl}/treks.geojson`, httpOptions);
  }

  public getTrekById(trekId: number): Observable<Trek> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept-Language': this.translate.getDefaultLang(),
      }),
    };
    return this.cache.get<Trek>(`${this.apiUrl}/${trekId}/trek.geojson`, httpOptions);
  }

  public getPoisForTrekById(trekId: number): Observable<Pois> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept-Language': this.translate.getDefaultLang(),
      }),
    };
    return this.cache.get<Pois>(`${this.apiUrl}/${trekId}/pois.geojson`, httpOptions);
  }

  public getTouristicContentsForTrekById(trekId: number): Observable<TouristicContents> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept-Language': this.translate.getDefaultLang(),
      }),
    };
    return this.cache.get<TouristicContents>(`${this.apiUrl}/${trekId}/touristic_contents.geojson`, httpOptions);
  }

  public getTouristicEventsForTrekById(trekId: number): Observable<TouristicEvents> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept-Language': this.translate.getDefaultLang(),
      }),
    };
    return this.cache.get<TouristicEvents>(`${this.apiUrl}/${trekId}/touristic_events.geojson`, httpOptions);
  }

  public getMinimalTrekById(trekId: number): MinimalTrek | undefined {
    const trek = this.treks$.getValue();
    if (!!trek) {
      return trek.features.find(feature => feature.properties.id === trekId);
    } else {
      return undefined;
    }
  }

  public getMapConfigForTrekById(trek: Trek): MapboxOptions {
    const mapConfig: MapboxOptions = { ...cloneDeep(environment.onlineMapConfig), zoom: environment.trekZoom.zoom };
    (mapConfig as any).bounds = trek.bbox as [number, number, number, number];
    (mapConfig as any).fitBoundsOptions = { padding: { top: 100, bottom: 100, left: 100, right: 100 } };
    mapConfig.center = undefined;

    return mapConfig;
  }
}
