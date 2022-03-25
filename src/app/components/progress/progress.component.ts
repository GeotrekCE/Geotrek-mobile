import {
  Component,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  OnInit
} from '@angular/core';
import { OfflineTreksService } from '@app/services/offline-treks/offline-treks.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-progress',
  changeDetection: ChangeDetectionStrategy.Default,
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent implements OnInit {
  public currentProgress: number;
  private currentProgress$: Subscription;
  public willDownloadGlobalMedia = true;

  constructor(
    public offlineTreks: OfflineTreksService,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.willDownloadGlobalMedia = this.offlineTreks.willDownloadCommonMedia();

    this.currentProgress$ =
      this.offlineTreks.currentProgressDownload$.subscribe((val) => {
        this.currentProgress = val;
        this.ref.detectChanges();
      });
  }

  ionViewWillLeave(): void {
    this.currentProgress$.unsubscribe();
  }
}
