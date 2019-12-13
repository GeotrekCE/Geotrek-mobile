import {
  Component,
  ChangeDetectorRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { OfflineTreksService } from '@app/services/offline-treks/offline-treks.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-progress',
  changeDetection: ChangeDetectionStrategy.Default,
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent {
  public currentProgress: number;
  private currentProgress$: Subscription;

  constructor(
    public offlineTreks: OfflineTreksService,
    private ref: ChangeDetectorRef
  ) {}

  ionViewWillEnter(): void {
    this.currentProgress$ = this.offlineTreks.currentProgressDownload$.subscribe(
      (val) => {
        this.currentProgress = val;
        this.ref.detectChanges();
      }
    );
  }

  ionViewWillLeave(): void {
    this.currentProgress$.unsubscribe();
  }
}
