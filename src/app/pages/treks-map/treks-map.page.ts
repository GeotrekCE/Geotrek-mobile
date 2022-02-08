import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OnlineTreksService } from '@app/services/online-treks/online-treks.service';
import { MapboxOptions } from 'mapbox-gl';
import { environment } from '@env/environment';
import { FiltersComponent } from '@app/components/filters/filters.component';
import { SearchComponent } from '@app/components/search/search.component';
import {
  MinimalTrek,
  TreksContext,
  TreksService
} from '@app/interfaces/interfaces';
import { FilterTreksService } from '@app/services/filter-treks/filter-treks.service';
import { SettingsService } from '@app/services/settings/settings.service';
import { ModalController, Platform } from '@ionic/angular';
import { combineLatest } from 'rxjs';
import { Subscription } from 'rxjs/internal/Subscription';
import { map, mergeMap, first } from 'rxjs/operators';
import { cloneDeep } from 'lodash';
import { Network } from '@ionic-native/network/ngx';

@Component({
  selector: 'app-treks-map',
  templateUrl: './treks-map.page.html',
  styleUrls: ['./treks-map.page.scss'],
  providers: [FilterTreksService]
})
export class TreksMapPage implements OnInit, OnDestroy {
  private mergeFiltersTreks$: Subscription;
  public filteredTreks: MinimalTrek[];
  public numberOfActiveFilters: string;
  public offline: boolean;
  private treksTool: TreksService;
  public treksUrl: string;
  public appName: string = environment.appName;
  public mapConfig: MapboxOptions;
  public commonSrc: string;
  public noNetwork = false;
  private dataSubscription: Subscription;
  public canDisplayMap = false;

  constructor(
    private filterTreks: FilterTreksService,
    private modalController: ModalController,
    public onlineTreks: OnlineTreksService,
    private router: Router,
    private route: ActivatedRoute,
    public settings: SettingsService,
    private network: Network,
    private platform: Platform
  ) {}

  ngOnInit() {
    this.checkNetwork();

    this.dataSubscription = this.route.data.subscribe((data) => {
      const context: TreksContext = data.context;
      this.offline = context.offline;
      this.treksTool = context.treksTool;
      this.treksUrl = this.treksTool.getTreksUrl();
      this.mapConfig = cloneDeep(context.mapConfig);
      this.commonSrc = this.treksTool.getCommonImgSrc();
    });

    this.mergeFiltersTreks$ = combineLatest([
      this.route.data.pipe(
        first(),
        map((data) => data.context),
        mergeMap((context: TreksContext) => context.treksTool.filteredTreks$)
      ),
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

    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  ionViewWillEnter() {
    this.canDisplayMap = true;
  }

  public async presentFilters(): Promise<void> {
    const modal = await this.modalController.create({
      component: FiltersComponent,
      componentProps: { isOnline: !this.offline },
      cssClass: 'full-size'
    });
    await modal.present();
  }

  public async presentSearch(): Promise<void> {
    const modal = await this.modalController.create({
      component: SearchComponent,
      componentProps: { isOnline: !this.offline },
      cssClass: 'full-size'
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data) {
      this.navigateToTrek(data);
    }
  }

  navigateToTrek(id: number) {
    this.router.navigate([this.treksTool.getTrekDetailsUrl(id)]);
  }

  public loadTreks(): void {
    this.checkNetwork();
    if (!this.noNetwork) {
      this.settings.loadSettings();
      this.onlineTreks.loadTreks();
    }
  }

  public checkNetwork(): void {
    if (this.platform.is('ios') || this.platform.is('android')) {
      this.noNetwork = this.network.type === 'none';
    }
  }
}
