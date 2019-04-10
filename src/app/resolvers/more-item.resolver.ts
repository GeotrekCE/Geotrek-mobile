import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { InformationItem } from '@app/interfaces/interfaces';
import { MoreInformationsService } from '@app/services/more-informations/more-informations.service';
import { of } from 'rxjs';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class MoreItemResolver implements Resolve<InformationItem | 'connectionError'> {
  constructor(private more: MoreInformationsService) {
  }

  resolve(route: ActivatedRouteSnapshot) {
    const moreItemId = +(<string>route.paramMap.get('moreItemId'));
    return this.more.getMoreItemById(moreItemId).pipe(
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
