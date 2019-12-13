import { Injectable } from '@angular/core';
import { MinimalTrek } from '@app/interfaces/interfaces';
import { deburr } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class SearchTreksService {
  public search(treks: MinimalTrek[], searchValue: string): MinimalTrek[] {
    if (!treks) {
      return [];
    }
    if (!!!searchValue) {
      return treks.sort(function(a, b) {
        return a.properties.name.localeCompare(b.properties.name);
      });
    }
    searchValue = searchValue.toLowerCase();
    return treks
      .filter((trek) => {
        return deburr(trek.properties.name.toLowerCase()).includes(searchValue);
      })
      .sort(function(a, b) {
        return a.properties.name.localeCompare(b.properties.name);
      });
  }
}
