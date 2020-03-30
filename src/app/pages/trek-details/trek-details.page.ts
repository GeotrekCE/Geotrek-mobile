import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { AlertController, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics/ngx';
import { UnSubscribe } from '@app/components/abstract/unsubscribe';
import {
  HydratedTrek,
  Picture,
  Poi,
  Trek,
  TrekContext,
  TreksService,
  TouristicEvent,
  TouristicCategoryWithFeatures,
  TouristicContents,
  DataSetting
} from '@app/interfaces/interfaces';
import { OfflineTreksService } from '@app/services/offline-treks/offline-treks.service';
import { OnlineTreksService } from '@app/services/online-treks/online-treks.service';
import { environment } from '@env/environment';
import { ModalController } from '@ionic/angular';
import { ProgressComponent } from '@app/components/progress/progress.component';
import { SettingsService } from '@app/services/settings/settings.service';

@Component({
  selector: 'app-trek-details',
  templateUrl: './trek-details.page.html',
  styleUrls: ['./trek-details.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrekDetailsPage extends UnSubscribe implements OnInit, OnDestroy {
  public originalTrek: Trek;
  public currentTrek: HydratedTrek;
  public offline = false;
  public currentPois: Poi[];
  public touristicEvents: TouristicEvent[];
  public touristicContents: TouristicContents;
  public touristicCategoriesWithFeatures: TouristicCategoryWithFeatures[];
  public baseUrl = environment.onlineBaseUrl;
  public showImgRulesIfParkCentered =
    environment.trekDetails.showImgRulesIfParkCentered;
  public mapLink: string;
  public treksTool: TreksService; // the accurate treks service
  public treksUrl = '';
  public connectionError = false;
  public commonSrc: string;
  public typePois: DataSetting | undefined;
  public poiCollapseInitialSize = environment.poiCollapseInitialSize;
  public touristicContentCollapseInitialSize =
    environment.touristicContentCollapseInitialSize;
  public isItinerancy = false;
  public isStage = false;
  public stageIndex: number;
  public parentTrek: Trek;
  public previousTrek: Trek;
  public nextTrek: Trek;

  constructor(
    private onlineTreks: OnlineTreksService,
    private offlineTreks: OfflineTreksService,
    private route: ActivatedRoute,
    private alertController: AlertController,
    private translate: TranslateService,
    private router: Router,
    public modalController: ModalController,
    private socialSharing: SocialSharing,
    private platform: Platform,
    public settings: SettingsService,
    private firebaseAnalytics: FirebaseAnalytics,
    private ref: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  ionViewDidEnter(): void {
    this.subscriptions$$.push(
      this.route.data.subscribe((data: Data): void => {
        const context: TrekContext | null | 'connectionError' = data.context;
        if (context === 'connectionError') {
          this.connectionError = true;
        } else {
          this.connectionError = false;
          if (context !== null) {
            this.isItinerancy = !!(
              context.trek.properties.children &&
              context.trek.properties.children.features.length > 0
            );

            this.offline = context.offline;
            this.currentTrek = context.trek;
            this.originalTrek = context.originalTrek;
            this.currentPois = context.pois.features;
            this.treksTool = context.treksTool;
            this.touristicContents = context.touristicContents;
            this.touristicCategoriesWithFeatures =
              context.touristicCategoriesWithFeatures;
            this.touristicEvents = context.touristicEvents.features;
            this.treksUrl = this.treksTool.getTreksUrl();
            this.commonSrc = context.commonSrc;
            this.mapLink = context.treksTool.getTrekMapUrl(
              context.trek.properties.id,
              context.parentTrek ? context.parentTrek.properties.id : undefined
            );
            this.isStage = context.isStage;
            if (context.isStage && context.parentTrek) {
              this.parentTrek = context.parentTrek;

              this.stageIndex = this.parentTrek.properties.children.features.findIndex(
                (children) =>
                  children.properties.id === this.currentTrek.properties.id
              );

              if (this.stageIndex > 0) {
                this.previousTrek = this.parentTrek.properties.children.features[
                  this.stageIndex - 1
                ];
              }

              if (
                this.stageIndex <
                this.parentTrek.properties.children.features.length
              ) {
                this.nextTrek = this.parentTrek.properties.children.features[
                  this.stageIndex + 1
                ];
              }
            }

            this.ref.markForCheck();
          }
        }
      }),
      this.settings.data$.subscribe((settings) => {
        if (settings) {
          this.typePois = settings.find(
            (setting) => setting.id === 'poi_types'
          );
          this.ref.markForCheck();
        }
      })
    );
  }

  async downloadTrek() {
    const simpleTrek = this.onlineTreks.getMinimalTrekById(
      !this.isStage
        ? this.currentTrek.properties.id
        : this.parentTrek.properties.id
    );
    const pois: any = !this.isStage
      ? this.currentPois
      : await this.onlineTreks
          .getPoisForTrekById(this.parentTrek.properties.id)
          .toPromise();
    const touristicContents: any = !this.isStage
      ? this.currentPois
      : await this.onlineTreks
          .getTouristicContentsForTrekById(this.parentTrek.properties.id)
          .toPromise();

    if (!simpleTrek) {
      return;
    }

    this.offlineTreks.createNewProgressStream();

    const modalProgress = await this.modalController.create({
      component: ProgressComponent,
      cssClass: 'progress-modal'
    });
    await modalProgress.present();

    // treksService.getPoisForTrekById(currentTrekId, parentId),
    // treksService.getTouristicContentsForTrekById(currentTrekId, parentId),

    this.offlineTreks
      .saveTrek(
        simpleTrek,
        !this.isStage ? this.originalTrek : this.parentTrek,
        pois,
        touristicContents
      )
      .subscribe(
        (saveResult) => {
          modalProgress.dismiss();
          this.presentDownloadConfirm(true, saveResult);
          if (
            (this.platform.is('ios') || this.platform.is('android')) &&
            environment.useFirebase
          ) {
            this.firebaseAnalytics.logEvent(
              `Download ${this.currentTrek.properties.name}`,
              {
                download: this.currentTrek.properties.name
              }
            );
          }
        },
        (saveResult) => {
          modalProgress.dismiss();
          this.presentDownloadConfirm(true, saveResult);
        }
      );
  }

  public async presentDownloadConfirm(isAlert?: boolean, success?: boolean) {
    await this.translate.get('trek.downloadAlert').subscribe(async (trad) => {
      const downloadConfirm = await this.alertController.create({
        header: trad.titleTrek,
        message: isAlert
          ? success
            ? trad.success
            : trad.error
          : !this.isItinerancy && !this.isStage
          ? trad.contentTrek
          : trad.contentItinerancy,
        buttons: isAlert
          ? [trad.confirmError]
          : [
              {
                text: trad.cancelButton,
                role: 'cancel',
                cssClass: 'secondary'
              },
              {
                text: trad.confirmButton,
                handler: () => {
                  this.downloadTrek();
                }
              }
            ]
      });

      await downloadConfirm.present();
    });
  }

  public getPictureSrc(picture: Picture): string {
    return this.treksTool.getTrekImageSrc(this.originalTrek, picture);
  }

  public refresh(): void {
    this.router.navigate([this.router.url]);
  }

  public shareTrek(): void {
    if (this.platform.is('ios') || this.platform.is('android')) {
      const onlineUrl = this.baseUrl.replace('mobile', '');
      const sharingOptions = {
        message: this.currentTrek.properties.name,
        subject: environment.appName,
        url: `${onlineUrl}${this.currentTrek.properties.practice.slug}/${this.currentTrek.properties.slug}/`
      };
      this.socialSharing.shareWithOptions(sharingOptions).then(() => {
        if (
          (this.platform.is('ios') || this.platform.is('android')) &&
          environment.useFirebase
        ) {
          this.firebaseAnalytics.logEvent(
            `Share ${this.currentTrek.properties.name}`,
            {
              name: this.currentTrek.properties.name
            }
          );
        }
      });
    }
  }

  public scrollToStages(stages: any): void {
    stages.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest'
    });
  }

  public goToStep(stepId: number): string {
    return `/app/tabs/treks${this.offline ? '-offline' : ''}/trek-details/${
      this.parentTrek.properties.id
    }/${stepId}`;
  }
}
