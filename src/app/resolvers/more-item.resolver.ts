import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { InformationItem } from '@app/interfaces/interfaces';
import { MoreInformationsService } from '@app/services/more-informations/more-informations.service';
import { of } from 'rxjs';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Platform } from '@ionic/angular';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics/ngx';
import { environment } from '@env/environment';

@Injectable()
export class MoreItemResolver
  implements Resolve<InformationItem | 'connectionError'> {
  constructor(
    private more: MoreInformationsService,
    private platform: Platform,
    private firebaseAnalytics: FirebaseAnalytics
  ) {}

  resolve(route: ActivatedRouteSnapshot) {
    const moreItemId = +(<string>route.paramMap.get('moreItemId'));
    return this.more.getMoreItemById(moreItemId).pipe(
      tap((item) => {
        if (
          (this.platform.is('ios') || this.platform.is('android')) &&
          environment.useFirebase
        ) {
          this.firebaseAnalytics.setCurrentScreen(`${item.title}`);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        if (!error.status) {
          return of('connectionError' as 'connectionError');
        } else {
          return throwError(error);
        }
      })
    );
  }
}
