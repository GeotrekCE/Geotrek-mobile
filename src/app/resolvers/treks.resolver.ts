import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Platform } from '@ionic/angular';

import { TreksContext, TreksService } from '@app/interfaces/interfaces';
import { OfflineTreksService } from '@app/services/offline-treks/offline-treks.service';
import { OnlineTreksService } from '@app/services/online-treks/online-treks.service';
import { environment } from '@env/environment';

@Injectable()
export class TreksContextResolver implements Resolve<TreksContext> {
  constructor(
    private onlineTreks: OnlineTreksService,
    private offlineTreks: OfflineTreksService,
    private platform: Platform,
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<TreksContext> {
    const offline = !!route.data['offline'];
    const treksService: TreksService = offline ? this.offlineTreks : this.onlineTreks;
    const mapConfig =
      offline && (this.platform.is('ios') || this.platform.is('android'))
        ? environment.offlineMapConfig
        : environment.onlineMapConfig;
    return of({
      treksTool: treksService,
      offline: offline,
      mapConfig,
    });
  }
}
