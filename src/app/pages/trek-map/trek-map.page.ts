import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, Platform, PopoverController } from '@ionic/angular';
import { Subscription } from 'rxjs/internal/Subscription';

import { MapboxOptions } from 'mapbox-gl';

import { PoiDetailsComponent } from '@app/components/poi-details/poi-details.component';
import { InformationDeskDetailsComponent } from '@app/components/information-desk-details/information-desk-details.component';

import {
  HydratedTrek,
  Poi,
  Pois,
  InformationDesk,
  TouristicCategoryWithFeatures,
  TreksService,
  Trek,
  TouristicContents,
  TouristicEvents
} from '@app/interfaces/interfaces';
import { SettingsService } from '@app/services/settings/settings.service';
import { Location } from '@angular/common';
import { OnlineTreksService } from '@app/services/online-treks/online-treks.service';
import { OfflineTreksService } from '@app/services/offline-treks/offline-treks.service';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { environment } from '@env/environment';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics/ngx';
import { first } from 'rxjs/operators';
import { of } from 'rxjs';

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
  private backButtonSubscription: Subscription;
  public canDisplayMap = false;

  constructor(
    private modalController: ModalController,
    private route: ActivatedRoute,
    private router: Router,
    public settings: SettingsService,
    private platform: Platform,
    private popoverCtrl: PopoverController,
    private location: Location,
    private onlineTreks: OnlineTreksService,
    private offlineTreks: OfflineTreksService,
    private firebaseAnalytics: FirebaseAnalytics
  ) {}

  ngOnInit(): void {
    const offline = !!this.route.snapshot.data['offline'];
    const isStage = !!this.route.snapshot.data['isStage'];
    const trekId = +(<string>this.route.snapshot.paramMap.get('trekId'));
    const stageId = +(<string>this.route.snapshot.paramMap.get('stageId'));
    const currentTrekId = isStage ? stageId : trekId;
    const parentId: number | undefined = isStage ? trekId : undefined;

    const treksService: TreksService = offline
      ? this.offlineTreks
      : this.onlineTreks;

    forkJoin([
      treksService.getTrekById(currentTrekId, parentId),
      treksService.getPoisForTrekById(currentTrekId, parentId),
      treksService.getTouristicContentsForTrekById(currentTrekId, parentId),
      treksService.getTouristicEventsForTrekById(currentTrekId, parentId),
      isStage && parentId ? treksService.getTrekById(parentId) : of(null)
    ])
      .pipe(first())
      .subscribe(
        async ([trek, pois, touristicContents, touristicEvents, parentTrek]: [
          Trek | null,
          Pois,
          TouristicContents,
          TouristicEvents,
          Trek | null
        ]): Promise<any> => {
          const mapConfig: MapboxOptions = treksService.getMapConfigForTrekById(
            isStage && parentId ? (parentTrek as Trek) : (trek as Trek),
            offline
          );
          const commonSrc = treksService.getCommonImgSrc();
          const hydratedTrek: HydratedTrek = this.settings.getHydratedTrek(
            trek,
            commonSrc
          );
          const touristicCategoriesWithFeatures =
            this.settings.getTouristicCategoriesWithFeatures(touristicContents);

          if (
            (this.platform.is('ios') || this.platform.is('android')) &&
            environment.useFirebase
          ) {
            this.firebaseAnalytics.setCurrentScreen(
              `${trek.properties.name} map`
            );
          }

          this.connectionError = false;
          this.offline = offline;
          this.currentTrek = hydratedTrek;
          this.currentPois = pois;
          this.touristicCategoriesWithFeatures =
            touristicCategoriesWithFeatures;
          this.mapConfig = mapConfig;
          this.treksTool = treksService;
          this.commonSrc = treksService.getCommonImgSrc();
          this.trekUrl = treksService.getTrekDetailsUrl(
            (this.currentTrek as any).properties.id
          );
        },
        () => {
          this.connectionError = true;
        }
      );

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
