import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { ModalController, Platform, PopoverController } from '@ionic/angular';
import { Subscription } from 'rxjs/internal/Subscription';

import { MapboxOptions } from 'mapbox-gl';

import { PoiDetailsComponent } from '@app/components/poi-details/poi-details.component';
import { InformationDeskDetailsComponent } from '@app/components/information-desk-details/information-desk-details.component';

import {
  HydratedTrek,
  Poi,
  Pois,
  TrekContext,
  InformationDesk,
  TouristicCategoryWithFeatures,
  TreksService
} from '@app/interfaces/interfaces';
import { SettingsService } from '@app/services/settings/settings.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-trek-map',
  templateUrl: './trek-map.page.html',
  styleUrls: ['./trek-map.page.scss']
})
export class TrekMapPage implements OnInit, OnDestroy {
  public currentTrek: HydratedTrek | null = null;
  public currentPois: Pois;
  public touristicCategoriesWithFeatures: TouristicCategoryWithFeatures[];
  public trekUrl = '';
  public connectionError = false;
  public modalPoiDetails: HTMLIonModalElement | null;
  public mapConfig: MapboxOptions;
  public commonSrc: string;
  public offline = false;
  private treksTool: TreksService;
  private dataSubscription: Subscription;
  private backButtonSubscription: Subscription;
  public canDisplayMap = false;

  constructor(
    private modalController: ModalController,
    private route: ActivatedRoute,
    private router: Router,
    public settings: SettingsService,
    private platform: Platform,
    private popoverCtrl: PopoverController,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.dataSubscription = this.route.data.subscribe((data: Data): void => {
      const context: TrekContext | 'connectionError' = data.context;
      if (context === 'connectionError') {
        this.connectionError = true;
      } else {
        if (!this.currentTrek) {
          this.connectionError = false;
          this.offline = context.offline;
          this.currentTrek = context.trek;
          this.currentPois = context.pois;
          this.touristicCategoriesWithFeatures =
            context.touristicCategoriesWithFeatures;
          this.mapConfig = context.mapConfig;
          this.treksTool = context.treksTool;
          this.commonSrc = context.treksTool.getCommonImgSrc();
          this.trekUrl = context.treksTool.getTrekDetailsUrl(
            (this.currentTrek as any).properties.id
          );
        }
      }
    });

    if (this.platform.is('android')) {
      this.backButtonSubscription =
        this.platform.backButton.subscribeWithPriority(99999, async () => {
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

            this.location.back();
          } catch (error) {}
        });
    }
  }

  ngOnDestroy() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }

    if (this.backButtonSubscription) {
      this.backButtonSubscription.unsubscribe();
    }
  }

  ionViewWillEnter() {
    this.canDisplayMap = true;
  }

  public async presentPoiDetails(poi: Poi): Promise<void> {
    if (this.modalPoiDetails) {
      await this.modalPoiDetails.dismiss();
    }

    this.modalPoiDetails = await this.modalController.create({
      component: PoiDetailsComponent,
      componentProps: { poi, offline: this.offline, commonSrc: this.commonSrc },
      cssClass: 'full-size'
    });

    this.modalPoiDetails.onDidDismiss().then(() => {
      this.modalPoiDetails = null;
    });

    return await this.modalPoiDetails.present();
  }

  public async presentInformationDeskDetails(
    informationDesk: InformationDesk
  ): Promise<void> {
    const modal = await this.modalController.create({
      component: InformationDeskDetailsComponent,
      componentProps: { informationDesk }
    });
    return await modal.present();
  }

  public refresh() {
    this.router.navigate([this.router.url]);
  }

  public navigateToChildren(id: number) {
    if (this.currentTrek) {
      this.router.navigate([
        this.treksTool.getTrekDetailsUrl(id, this.currentTrek.properties.id)
      ]);
    }
  }
}
