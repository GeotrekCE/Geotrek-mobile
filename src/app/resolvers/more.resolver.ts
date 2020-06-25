import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { InformationIntro } from '@app/interfaces/interfaces';
import { MoreInformationsService } from '@app/services/more-informations/more-informations.service';
import { of } from 'rxjs/internal/observable/of';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError, tap } from 'rxjs/operators';
import { Platform } from '@ionic/angular';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics/ngx';
import { environment } from '@env/environment';

@Injectable()
export class MoreResolver
  implements Resolve<InformationIntro[] | 'connectionError'> {
  constructor(
    private more: MoreInformationsService,
    private platform: Platform,
    private firebaseAnalytics: FirebaseAnalytics
  ) {}

  resolve = (route: ActivatedRouteSnapshot) =>
    this.more.getMoreItems().pipe(
      tap(() => {
        if (
          (this.platform.is('ios') || this.platform.is('android')) &&
          environment.useFirebase
        ) {
          this.firebaseAnalytics.setCurrentScreen(`Information`);
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
