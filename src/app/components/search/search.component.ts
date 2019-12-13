import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { UnSubscribe } from '@app/components/abstract/unsubscribe';

import { MinimalTrek, MinimalTreks, Trek } from '@app/interfaces/interfaces';
import { SearchTreksService } from '@app/services/search-treks/search-treks.service';
import { OfflineTreksService } from '@app/services/offline-treks/offline-treks.service';

import { OnlineTreksService } from '@app/services/online-treks/online-treks.service';
import { ModalController, NavParams, Platform } from '@ionic/angular';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  providers: [SearchTreksService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent extends UnSubscribe implements OnInit {
  public filteredTreks: MinimalTrek[] = [];
  public currentSearchValue: string;
  public viewIsLoad = false;
  private treks: MinimalTreks | null = null;
  public treksByStep = 30;
  public currentMaxTreks = 30;

  constructor(
    private modalCtrl: ModalController,
    private onlineTreks: OnlineTreksService,
    private offlineTreks: OfflineTreksService,
    private searchTreks: SearchTreksService,
    private navParams: NavParams,
    private platform: Platform,
    private ref: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  ionViewDidEnter(): void {
    const isOnline = this.navParams.get('isOnline');
    const treksTool = isOnline ? this.onlineTreks : this.offlineTreks;
    this.subscriptions$$.push(
      this.platform.backButton.subscribeWithPriority(99999, () => {
        this.close();
      }),
      treksTool.treks$.subscribe((treks) => {
        this.treks = treks;
        if (this.treks) {
          this.filteredTreks = this.searchTreks.search(this.treks.features, '');
        }
        this.viewIsLoad = true;
        this.ref.detectChanges();
      })
    );
  }

  public close(): void {
    this.modalCtrl.dismiss();
  }

  public search(searchValue: string): void {
    this.currentSearchValue = searchValue;
    if (this.treks) {
      this.filteredTreks = this.searchTreks.search(
        this.treks.features,
        searchValue
      );
    } else {
      this.filteredTreks = [];
    }
  }

  public navigateToTrek(id: number) {
    this.modalCtrl.dismiss(id);
  }

  public trackTrek(index: number, element: Trek): number | null {
    return element ? element.properties.id : null;
  }

  public expandTreks(infiniteScroll: any) {
    if (this.currentMaxTreks < this.filteredTreks.length) {
      if (this.currentMaxTreks + this.treksByStep > this.filteredTreks.length) {
        this.currentMaxTreks = this.filteredTreks.length;
      } else {
        this.currentMaxTreks += this.treksByStep;
      }
    }
    infiniteScroll.target.complete();
  }
}
