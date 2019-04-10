import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class LoadingService {

  public status = new BehaviorSubject(false);  // loading state

  private loadingIds = new BehaviorSubject<string[]>([]); // list of ids

  constructor() {
    const service = this;
    this.loadingIds.pipe(
      map((ids: string[]) => ids.length > 0)
    ).subscribe((isLoading: boolean) => {
      if (isLoading !== service.status.getValue()) {
        service.status.next(isLoading);
      }
    });
    this.status.subscribe()
  }

  begin(id: string): void {
    const ids = this.loadingIds.getValue();
    ids.push(id);
    this.loadingIds.next(ids);
  }

  finish(id?: string): void {
    if (id === undefined) {
      this.loadingIds.next([]);
    } else {
      const ids = this.loadingIds.getValue()
        .filter((loadingId: string) => loadingId !== id);
      this.loadingIds.next(ids);
    }
  }

  isLoading(id: string): Observable<boolean> {
    return this.loadingIds.pipe(map((loadingIds: string[]) => {
      return loadingIds.indexOf(id) >= 0;
    }));
  }

}

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(protected loading: LoadingService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const loadingId = `${req.method}-${req.urlWithParams}`;
    this.loading.begin(loadingId);
    return next
      .handle(req)
      .pipe(
        tap((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            this.loading.finish(loadingId);
          }
        }),
        catchError((error: any) => {
          this.loading.finish(loadingId);
          return throwError(error);
        }));
  }
}
