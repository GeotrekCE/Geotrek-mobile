import { Http } from '@capacitor-community/http';
import { Injectable } from '@angular/core';
import { ZipPlugin } from 'capacitor-zip';
import { Platform } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import {
  BehaviorSubject,
  from,
  Observable,
  throwError,
  of,
  forkJoin
} from 'rxjs';
import {
  catchError,
  map,
  mergeMap,
  tap,
  delay,
  concatAll,
  switchMapTo,
  share,
  count,
  scan,
  withLatestFrom,
  concatMap
} from 'rxjs/operators';
import { cloneDeep } from 'lodash';

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
  TreksServiceOffline,
  TouristicContents,
  TouristicEvents
} from '@app/interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class OfflineTreksService implements TreksServiceOffline {
  public offline = false;
  public treks$ = new BehaviorSubject<MinimalTreks | null>(null);
  public filteredTreks$: Observable<MinimalTrek[]>;
  public currentProgressDownload$: BehaviorSubject<number> =
    new BehaviorSubject(0);
  public baseUrl = environment.mobileApiUrl;
  private isMobile: boolean;
  private commonMediaContentLength = 0;
  private trekContentLength = 0;
  private commonMediaBytes = 0;
  private trekBytes = 0;

  constructor(
    private platform: Platform,
    private filterTreks: FilterTreksService,
    private onlineTreksService: OnlineTreksService
  ) {
    this.isMobile = this.platform.is('ios') || this.platform.is('android');
    this.filteredTreks$ = this.filterTreks.getFilteredTreks(this.treks$);
    this.getTreks().subscribe((treks) => {
      this.treks$.next(treks);
    });
  }

  public async getTrekImageSrc(trek: Trek, picture?: Picture): Promise<string> {
    if (picture || trek.properties.first_picture) {
      const imgPath = !!picture
        ? picture.url
        : trek.properties.first_picture.url;

      if (this.isMobile && !imgPath.startsWith('assets')) {
        const imgUri = await Filesystem.getUri({
          directory: Directory.Data,
          path: `offline/${imgPath}`
        });
        return Capacitor.convertFileSrc(imgUri.uri);
      } else {
        return imgPath;
      }
    }
    return 'offline/';
  }

  public async getCommonImgSrc(): Promise<string> {
    if (this.isMobile) {
      const imgUri = await Filesystem.getUri({
        directory: Directory.Data,
        path: `offline`
      });
      return Capacitor.convertFileSrc(imgUri.uri);
    } else {
      return this.baseUrl;
    }
  }

  public getTreksUrl(): string {
    return '/tabs/treks-offline';
  }

  public getTrekDetailsUrl(trekId: number, parentId?: number): string {
    return !parentId
      ? `/trek-details-offline/${trekId}`
      : `/trek-details-offline/${parentId}/${trekId}`;
  }

  public getTrekMapUrl(trekId: number, parentId?: number): string {
    return !parentId
      ? `/map-offline/${trekId}`
      : `/map-offline/${parentId}/${trekId}`;
  }

  public getTreksMapUrl(): string {
    return `/treks-offline-map/`;
  }

  private getTreks(): Observable<MinimalTreks> {
    const emptyTreks = <MinimalTreks>{
      type: 'FeatureCollection',
      name: 'OFFLINE-TREKS',
      features: []
    };

    return from(Preferences.get({ key: 'offline-treks' })).pipe(
      map(({ value }) => JSON.parse(value!)),
      map((treks: MinimalTreks) => (!!treks ? treks : emptyTreks))
    );
  }

  public createNewProgressStream() {
    this.currentProgressDownload$.next(0);
  }

  public willDownloadCommonMedia() {
    return this.treks$.value && this.treks$.value.features.length === 0;
  }

  public saveTrek(
    simpleTrek: MinimalTrek,
    fullTrek: Trek,
    pois: Poi[],
    touristicContents: TouristicContents
  ): Observable<boolean> {
    this.commonMediaContentLength = 0;
    this.trekContentLength = 0;
    this.commonMediaBytes = 0;
    this.trekBytes = 0;
    const trekId = simpleTrek.properties.id;
    const newTreks: MinimalTreks = cloneDeep(this.treks$.getValue())!;
    newTreks.features = [
      ...newTreks.features.filter((feature) => feature.properties.id !== trekId)
    ];
    newTreks.features.push(simpleTrek);

    this.treks$.next(newTreks);
    const tasks: Observable<any>[] = [
      from(
        Filesystem.mkdir({ path: 'zip', directory: Directory.Data }).catch(
          () => true
        )
      ),
      from(
        Filesystem.mkdir({ path: 'offline', directory: Directory.Data }).catch(
          () => true
        )
      )
    ];

    if (this.isMobile) {
      if (this.treks$.value && this.treks$.value.features.length === 1) {
        tasks.push(this.saveCommonMedia());
      }
      tasks.push(this.saveMediaForTrek(trekId));
    } else {
      tasks.push(this.fakeMediaDl());
    }

    tasks.push(
      from(
        Preferences.set({
          key: 'offline-treks',
          value: JSON.stringify(newTreks)
        })
      ),
      from(
        Preferences.set({
          key: `trek-${trekId}`,
          value: JSON.stringify(fullTrek)
        })
      ),
      from(
        Preferences.set({
          key: `pois-trek-${trekId}`,
          value: JSON.stringify(pois)
        })
      ),
      from(
        Preferences.set({
          key: `touristicContents-trek-${trekId}`,
          value: JSON.stringify(touristicContents)
        })
      )
    );

    if (
      fullTrek.properties.children &&
      fullTrek.properties.children.features &&
      fullTrek.properties.children.features.length > 0
    ) {
      fullTrek.properties.children.features.forEach((children) => {
        tasks.push(
          from(
            this.onlineTreksService.getTrekById(children.properties.id, trekId)
          ).pipe(
            map((childrenJson) => {
              return from(
                Preferences.set({
                  key: `trek-${trekId}-${children.properties.id}`,
                  value: JSON.stringify(childrenJson)
                })
              );
            })
          )
        );
        tasks.push(
          from(
            this.onlineTreksService.getPoisForTrekById(
              children.properties.id,
              trekId
            )
          ).pipe(
            map((childrenJson) => {
              return from(
                Preferences.set({
                  key: `pois-trek-${trekId}-${children.properties.id}`,
                  value: JSON.stringify(childrenJson)
                })
              );
            })
          )
        );

        tasks.push(
          from(
            this.onlineTreksService.getTouristicContentsForTrekById(
              children.properties.id,
              trekId
            )
          ).pipe(
            map((childrenJson) => {
              return from(
                Preferences.set({
                  key: `touristicContents-trek-${trekId}-${children.properties.id}`,
                  value: JSON.stringify(childrenJson)
                })
              );
            })
          )
        );
      });
    }

    return forkJoin(tasks).pipe(
      map(() => {
        return true;
      }),
      catchError(() => {
        this.removeTrek(trekId, false);
        return throwError(false);
      })
    );
  }

  fakeMediaDl() {
    const requestOne = of(1).pipe(delay(1000));
    const requestTwo = of(2).pipe(delay(1000));
    const requestThree = of(3).pipe(delay(1000));
    const requestFour = of(4).pipe(delay(1000));
    const requestFive = of(5).pipe(delay(1000));
    const observables: Array<Observable<number>> = [
      requestOne,
      requestTwo,
      requestThree,
      requestFour,
      requestFive
    ];
    const array$ = from(observables);
    const requests$ = array$.pipe(concatAll());
    const progress$ = of(true).pipe(switchMapTo(requests$), share());

    const count$ = array$.pipe(count());

    const ratio$ = progress$.pipe(
      scan((current) => current + 1, 0),
      withLatestFrom(count$, (current, nb) => current / nb)
    );

    of(true)
      .pipe(switchMapTo(ratio$))
      .subscribe((currentProgress) => {
        this.currentProgressDownload$.next(currentProgress);
      });

    return of(true).pipe(delay(6000));
  }

  private updateProgress() {
    const currentProgress =
      (this.commonMediaBytes + this.trekBytes) /
      (this.commonMediaContentLength + this.trekContentLength);
    this.currentProgressDownload$.next(currentProgress);
  }

  private saveCommonMedia() {
    Http.addListener('progress', (e) => {
      if (!this.commonMediaContentLength) {
        this.commonMediaContentLength = e.contentLength;
      }
      this.commonMediaBytes = e.bytes;
      this.updateProgress();
    });

    const offlineZipDownloadUrl = `${this.baseUrl}/global.zip`;
    const options = {
      url: offlineZipDownloadUrl,
      filePath: `zip/global.zip`,
      fileDirectory: Directory.Data,
      method: 'GET',
      progress: true
    };

    let source: any;

    return from(Http.downloadFile(options)).pipe(
      tap((result) => {
        source = result.path;
      }),
      mergeMap(() => {
        return from(
          Filesystem.getUri({ path: 'offline', directory: Directory.Data })
        );
      }),
      mergeMap((destination) => {
        return new Promise((resolve) => {
          from(
            ZipPlugin.unZip(
              {
                source,
                destination: destination.uri
              },
              (progress: any) => {
                if (progress.completed) {
                  Filesystem.deleteFile({
                    path: `zip/global.zip`,
                    directory: Directory.Data
                  });
                  resolve(true);
                }
              }
            )
          );
        });
      })
    );
  }

  private saveMediaForTrek(trekId: number) {
    if (this.treks$.value && this.treks$.value.features.length === 1) {
      Http.removeAllListeners();
    }
    Http.addListener('progress', (e) => {
      if (!this.trekContentLength) {
        this.trekContentLength = e.contentLength;
      }
      this.trekBytes = e.bytes;
      this.updateProgress();
    });

    const offlineZipDownloadUrl = `${this.baseUrl}/${trekId}.zip`;
    const options = {
      url: offlineZipDownloadUrl,
      filePath: `zip/${trekId}.zip`,
      fileDirectory: Directory.Data,
      method: 'GET',
      progress: true
    };

    let source: any;

    return from(Http.downloadFile(options)).pipe(
      tap((result) => {
        source = result.path;
      }),
      mergeMap(() => {
        return from(
          Filesystem.getUri({ path: 'offline', directory: Directory.Data })
        );
      }),
      mergeMap((destination) => {
        return new Promise((resolve) => {
          from(
            ZipPlugin.unZip(
              {
                source,
                destination: destination.uri
              },
              (progress: any) => {
                if (progress.completed) {
                  Filesystem.deleteFile({
                    path: `zip/${trekId}.zip`,
                    directory: Directory.Data
                  });
                  resolve(true);
                }
              }
            )
          );
        });
      })
    );
  }

  public removeTrek(trekId: number, withMedia: boolean): Observable<any> {
    const treks = <MinimalTreks>cloneDeep(this.treks$.value);
    treks.features = [
      ...treks.features.filter((feature) => feature.properties.id !== trekId)
    ];

    this.treks$.next(treks);

    const tasks: Observable<any>[] = [];
    tasks.push(
      from(
        Preferences.set({ key: 'offline-treks', value: JSON.stringify(treks) })
      )
    );
    tasks.push(from(Preferences.remove({ key: `pois-trek-${trekId}` })));
    tasks.push(
      from(Preferences.remove({ key: `touristicContents-trek-${trekId}` }))
    );

    let stream: Observable<any> = forkJoin(tasks).pipe(map(() => true));

    if (this.isMobile && withMedia) {
      if (this.treks$.value!.features.length === 0) {
        stream = stream.pipe(mergeMap(() => this.removeOfflineData()));
      } else {
        stream = stream.pipe(mergeMap(() => this.removeTrekMedia(trekId)));
      }
    }

    stream = stream.pipe(
      mergeMap(() => from(Preferences.get({ key: `trek-${trekId}` })))
    );

    stream = stream.pipe(
      concatMap((jsonTrek: any) => {
        const trek: Trek = JSON.parse(jsonTrek.value);
        if (
          trek.properties.children &&
          trek.properties.children.features.length > 0
        ) {
          const childrenToRemove: Observable<any>[] = [];
          trek.properties.children.features.forEach((children) => {
            childrenToRemove.push(
              from(
                Preferences.remove({
                  key: `trek-${trekId}-${children.properties.id}`
                })
              )
            );
            childrenToRemove.push(
              from(
                Preferences.remove({
                  key: `pois-trek-${trekId}-${children.properties.id}`
                })
              )
            );
            childrenToRemove.push(
              from(
                Preferences.remove({
                  key: `touristicContents-trek-${trekId}-${children.properties.id}`
                })
              )
            );
          });
          return childrenToRemove;
        } else {
          return of(true);
        }
      })
    );

    stream = stream.pipe(
      mergeMap(() => {
        return from(Preferences.remove({ key: `trek-${trekId}` }));
      })
    );

    stream = stream.pipe(catchError(() => throwError(false)));

    return stream;
  }

  private removeTrekMedia(trekId: number): Observable<boolean> {
    return from(
      Filesystem.rmdir({
        directory: Directory.Data,
        path: `offline/${trekId}`,
        recursive: true
      })
    ).pipe(map(() => true));
  }

  private removeOfflineData(): Observable<boolean> {
    return from(
      Filesystem.rmdir({
        directory: Directory.Data,
        path: `offline`,
        recursive: true
      })
    ).pipe(map(() => true));
  }

  public getTrekById(trekId: number, parentId?: number): Observable<Trek> {
    if (parentId) {
      return from(Preferences.get({ key: `trek-${parentId}-${trekId}` })).pipe(
        map(({ value }) => JSON.parse(value!))
      );
    } else {
      return from(Preferences.get({ key: `trek-${trekId}` })).pipe(
        map(({ value }) => JSON.parse(value!))
      );
    }
  }

  public getPoisForTrekById(
    trekId: number,
    parentId: number
  ): Observable<Pois> {
    const path = parentId
      ? `pois-trek-${parentId}-${trekId}`
      : `pois-trek-${trekId}`;
    return from(Preferences.get({ key: path })).pipe(
      map(({ value }) => JSON.parse(value!)),
      map(
        (pois: Poi[]) =>
          ({
            type: 'FeatureCollection',
            features: pois ? pois : []
          } as Pois)
      )
    );
  }

  public getTouristicContentsForTrekById(
    trekId: number,
    parentId: number
  ): Observable<TouristicContents> {
    const path = parentId
      ? `touristicContents-trek-${parentId}-${trekId}`
      : `touristicContents-trek-${trekId}`;

    return from(Preferences.get({ key: path })).pipe(
      map(({ value }) => JSON.parse(value!))
    );
  }

  public getTouristicEventsForTrekById(
    trekId: number,
    parentId: number
  ): Observable<TouristicEvents> {
    const path = parentId
      ? `pois-trek-${parentId}-${trekId}`
      : `pois-trek-${trekId}`;

    return from(Preferences.get({ key: path })).pipe(
      map(({ value }) => JSON.parse(value!)),
      map(
        (TouristicEventsItems) =>
          ({
            type: 'FeatureCollection',
            features: TouristicEventsItems ? TouristicEventsItems : []
          } as TouristicEvents)
      )
    );
  }

  public async getMapConfigForTrekById(
    trek: Trek,
    isOffline: boolean
  ): Promise<any> {
    let mapConfig: any;

    if (isOffline && this.isMobile) {
      mapConfig = {
        ...cloneDeep(environment.offlineMapConfig),
        zoom: environment.trekZoom.zoom
      };

      if (
        mapConfig.style &&
        typeof mapConfig.style !== 'string' &&
        mapConfig.style.sources
      ) {
        (mapConfig.style as any).sources[
          'tiles-background'
        ].tiles[0] = `${Capacitor.convertFileSrc(
          (
            await Filesystem.getUri({
              path: 'offline',
              directory: Directory.Data
            })
          ).uri
        )}/tiles/{z}/{x}/{y}.png`;

        if (mapConfig.style.layers) {
          mapConfig.style.sources['tiles-background-trek'] = {
            ...mapConfig.style.sources['tiles-background'],
            tiles: [await this.getTilesDirectoryForTrekById(trek.properties.id)]
          } as any;

          mapConfig.style.layers.push({
            id: 'tiles-background-trek',
            type: 'raster',
            source: 'tiles-background-trek',
            minzoom: environment.trekZoom.minZoom,
            maxzoom: environment.trekZoom.maxZoom
          });

          mapConfig.maxZoom = environment.trekZoom.maxZoom - 1;
        }
      }
    } else {
      mapConfig = {
        ...cloneDeep(environment.onlineMapConfig),
        zoom: environment.trekZoom.zoom
      };
    }

    (mapConfig as any).trekBounds = trek.bbox as [
      number,
      number,
      number,
      number
    ];
    mapConfig.center = undefined;

    return mapConfig;
  }

  private async getTilesDirectoryForTrekById(trekId: number): Promise<string> {
    return `${Capacitor.convertFileSrc(
      (await Filesystem.getUri({ path: 'offline', directory: Directory.Data }))
        .uri
    )}/${trekId}/tiles/{z}/{x}/{y}.png`;
  }

  public async trekIsAvailableOffline(trekId: number) {
    return Boolean((await Preferences.get({ key: `trek-${trekId}` })).value);
  }
}
