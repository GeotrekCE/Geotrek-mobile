import { HttpClient, HttpEventType, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MapboxOptions } from 'mapbox-gl';
import { File } from '@ionic-native/file/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Zip } from '@ionic-native/zip/ngx';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { BehaviorSubject, from, Observable, throwError, of, forkJoin } from 'rxjs';
import {
  catchError,
  map,
  mergeMap,
  tap,
  delayWhen,
  last,
  delay,
  concatAll,
  switchMapTo,
  share,
  count,
  scan,
  withLatestFrom,
  concatMap,
} from 'rxjs/operators';

import { environment } from '@env/environment';
import { FilterTreksService } from '@app/services/filter-treks/filter-treks.service';
import { OnlineTreksService } from '@app/services/online-treks/online-treks.service';
import {
  MinimalTrek,
  MinimalTreks,
  Picture,
  Poi,
  Pois,
  Trek,
  TreksService,
  TouristicContents,
  TouristicEvents,
} from '@app/interfaces/interfaces';

const cloneDeep = require('lodash.clonedeep');

@Injectable({
  providedIn: 'root',
})
export class OfflineTreksService implements TreksService {
  public offline = false;
  public treks$ = new BehaviorSubject<MinimalTreks | null>(null);
  public filteredTreks$: Observable<MinimalTrek[]>;
  public currentProgressDownload$: BehaviorSubject<number> = new BehaviorSubject(0);

  public mediaDownloadProgress = 0;
  public trekDownloadProgress = 0;

  private zipUrl = `${environment.onlineBaseUrl}`;
  private isMobile: boolean;

  constructor(
    private platform: Platform,
    private file: File,
    private filterTreks: FilterTreksService,
    private zip: Zip,
    private http: HttpClient,
    private storage: Storage,
    private webview: WebView,
    private onlineTreksService: OnlineTreksService,
  ) {
    this.isMobile = this.platform.is('ios') || this.platform.is('android');
    this.filteredTreks$ = this.filterTreks.getFilteredTreks(this.treks$);
    this.getTreks().subscribe(treks => {
      this.treks$.next(treks);
    });
  }

  /* get the src of the image. if picture is not given, it returs the thumbnail */
  public getTrekImageSrc(trek: Trek, picture?: Picture): string {
    if (picture || trek.properties.first_picture) {
      const imgPath = !!picture ? picture.url : trek.properties.first_picture.url;
      if (this.isMobile) {
        return this.webview.convertFileSrc(`${this.getDirLocalDataLocation()}offline/${imgPath}`);
      } else {
        return `${environment.onlineBaseUrl}${imgPath}`;
      }
    }
    return '';
  }

  public getCommonImgSrc(): string {
    if (this.isMobile) {
      return this.webview.convertFileSrc(`${this.getDirLocalDataLocation()}offline`);
    } else {
      return `${environment.onlineBaseUrl}`;
    }
  }

  public getTreksUrl(): string {
    return '/app/tabs/treks-offline';
  }

  public getTrekDetailsUrl(trekId: number, parentId?: number): string {
    return !parentId
      ? `/app/tabs/treks-offline/trek-details/${trekId}`
      : `/app/tabs/treks-offline/trek-details/${parentId}/${trekId}`;
  }

  public getTrekMapUrl(trekId: number, parentId?: number): string {
    return !parentId ? `/app/map-offline/${trekId}` : `/app/map-offline/${parentId}/${trekId}`;
  }

  public getTreksMapUrl(): string {
    return `/app/tabs/treks-offline/treks-map/`;
  }

  private getTreks(): Observable<MinimalTreks> {
    const emptyTreks = <MinimalTreks>{
      type: 'FeatureCollection',
      name: 'OFFLINE-TREKS',
      features: [],
    };

    return from(this.storage.get('offline-treks')).pipe(
      map((jsonTreks: string): MinimalTreks => JSON.parse(jsonTreks)),
      map((treks: MinimalTreks) => (!!treks ? treks : emptyTreks)),
    );
  }

  public createNewProgressStream() {
    this.trekDownloadProgress = 0;
    this.mediaDownloadProgress = 0;
    this.currentProgressDownload$.next(0);
  }

  public saveTrek(
    simpleTrek: MinimalTrek,
    fullTrek: Trek,
    pois: Poi[],
    touristicContents: TouristicContents,
  ): Observable<boolean> {
    const trekId = simpleTrek.properties.id;
    const newTreks: MinimalTreks = cloneDeep(this.treks$.getValue());
    newTreks.features = [...newTreks.features.filter(feature => feature.properties.id !== trekId)];
    newTreks.features.push(simpleTrek);

    // update treks
    this.treks$.next(newTreks);
    const storage = this.storage;
    const tasks: Observable<any>[] = [
      from(storage.set('offline-treks', JSON.stringify(newTreks))),
      // save full trek
      from(storage.set(`trek-${trekId}`, JSON.stringify(fullTrek))),
      // save json poi
      from(storage.set(`pois-trek-${trekId}`, JSON.stringify(pois))),
      // save touristic contents
      from(storage.set(`touristicContents-trek-${trekId}`, JSON.stringify(touristicContents))),
    ];

    if (
      fullTrek.properties.children &&
      fullTrek.properties.children.features &&
      fullTrek.properties.children.features.length > 0
    ) {
      // save all json for children treks
      // trek pois touristicContents
      fullTrek.properties.children.features.forEach(children => {
        tasks.push(
          this.onlineTreksService.getTrekById(children.properties.id, trekId).pipe(
            map(childrenJson => {
              return from(storage.set(`trek-${trekId}-${children.properties.id}`, JSON.stringify(childrenJson)));
            }),
          ),
        );
        tasks.push(
          this.onlineTreksService.getPoisForTrekById(children.properties.id, trekId).pipe(
            map(childrenJson => {
              return from(storage.set(`pois-trek-${trekId}-${children.properties.id}`, JSON.stringify(childrenJson)));
            }),
          ),
        );

        tasks.push(
          this.onlineTreksService.getTouristicContentsForTrekById(children.properties.id, trekId).pipe(
            map(childrenJson => {
              return from(
                storage.set(`touristicContents-trek-${trekId}-${children.properties.id}`, JSON.stringify(childrenJson)),
              );
            }),
          ),
        );
      });
    }

    if (this.isMobile) {
      if (this.treks$.value && this.treks$.value.features.length === 1) {
        // download common media too if it's first downloaded trek
        tasks.push(this.saveCommonMedia());
      }
      tasks.push(this.saveMediaForTrek(trekId));
    } else {
      tasks.push(this.fakeMediaDl());
    }

    return forkJoin(tasks).pipe(
      map(e => {
        return true;
      }),
      catchError(e => {
        this.removeTrek(trekId, false);
        return throwError(false);
      }),
    );
  }

  fakeMediaDl() {
    const requestOne = of(1).pipe(delay(1000));
    const requestTwo = of(2).pipe(delay(1000));
    const requestThree = of(3).pipe(delay(1000));
    const requestFour = of(4).pipe(delay(1000));
    const requestFive = of(5).pipe(delay(1000));
    const observables: Array<Observable<number>> = [requestOne, requestTwo, requestThree, requestFour, requestFive];
    const array$ = from(observables);
    const requests$ = array$.pipe(concatAll());
    const progress$ = of(true).pipe(
      switchMapTo(requests$),
      share(),
    );

    const count$ = array$.pipe(count());

    const ratio$ = progress$.pipe(
      scan(current => current + 1, 0),
      withLatestFrom(count$, (current, nb) => current / nb),
    );

    of(true)
      .pipe(switchMapTo(ratio$))
      .subscribe(currentProgress => {
        this.currentProgressDownload$.next(currentProgress);
      });

    return of(true).pipe(delay(6000));
  }

  private updateProgress(event: any, progress: any, type: string) {
    switch (event.type) {
      case HttpEventType.DownloadProgress:
        if (type === 'media') {
          this.mediaDownloadProgress = event.loaded / event.total;
        } else {
          this.trekDownloadProgress = event.loaded / event.total;
        }

        const nbProgress = this.trekDownloadProgress > 0 && this.mediaDownloadProgress > 0 ? 2 : 1;
        const currentProgress = this.trekDownloadProgress + this.mediaDownloadProgress;
        if (currentProgress / nbProgress < 1) {
          this.currentProgressDownload$.next(currentProgress / nbProgress);
        } else {
          this.currentProgressDownload$.next(1);
        }

        return progress;

      case HttpEventType.Response:
        return event.body;

      default:
        return false;
    }
  }

  private saveCommonMedia() {
    const offlineZipDownloadUrl = `${this.zipUrl}/global.zip`;
    const offlineUriLocation = `${this.getDirLocalDataLocation()}offline/`;
    const offlineZipUri = `${this.getDirLocalDataLocation()}zip/`;
    const req = new HttpRequest('GET', offlineZipDownloadUrl, {
      responseType: 'blob',
      reportProgress: true,
    });

    return this.http.request(req).pipe(
      map((event, file) => this.updateProgress(event, file, 'media')),
      last(),
      delayWhen(() => {
        return from(this.createDirIfNotExists('zip'));
      }),

      // create offline folder if not exist
      delayWhen(() => {
        return from(this.createDirIfNotExists('offline'));
      }),

      // write zip file inside zip folder
      delayWhen(zipFile => {
        return from(this.file.writeFile(offlineZipUri, `media.zip`, zipFile, { replace: true })).pipe(
          tap(() => {}),
          catchError(error => throwError(new Error('Error while writing zip'))),
        );
      }),

      // unzip file inside offline folder
      delayWhen(() => {
        return from(this.zip.unzip(`${offlineZipUri}media.zip`, offlineUriLocation)).pipe(
          tap(unzipResult => {
            if (unzipResult === -1) {
              throw new Error('Error while unziping');
            }
          }),
          catchError(error => throwError(new Error('Error while unziping'))),
        );
      }),

      // delete zip file
      delayWhen(() => {
        return from(this.file.removeFile(offlineZipUri, `media.zip`));
      }),
      map(() => {}),
    );
  }

  private saveMediaForTrek(trekId: number) {
    const offlineZipDownloadUrl = `${this.zipUrl}/${trekId}.zip`;
    const offlineUriLocation = `${this.getDirLocalDataLocation()}offline/`;
    const offlineZipUri = `${this.getDirLocalDataLocation()}zip/`;

    const req = new HttpRequest('GET', offlineZipDownloadUrl, {
      responseType: 'blob',
      reportProgress: true,
    });

    return this.http.request(req).pipe(
      map((event, file) => this.updateProgress(event, file, 'trek')),
      last(),
      // create zip folder if not exist
      delayWhen(() => from(this.createDirIfNotExists('zip'))),

      // create offline folder if not exist
      delayWhen(() => from(this.createDirIfNotExists('offline'))),

      // write zip file inside zip folder
      delayWhen(zipFile =>
        from(this.file.writeFile(offlineZipUri, `${trekId}.zip`, zipFile, { replace: true })).pipe(
          catchError(error => throwError(new Error('Error while writing zip'))),
        ),
      ),

      // unzip file inside offline folder
      delayWhen(() =>
        from(this.zip.unzip(`${offlineZipUri}${trekId}.zip`, offlineUriLocation)).pipe(
          tap(unzipResult => {
            if (unzipResult === -1) {
              throw new Error('Error while unziping');
            }
          }),
          catchError(error => throwError(new Error('Error while unziping'))),
        ),
      ),

      // delete zip file
      delayWhen(() => from(this.file.removeFile(offlineZipUri, `${trekId}.zip`))),
      map(() => {}),
    );
  }

  public removeTrek(trekId: number, withMedia: boolean): Observable<any> {
    const treks = <MinimalTreks>cloneDeep(this.treks$.value);
    const storage = this.storage;
    treks.features = [...treks.features.filter(feature => feature.properties.id !== trekId)];

    // update treks
    this.treks$.next(treks);

    const tasks: Observable<any>[] = [];
    tasks.push(from(storage.set('offline-treks', JSON.stringify(treks))));
    tasks.push(from(storage.remove(`pois-trek-${trekId}`)));
    tasks.push(from(storage.remove(`touristicContents-trek-${trekId}`)));

    let stream: Observable<any> = forkJoin(
      // remove json data
      tasks,
    ).pipe(map(() => true));

    if (this.isMobile && withMedia) {
      stream = stream.pipe(mergeMap(() => this.removeMedia(trekId)));
    }

    stream = stream.pipe(mergeMap(() => from(this.storage.get(`trek-${trekId}`))));

    stream = stream.pipe(
      concatMap((jsonTrek: any) => {
        const trek: Trek = JSON.parse(jsonTrek);
        if (trek.properties.children && trek.properties.children.features.length > 0) {
          const childrenToRemove: Observable<any>[] = [];
          trek.properties.children.features.forEach(children => {
            childrenToRemove.push(from(storage.remove(`trek-${trekId}-${children.properties.id}`)));
            childrenToRemove.push(from(storage.remove(`pois-trek-${trekId}-${children.properties.id}`)));
            childrenToRemove.push(from(storage.remove(`touristicContents-trek-${trekId}-${children.properties.id}`)));
          });
          return childrenToRemove;
        } else {
          return from([]);
        }
      }),
    );

    stream = stream.pipe(mergeMap(() => from(storage.remove(`trek-${trekId}`))));
    stream = stream.pipe(catchError(() => throwError(false)));

    return stream;
  }

  private removeMedia(trekId: number): Observable<boolean> {
    const offlineUriLocation = `${this.getDirLocalDataLocation()}offline/`;
    return from(this.file.removeRecursively(offlineUriLocation, `${trekId}`)).pipe(
      map(removeResult => {
        if (!removeResult || !removeResult.success) {
          throw new Error('Error while deleting media');
        } else {
          return true;
        }
      }),
    );
  }

  public getTrekById(trekId: number, parentId?: number): Observable<Trek> {
    if (parentId) {
      return from(this.storage.get(`trek-${parentId}-${trekId}`)).pipe(map((jsonTrek: string) => JSON.parse(jsonTrek)));
    } else {
      return from(this.storage.get(`trek-${trekId}`)).pipe(map((jsonTrek: string) => JSON.parse(jsonTrek)));
    }
  }

  public getPoisForTrekById(trekId: number, parentId: number): Observable<Pois> {
    const path = parentId ? `pois-trek-${parentId}-${trekId}` : `pois-trek-${trekId}`;
    return from(this.storage.get(path)).pipe(
      map((jsonPois: string) => {
        return JSON.parse(jsonPois) as Poi[];
      }),
      map(
        (pois: Poi[]) =>
          ({
            type: 'FeatureCollection',
            features: pois ? pois : [],
          } as Pois),
      ),
    );
  }

  public getTouristicContentsForTrekById(trekId: number, parentId: number): Observable<TouristicContents> {
    const path = parentId ? `touristicContents-trek-${parentId}-${trekId}` : `touristicContents-trek-${trekId}`;

    return from(this.storage.get(path)).pipe(map((jsonTouristicContents: string) => JSON.parse(jsonTouristicContents)));
  }

  public getTouristicEventsForTrekById(trekId: number, parentId: number): Observable<TouristicEvents> {
    const path = parentId ? `pois-trek-${parentId}-${trekId}` : `pois-trek-${trekId}`;

    return from(this.storage.get(path)).pipe(
      map((jsonPois: string) => JSON.parse(jsonPois)),
      map(
        TouristicEventsItems =>
          ({
            type: 'FeatureCollection',
            features: TouristicEventsItems ? TouristicEventsItems : [],
          } as TouristicEvents),
      ),
    );
  }

  private async createDirIfNotExists(dirName: string) {
    const dirDataLocation = this.getDirLocalDataLocation();

    try {
      await this.file.checkDir(dirDataLocation, dirName);
    } catch (check) {
      if (check.code === 1) {
        await this.file.createDir(dirDataLocation, dirName, false);
      }
    }
  }

  private getDirLocalDataLocation() {
    return `${this.file.applicationStorageDirectory}${this.platform.is('ios') ? 'Documents/' : ''}`;
  }

  public getMapConfigForTrekById(trek: Trek, isOffline: boolean): MapboxOptions {
    let mapConfig: MapboxOptions;

    if (isOffline && this.isMobile) {
      mapConfig = { ...cloneDeep(environment.offlineMapConfig), zoom: environment.trekZoom.zoom };

      if (mapConfig.style && typeof mapConfig.style !== 'string' && mapConfig.style.sources) {
        (mapConfig.style as any).sources['tiles-background'].tiles[0] =
          this.getCommonImgSrc() + (environment.offlineMapConfig.style as any).sources['tiles-background'].tiles[0];

        mapConfig.style.sources['tiles-background-trek'] = {
          ...mapConfig.style.sources['tiles-background'],
          tiles: [
            this.getTilesDirectoryForTrekById(trek.properties.id, mapConfig.style.sources['tiles-background'].type),
          ],
        } as any;

        if (mapConfig.style.layers) {
          mapConfig.style.layers.push({
            id: 'tiles-background-trek',
            type: 'raster',
            source: 'tiles-background-trek',
            minzoom: environment.trekZoom.minZoom,
            maxzoom: environment.trekZoom.maxZoom,
          });
        }
      }
    } else {
      mapConfig = { ...cloneDeep(environment.onlineMapConfig), zoom: environment.trekZoom.zoom };
    }

    (mapConfig as any).bounds = trek.bbox as [number, number, number, number];
    (mapConfig as any).fitBoundsOptions = { padding: { top: 100, bottom: 100, left: 100, right: 100 } };
    mapConfig.center = undefined;

    return mapConfig;
  }

  private getTilesDirectoryForTrekById(trekId: number, type: string): string {
    if (type === 'raster') {
      return `${this.webview.convertFileSrc(this.getDirLocalDataLocation())}offline/${trekId}/tiles/{z}/{x}/{y}.png`;
    } else {
      return `${this.getDirLocalDataLocation()}offline/${trekId}/tiles/{z}/{x}/{y}.pbf`;
    }
  }
}
