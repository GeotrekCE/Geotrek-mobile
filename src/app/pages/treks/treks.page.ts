import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent,
  ModalController,
  PopoverController,
  AlertController
} from '@ionic/angular';
import { combineLatest, Subscription } from 'rxjs';
import { Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '@env/environment';
import { SettingsService } from '@app/services/settings/settings.service';
import { InAppDisclosureComponent } from '@app/components/in-app-disclosure/in-app-disclosure.component';
import { FiltersComponent } from '@app/components/filters/filters.component';
import { SearchComponent } from '@app/components/search/search.component';
import {
  MinimalTrek,
  TreksService,
  Order,
  TreksServiceOffline
} from '@app/interfaces/interfaces';
import { FilterTreksService } from '@app/services/filter-treks/filter-treks.service';
import { OnlineTreksService } from '@app/services/online-treks/online-treks.service';
import { OfflineTreksService } from '@app/services/offline-treks/offline-treks.service';
import { GeolocateService } from '@app/services/geolocate/geolocate.service';
import { TreksOrderComponent } from '@app/components/treks-order/treks-order.component';

@Component({
  selector: 'app-treks',
  templateUrl: 'treks.page.html',
  styleUrls: ['treks.page.scss'],
  providers: [FilterTreksService]
})
export class TreksPage implements OnInit, OnDestroy {
  public appName: string = environment.appName;
  public menuNavigation: boolean = !(environment.navigation === 'tabs');
  public treksByStep: number = environment.treksByStep;
  public colSize = environment.colSize;
  public filteredTreks!: MinimalTrek[];
  public mapLink!: string;
  public nbOfflineTreks = 0;
  public numberOfActiveFilters!: string;
  public offline = false;
  public currentMaxTreks: number = environment.treksByStep;

  private treksTool!: TreksService | TreksServiceOffline;
  private filteredTreksSubscription!: Subscription;
  private nbOfflineTreksSubscription!: Subscription;

  @ViewChild('content', { static: true }) private content!: IonContent;

  constructor(
    private filterTreks: FilterTreksService,
    private modalController: ModalController,
    public offlineTreks: OfflineTreksService,
    public onlineTreks: OnlineTreksService,
    private geolocate: GeolocateService,
    public settings: SettingsService,
    private route: ActivatedRoute,
    private router: Router,
    public platform: Platform,
    private popoverController: PopoverController,
    private translate: TranslateService,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    await this.handleInitialOrder();

    if (!this.treksTool) {
      this.offline = !!this.route.snapshot.data['offline'];
      this.treksTool = this.offline ? this.offlineTreks : this.onlineTreks;
      this.mapLink = this.treksTool.getTreksMapUrl();
    }

    const filteredTreks$ = this.offline
      ? this.offlineTreks.filteredTreks$
      : this.onlineTreks.filteredTreks$;

    this.filteredTreksSubscription = combineLatest([
      filteredTreks$,
      this.filterTreks.activeFiltersNumber$,
      this.settings.data$
    ]).subscribe(([filteredTreks, numberOfActiveFilters, settings]) => {
      if (settings) {
        this.numberOfActiveFilters = !!numberOfActiveFilters
          ? `(${numberOfActiveFilters})`
          : '';
        this.filteredTreks = <MinimalTrek[]>[...filteredTreks];
        this.content.scrollToTop();
      }
    });

    this.nbOfflineTreksSubscription = this.offlineTreks.treks$.subscribe(
      (treks) => {
        this.nbOfflineTreks = !treks ? 0 : treks.features.length;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.filteredTreksSubscription) {
      this.filteredTreksSubscription.unsubscribe();
    }

    if (this.nbOfflineTreksSubscription) {
      this.nbOfflineTreksSubscription.unsubscribe();
    }
  }

  public async handleInitialOrder() {
    if (environment.initialOrder === 'location') {
      let currentPosition: any;
      const shouldShowInAppDisclosure =
        await this.geolocate.shouldShowInAppDisclosure();
      try {
        if (shouldShowInAppDisclosure) {
          await this.presentInAppDisclosure();
        }
        currentPosition = await this.geolocate.getCurrentPosition();
      } finally {
        if (currentPosition) {
          this.settings.saveOrderState(environment.initialOrder, [
            currentPosition.longitude,
            currentPosition.latitude
          ]);
        } else {
          if (shouldShowInAppDisclosure) {
            await this.presentGeolocateError();
          }
          this.settings.saveOrderState('alphabetical');
        }
      }
    } else {
      this.settings.saveOrderState(environment.initialOrder as Order);
    }
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

  public changeColSize(): void {
    this.colSize = this.colSize === 12 ? 6 : 12;
    this.content.scrollToTop();
  }

  public getMdColSize(): number {
    return this.colSize / 2;
  }

  public navigateToTrek(id: number) {
    this.router.navigate([this.treksTool.getTrekDetailsUrl(id)]);
  }

  public resetFilters() {
    this.settings.resetFilters();
  }

  public trackTrek(index: number, element: MinimalTrek): number | null {
    return element ? element.properties.id : null;
  }

  async showTreksOrder(event: any) {
    const orders: { name: string; value: string }[] = [
      {
        name: await this.translate.get('toolbar.orderByAlphabet').toPromise(),
        value: 'alphabetical'
      },
      {
        name: await this.translate.get('toolbar.orderByLocation').toPromise(),
        value: 'location'
      },
      {
        name: await this.translate.get('toolbar.orderByRandom').toPromise(),
        value: 'random'
      }
    ];

    const popover = await this.popoverController.create({
      component: TreksOrderComponent,
      event: event,
      translucent: true,
      componentProps: {
        orders
      }
    });
    await popover.present();

    const { data } = await popover.onDidDismiss();

    if (data && data.error) {
      this.presentGeolocateError();
    }
  }

  public async presentGeolocateError(): Promise<void> {
    const errorTranslation: any = await this.translate
      .get('geolocate.error')
      .toPromise();

    const alertLocation = await this.alertController.create({
      header: errorTranslation['header'],
      subHeader: errorTranslation['subHeader'],
      message: errorTranslation['message'],
      buttons: [errorTranslation['confirmButton']]
    });

    await alertLocation.present();

    await alertLocation.onDidDismiss();
  }

  public loadTreks(): void {
    this.settings.loadSettings();
    this.onlineTreks.loadTreks();
  }

  public async presentInAppDisclosure(): Promise<void> {
    const modal = await this.modalController.create({
      component: InAppDisclosureComponent,
      componentProps: {},
      cssClass: 'full-size'
    });

    await modal.present();

    await modal.onDidDismiss();
  }
}
