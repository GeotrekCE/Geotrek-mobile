import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { MinimalTrek, MinimalTreks } from '@app/interfaces/interfaces';
import { SearchTreksService } from '@app/services/search-treks/search-treks.service';
import { OfflineTreksService } from '@app/services/offline-treks/offline-treks.service';

import { OnlineTreksService } from '@app/services/online-treks/online-treks.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  providers: [SearchTreksService]
})
export class SearchComponent implements OnInit, OnDestroy {
  public filteredTreks: MinimalTrek[] = [];
  public currentSearchValue!: string;
  private treks: MinimalTreks | null = null;
  public treksByStep = 30;
  public currentMaxTreks = 30;
  private treksSubscription!: Subscription;

  constructor(
    private modalCtrl: ModalController,
    private onlineTreks: OnlineTreksService,
    private offlineTreks: OfflineTreksService,
    private searchTreks: SearchTreksService,
    private navParams: NavParams
  ) {}

  ngOnInit(): void {
    const isOnline = this.navParams.get('isOnline');
    const treksTool = isOnline ? this.onlineTreks : this.offlineTreks;
    this.treksSubscription = treksTool.treks$.subscribe((treks) => {
      this.treks = treks;
      if (this.treks) {
        this.filteredTreks = this.searchTreks.search(this.treks.features, '');
      }
    });
  }

  ngOnDestroy(): void {
    if (this.treksSubscription) {
      this.treksSubscription.unsubscribe();
    }
  }

  public close(): void {
    this.modalCtrl.dismiss();
  }

  public search(searchValue: any): void {
    this.currentSearchValue = searchValue.detail.value;
    if (this.treks) {
      this.filteredTreks = this.searchTreks.search(
        this.treks.features,
        searchValue.detail.value
      );
    } else {
      this.filteredTreks = [];
    }
  }

  public navigateToTrek(id: number) {
    this.modalCtrl.dismiss(id);
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
