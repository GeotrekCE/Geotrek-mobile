import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, publishReplay, refCount, take, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class CacheService {

  private cache: { [key: string]: Observable<any> } = {};
  private refreshDelay = 4 * 60 * 60 * 1000;
  private maxSize = 200;
  public revoke: EventEmitter<string | null> = new EventEmitter();
  public hits: { [key: string]: number } = {};

  constructor(
    private http: HttpClient,
  ) {
    this.revoke.subscribe((revoked: string | null) => {
      if (!revoked) {
        this.cache = {};
        this.hits = {};
      } else {
        delete this.cache[revoked];
        delete this.hits[revoked];
      }
    });
  }

  /*
   * gets an observable
   * that broadcasts a ReplaySubject
   * which emits the response of a get request
   * during this.refreshDelay ms without sending a new http request
   */
  public get<T>(url: string, options: any): Observable<T> {
    if (!this.cache.hasOwnProperty(url)) {
      if (Object.keys(this.cache).length >= this.maxSize) {
        // TODO: do not revoke everything
        this.revoke.emit();
      }
      this.cache[url] = this.http.get(url, options).pipe(
        // set hits to 0 each time request is actually sent
        tap(() => {
          this.hits[url] = 0;
        }),
        // create a ReplaySubject that stores and emit last response during delay
        publishReplay(1, this.refreshDelay),
        // broadcast ReplaySubject
        refCount(),
        // complete each observer after response has been emitted
        take(1),
        // increment hits each time request is subscribed
        tap(() => {
          const hits = this.hits[url];
          this.hits[url] = hits ? hits + 1 : 1;
        }),
        catchError((error) => {
          delete this.cache[url];
          return throwError(error)
        })
      );
    }
    return this.cache[url];
  }

  /*
   Make the observable revoke the cache when it emits
   */
  public revoking<T>(observable: Observable<T>, revoked?: string | null): Observable<T> {
    return observable.pipe(tap(() => {
      this.revoke.emit(revoked);
    }));
  }

}
