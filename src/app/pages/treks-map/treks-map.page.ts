import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OnlineTreksService } from '@app/services/online-treks/online-treks.service';
import { MapboxOptions } from 'mapbox-gl';
import { environment } from '@env/environment';
import { unsubscribe, UnSubscribe } from '@app/components/abstract/unsubscribe';
import { FiltersComponent } from '@app/components/filters/filters.component';
import { SearchComponent } from '@app/components/search/search.component';
import {
  MinimalTrek,
  TreksContext,
  TreksService
} from '@app/interfaces/interfaces';
import { FilterTreksService } from '@app/services/filter-treks/filter-treks.service';
import { LoadingService } from '@app/services/loading/loading.service';
import { SettingsService } from '@app/services/settings/settings.service';
import { ModalController, Platform } from '@ionic/angular';
import { combineLatest } from 'rxjs';
import { Subscription } from 'rxjs/internal/Subscription';
import { map, mergeMap, first, delay } from 'rxjs/operators';
import { cloneDeep } from 'lodash';
import { Network } from '@ionic-native/network/ngx';

@Component({
  selector: 'app-treks-map',
  templateUrl: './treks-map.page.html',
  styleUrls: ['./treks-map.page.scss'],
  providers: [FilterTreksService]
})
export class TreksMapPage extends UnSubscribe implements OnInit, OnDestroy {
  private mergeFiltersTreks$: Subscription;
  public filteredTreks: MinimalTrek[];
  public numberOfActiveFilters: string;
  public offline: boolean;
  private treksTool: TreksService;
  public isInView = false;
  public treksUrl: string;
  public appName: string = environment.appName;
  public mapConfig: MapboxOptions;
  public commonSrc: string;
  public currentPosition$: Subscription;
  public noNetwork = false;
  public loaderStatus: Boolean;

  constructor(
    public loading: LoadingService,
    private filterTreks: FilterTreksService,
    private modalController: ModalController,
    public onlineTreks: OnlineTreksService,
    private router: Router,
    private route: ActivatedRoute,
    public settings: SettingsService,
    private network: Network,
    private platform: Platform
  ) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this.loading.begin('treks-map');
    this.subscriptions$$.push(
      this.route.data.subscribe((data) => {
        const context: TreksContext = data.context;
        this.offline = context.offline;
        this.treksTool = context.treksTool;
        this.treksUrl = this.treksTool.getTreksUrl();
        this.mapConfig = cloneDeep(context.mapConfig);
        this.commonSrc = this.treksTool.getCommonImgSrc();
      }),
      this.onlineTreks.onlineTreksError$.subscribe((error) => {
        if (!!error) {
          this.loading.finish(); // if there was a connection error, map could not be loaded
        }
      }),
      this.loading.status
        .pipe(delay(0))
        .subscribe((status) => (this.loaderStatus = status))
    );
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.loading.finish();
  }

  ionViewWillEnter(): void {
    if (this.platform.is('ios') || this.platform.is('android')) {
      this.noNetwork = this.network.type === 'none';
    }
  }

  ionViewDidEnter(): void {
    this.mapIsLoaded(false);
    this.mergeFiltersTreks$ = combineLatest(
      this.route.data.pipe(
        first(),
        map((data) => data.context),
        mergeMap((context: TreksContext) => context.treksTool.filteredTreks$)
      ),
      this.filterTreks.activeFiltersNumber$
    ).subscribe(([filteredTreks, numberOfActiveFilters]) => {
      this.numberOfActiveFilters =
        numberOfActiveFilters === 0 ? '' : `(${numberOfActiveFilters})`;
      this.filteredTreks = <MinimalTrek[]>filteredTreks;
      this.isInView = true;
    });
    this.subscriptions$$.push(this.mergeFiltersTreks$);
  }

  ionViewDidLeave(): void {
    this.isInView = false;
    unsubscribe(this.mergeFiltersTreks$);
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

  public mapIsLoaded(loaded: boolean): void {
    if (loaded) {
      this.loading.finish('treks-map');
    }
  }
}
