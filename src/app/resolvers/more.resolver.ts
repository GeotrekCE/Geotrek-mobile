import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router'

import { InformationIntro } from '@app/interfaces/interfaces';
import { MoreInformationsService } from '@app/services/more-informations/more-informations.service';
import { of } from 'rxjs/internal/observable/of';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError } from 'rxjs/operators';

@Injectable()
export class MoreResolver implements Resolve<InformationIntro[] | 'connectionError'> {

  constructor(private more: MoreInformationsService) {
  }

  resolve = () => this.more.getMoreItems().pipe(
    catchError((error: HttpErrorResponse) => {
      if (!error.status) {
        return of('connectionError' as 'connectionError')
      } else {
        return throwError(error)
      }
    })
  )

}
