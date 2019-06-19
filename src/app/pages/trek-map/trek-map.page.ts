import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { ModalController, Platform, PopoverController } from '@ionic/angular';

import { MapboxOptions } from 'mapbox-gl';

import { UnSubscribe } from '@app/components/abstract/unsubscribe';
import { PoiDetailsComponent } from '@app/components/poi-details/poi-details.component';
import { InformationDeskDetailsComponent } from '@app/components/information-desk-details/information-desk-details.component';

import {
  HydratedTrek,
  Poi,
  Pois,
  TrekContext,
  InformationDesk,
  TouristicCategoryWithFeatures,
} from '@app/interfaces/interfaces';
import { LoadingService } from '@app/services/loading/loading.service';
import { SettingsService } from '@app/services/settings/settings.service';

@Component({
  selector: 'app-trek-map',
  templateUrl: './trek-map.page.html',
  styleUrls: ['./trek-map.page.scss'],
})
export class TrekMapPage extends UnSubscribe implements OnDestroy {
  public currentTrek: HydratedTrek | null = null;
  public currentPois: Pois;
  public touristicCategoriesWithFeatures: TouristicCategoryWithFeatures[];
  public loader = true;
  public trekUrl = '';
  public connectionError = false;
  public modalPoiDetails: HTMLIonModalElement | null;
  public mapConfig: MapboxOptions;
  public commonSrc: string;
  public offline = false;

  constructor(
    private loading: LoadingService,
    private modalController: ModalController,
    private route: ActivatedRoute,
    private router: Router,
    public settings: SettingsService,
    private platform: Platform,
    private popoverCtrl: PopoverController
  ) {
    super();
  }

  ionViewDidEnter(): void {
    this.loading.begin('trek-map');
    this.subscriptions$$.push(
      this.route.data.subscribe(
        (data: Data): void => {
          const context: TrekContext | 'connectionError' = data.context;
          if (context === 'connectionError') {
            this.connectionError = true;
            this.loading.finish('trek-map'); // if there is a connection error, map won't be loaded
          } else {
            this.connectionError = false;
            this.offline = context.offline;
            this.currentTrek = context.trek;
            this.currentPois = context.pois;
            this.touristicCategoriesWithFeatures = context.touristicCategoriesWithFeatures;
            this.mapConfig = context.mapConfig;
            this.commonSrc = context.treksTool.getCommonImgSrc();
            this.trekUrl = context.treksTool.getTrekDetailsUrl((this.currentTrek as any).properties.id);
          }
        },
      ),
    );

    if (this.platform.is('android')) {
      this.subscriptions$$.push(
        this.platform.backButton.subscribeWithPriority(99999, async () => {
          // close popover
          try {
            const popover = await this.popoverCtrl.getTop();
            if (popover) {
              popover.dismiss();
              return;
            }

            const modal = await this.modalController.getTop();
            if (modal) {
              modal.dismiss();
              return;
            }
          } catch (error) {
          }
        })
      )
    }
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.loading.finish();
  }

  public async presentPoiDetails(poi: Poi): Promise<void> {
    if (this.modalPoiDetails) {
      await this.modalPoiDetails.dismiss();
    }

    this.modalPoiDetails = await this.modalController.create({
      component: PoiDetailsComponent,
      componentProps: { poi, offline: this.offline, commonSrc: this.commonSrc },
    });

    this.modalPoiDetails.onDidDismiss().then(() => {
      this.modalPoiDetails = null;
    });

    return await this.modalPoiDetails.present();
  }

  public async presentInformationDeskDetails(informationDesk: InformationDesk): Promise<void> {
    const modal = await this.modalController.create({
      component: InformationDeskDetailsComponent,
      componentProps: { informationDesk },
    });
    return await modal.present();
  }

  public mapIsLoaded(event: Event): void {
    this.loading.finish('trek-map');
  }

  public refresh() {
    this.router.navigate([this.router.url]);
  }
}
