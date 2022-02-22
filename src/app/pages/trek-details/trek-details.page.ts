import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics/ngx';
import {
  HydratedTrek,
  Picture,
  Poi,
  Trek,
  TreksService,
  TouristicEvent,
  TouristicCategoryWithFeatures,
  TouristicContents,
  DataSetting,
  Pois,
  TouristicEvents
} from '@app/interfaces/interfaces';
import { OfflineTreksService } from '@app/services/offline-treks/offline-treks.service';
import { OnlineTreksService } from '@app/services/online-treks/online-treks.service';
import { environment } from '@env/environment';
import { ModalController } from '@ionic/angular';
import { ProgressComponent } from '@app/components/progress/progress.component';
import { SettingsService } from '@app/services/settings/settings.service';
import { forkJoin, of } from 'rxjs';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-trek-details',
  templateUrl: './trek-details.page.html',
  styleUrls: ['./trek-details.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrekDetailsPage implements OnInit {
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
  public treksTool: TreksService;
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
  public isAvailableOffline = false;
  public apiUrl = `${environment.onlineBaseUrl.replace(
    'mobile',
    'api'
  )}/${this.translate.getDefaultLang()}/treks`;

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
              `${trek.properties.name} details`
            );
          }

          this.connectionError = false;
          this.isAvailableOffline =
            await this.offlineTreks.trekIsAvailableOffline(
              hydratedTrek.properties.id
            );

          if (this.settings.data$.value) {
            this.typePois = this.settings.data$.value.find(
              (setting) => setting.id === 'poi_types'
            );
          }

          this.isItinerancy = !!(
            hydratedTrek.properties.children &&
            hydratedTrek.properties.children.features.length > 0
          );

          this.offline = offline;
          this.currentTrek = hydratedTrek;
          this.originalTrek = trek;
          this.currentPois = pois.features;
          this.treksTool = treksService;
          this.touristicContents = touristicContents;
          this.touristicCategoriesWithFeatures =
            touristicCategoriesWithFeatures;
          this.touristicEvents = touristicEvents.features;
          this.treksUrl = this.treksTool.getTreksUrl();
          this.commonSrc = commonSrc;
          this.mapLink = this.treksTool.getTrekMapUrl(
            hydratedTrek.properties.id,
            parentTrek ? parentTrek.properties.id : undefined
          );

          this.isStage = isStage;
          if (isStage && parentTrek) {
            this.parentTrek = parentTrek;

            this.stageIndex =
              this.parentTrek.properties.children.features.findIndex(
                (children) =>
                  children.properties.id === this.currentTrek.properties.id
              );

            if (this.stageIndex > 0) {
              this.previousTrek =
                this.parentTrek.properties.children.features[
                  this.stageIndex - 1
                ];
            }

            if (
              this.stageIndex <
              this.parentTrek.properties.children.features.length
            ) {
              this.nextTrek =
                this.parentTrek.properties.children.features[
                  this.stageIndex + 1
                ];
            }
          }
          this.ref.markForCheck();
        }
      ),
      () => {
        this.connectionError = true;
      };
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

    this.offlineTreks
      .saveTrek(
        simpleTrek,
        !this.isStage ? this.originalTrek : this.parentTrek,
        pois,
        touristicContents
      )
      .subscribe(
        async (saveResult) => {
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
          this.isAvailableOffline =
            await this.offlineTreks.trekIsAvailableOffline(
              this.currentTrek.properties.id
            );
          this.ref.markForCheck();
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

  public getPictureSrc(picture: Picture | any): string {
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
    return `/app/trek-details${this.offline ? '-offline' : ''}/${
      this.parentTrek.properties.id
    }/${stepId}`;
  }
}
