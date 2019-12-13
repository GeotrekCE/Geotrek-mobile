import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { InformationIntro, InformationItem } from '@app/interfaces/interfaces';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { CacheService } from '@app/services/cache/cache.service';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class MoreInformationsService {
  private apiUrl = `${environment.onlineBaseUrl}`;

  constructor(
    private cache: CacheService,
    private translate: TranslateService
  ) {}

  public getMoreItems(): Observable<InformationIntro[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept-Language': this.translate.getDefaultLang()
      })
    };
    return this.cache.get<InformationIntro[]>(
      `${this.apiUrl}/flatpages.json`,
      httpOptions
    );
  }

  public getMoreItemById(id: number): Observable<InformationItem> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept-Language': this.translate.getDefaultLang()
      })
    };
    return this.cache.get<InformationItem>(
      `${this.apiUrl}/flatpages/${id}.json`,
      httpOptions
    );
  }
}
