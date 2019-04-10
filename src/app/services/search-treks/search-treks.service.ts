import { Injectable } from '@angular/core';

import { MinimalTrek } from '@app/interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class SearchTreksService {
  public search(treks: MinimalTrek[], searchValue: string): MinimalTrek[] {
    if (!treks) {
      return [];
    }
    if (!searchValue) {
      return treks;
    }
    searchValue = searchValue.toLowerCase();
    return treks.filter(trek => {
      return trek.properties.name.toLowerCase().includes(searchValue);
    });
  }
}
