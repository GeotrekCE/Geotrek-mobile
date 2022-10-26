import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { Subscription } from 'rxjs/internal/Subscription';
import { cloneDeep } from 'lodash';

import { environment } from '@env/environment';
import { OnlineTreksService } from '@app/services/online-treks/online-treks.service';
import { OfflineTreksService } from '@app/services/offline-treks/offline-treks.service';
import {
  MinimalTrek,
  TreksService,
  TreksServiceOffline
} from '@app/interfaces/interfaces';
import { FilterTreksService } from '@app/services/filter-treks/filter-treks.service';
import { SettingsService } from '@app/services/settings/settings.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-treks-map',
  templateUrl: './treks-map.page.html',
  styleUrls: ['./treks-map.page.scss'],
  providers: [FilterTreksService]
})
export class TreksMapPage implements OnInit, OnDestroy {
  private mergeFiltersTreks$!: Subscription;
  public filteredTreks!: MinimalTrek[];
  public numberOfActiveFilters!: string;
  public offline!: boolean;
  private treksTool!: TreksService | TreksServiceOffline;
  public treksUrl!: string;
  public appName: string = environment.appName;
  public menuNavigation: boolean = !(environment.navigation === 'tabs');
  public mapConfig: any;
  public commonSrc!: string;
  public canDisplayMap = false;

  constructor(
    private filterTreks: FilterTreksService,
    public onlineTreks: OnlineTreksService,
    public offlineTreks: OfflineTreksService,
    private router: Router,
    private route: ActivatedRoute,
    public settings: SettingsService,
    private platform: Platform
  ) {}

  async ngOnInit() {
    if (!this.treksTool) {
      this.offline = !!this.route.snapshot.data['offline'];
      this.treksTool = this.offline ? this.offlineTreks : this.onlineTreks;
      this.treksUrl = this.treksTool.getTreksUrl();
      this.mapConfig = cloneDeep(
        (this.offline &&
        (this.platform.is('ios') || this.platform.is('android'))
          ? environment.offlineMapConfig
          : environment.onlineMapConfig) as any
      );
      this.commonSrc = await this.treksTool.getCommonImgSrc();
    }

    const filteredTreks$ = this.offline
      ? this.offlineTreks.filteredTreks$
      : this.onlineTreks.filteredTreks$;

    this.mergeFiltersTreks$ = combineLatest([
      filteredTreks$,
      this.filterTreks.activeFiltersNumber$
    ]).subscribe(([filteredTreks, numberOfActiveFilters]) => {
      this.numberOfActiveFilters =
        numberOfActiveFilters === 0 ? '' : `(${numberOfActiveFilters})`;
      this.filteredTreks = <MinimalTrek[]>filteredTreks;
    });
  }

  ngOnDestroy() {
    if (this.mergeFiltersTreks$) {
      this.mergeFiltersTreks$.unsubscribe();
    }
  }

  ionViewWillEnter() {
    this.canDisplayMap = true;
  }

  navigateToTrek(id: number) {
    this.router.navigate([this.treksTool.getTrekDetailsUrl(id)]);
  }

  public loadTreks(): void {
    this.settings.loadSettings();
    this.onlineTreks.loadTreks();
  }
}
