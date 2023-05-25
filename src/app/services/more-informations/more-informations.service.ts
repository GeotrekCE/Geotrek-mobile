import { Injectable } from '@angular/core';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';

import { TranslateService } from '@ngx-translate/core';

import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class MoreInformationsService {
  public baseUrl = environment.mobileApiUrl;

  constructor(private translate: TranslateService) {}

  public getMoreItems(): Promise<HttpResponse> {
    const httpOptions = {
      method: 'GET',
      url: `${this.baseUrl}/flatpages.json`,
      headers: {
        'Accept-Language': this.translate.getDefaultLang()
      }
    };
    return CapacitorHttp.request(httpOptions);
  }

  public getMoreItemById(id: number): Promise<HttpResponse> {
    const httpOptions = {
      method: 'GET',
      url: `${this.baseUrl}/flatpages/${id}.json`,
      headers: {
        'Accept-Language': this.translate.getDefaultLang()
      }
    };
    return CapacitorHttp.request(httpOptions);
  }
}
