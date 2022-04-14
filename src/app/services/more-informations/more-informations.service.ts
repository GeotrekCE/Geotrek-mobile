import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { InformationIntro, InformationItem } from '@app/interfaces/interfaces';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class MoreInformationsService {
  public baseUrl = environment.onlineBaseUrl;

  constructor(private http: HttpClient, private translate: TranslateService) {}

  public getMoreItems(): Observable<InformationIntro[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept-Language': this.translate.getDefaultLang()
      })
    };
    return this.http.get<InformationIntro[]>(
      `${this.baseUrl}/flatpages.json`,
      httpOptions
    );
  }

  public getMoreItemById(id: number): Observable<InformationItem> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept-Language': this.translate.getDefaultLang()
      })
    };
    return this.http.get<InformationItem>(
      `${this.baseUrl}/flatpages/${id}.json`,
      httpOptions
    );
  }
}
