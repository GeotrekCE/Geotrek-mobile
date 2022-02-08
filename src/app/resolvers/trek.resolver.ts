import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { MapboxOptions } from 'mapbox-gl';
import { forkJoin, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import {
  Pois,
  Trek,
  HydratedTrek,
  TrekContext,
  TreksService,
  TouristicContents,
  TouristicEvents
} from '@app/interfaces/interfaces';
import { OfflineTreksService } from '@app/services/offline-treks/offline-treks.service';
import { OnlineTreksService } from '@app/services/online-treks/online-treks.service';
import { SettingsService } from '@app/services/settings/settings.service';
import { LoadingService } from '@app/services/loading/loading.service';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics/ngx';
import { Platform } from '@ionic/angular';
import { environment } from '@env/environment';

@Injectable()
export class TrekContextResolver
  implements Resolve<TrekContext | null | 'connectionError'>
{
  constructor(
    private loading: LoadingService,
    private offlineTreks: OfflineTreksService,
    private onlineTreks: OnlineTreksService,
    private router: Router,
    private settingsService: SettingsService,
    private platform: Platform,
    private firebaseAnalytics: FirebaseAnalytics
  ) {}

  resolve(route: ActivatedRouteSnapshot) {
    const offline = !!route.data['offline'];
    const isStage = !!route.data['isStage'];
    const trekId = +(<string>route.paramMap.get('trekId'));
    const stageId = +(<string>route.paramMap.get('stageId'));
    const currentTrekId = isStage ? stageId : trekId;
    const parentId: number | undefined = isStage ? trekId : undefined;

    const treksService: TreksService = offline
      ? this.offlineTreks
      : this.onlineTreks;

    return forkJoin(
      treksService.getTrekById(currentTrekId, parentId),
      treksService.getPoisForTrekById(currentTrekId, parentId),
      treksService.getTouristicContentsForTrekById(currentTrekId, parentId),
      treksService.getTouristicEventsForTrekById(currentTrekId, parentId),
      isStage && parentId ? treksService.getTrekById(parentId) : of(null)
    ).pipe(
      map(
        ([trek, pois, touristicContents, touristicEvents, parentTrek]: [
          Trek | null,
          Pois,
          TouristicContents,
          TouristicEvents,
          Trek | null
        ]): TrekContext | null => {
          if (trek === null) {
            this.router.navigate(['/']);
            console.error('No trek found: ', currentTrekId);
            return null;
          } else {
            const mapConfig: MapboxOptions =
              treksService.getMapConfigForTrekById(
                isStage && parentId ? (parentTrek as Trek) : (trek as Trek),
                offline
              );
            const commonSrc = treksService.getCommonImgSrc();
            const hydratedTrek: HydratedTrek =
              this.settingsService.getHydratedTrek(trek, commonSrc);
            const touristicCategoriesWithFeatures =
              this.settingsService.getTouristicCategoriesWithFeatures(
                touristicContents
              );

            if (
              (this.platform.is('ios') || this.platform.is('android')) &&
              environment.useFirebase
            ) {
              this.firebaseAnalytics.setCurrentScreen(
                `${trek.properties.name}`
              );
            }

            return {
              treksTool: treksService,
              offline: offline,
              originalTrek: trek,
              trek: hydratedTrek,
              pois,
              touristicContents,
              touristicCategoriesWithFeatures,
              touristicEvents,
              mapConfig,
              commonSrc,
              isStage,
              parentTrek
            };
          }
        }
      ),
      catchError((error: HttpErrorResponse) => {
        this.loading.finish();
        if (!error.status) {
          return of('connectionError' as 'connectionError');
        } else {
          return throwError(error);
        }
      })
    );
  }
}
