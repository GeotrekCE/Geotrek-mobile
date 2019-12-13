import { Component, Input, OnDestroy } from '@angular/core';
import { LoadingService } from '@app/services/loading/loading.service';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnDestroy {
  @Input() public progressBarWidth = '50%';
  @Input() public condition: boolean | null = null;
  public loaderStatus: Boolean;
  private loaderStatus$: Subscription;

  constructor(public loading: LoadingService) {
    // add delay to prevent expression has changed after it was checked
    this.loaderStatus$ = this.loading.status
      .pipe(delay(0))
      .subscribe((status) => (this.loaderStatus = status));
  }

  ngOnDestroy(): void {
    this.loaderStatus$.unsubscribe();
  }
}
