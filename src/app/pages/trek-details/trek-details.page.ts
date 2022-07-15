import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  AlertController,
  LoadingController,
  Platform,
  NavController
} from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin, of } from 'rxjs';
import { first } from 'rxjs/operators';
import { Share } from '@capacitor/share';
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

@Component({
  selector: 'app-trek-details',
  templateUrl: './trek-details.page.html',
  styleUrls: ['./trek-details.page.scss']
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
  public apiUrl = `${
    environment.apiUrl
  }/${this.translate.getDefaultLang()}/treks`;
  public pictures: any = [];
  public trekExtraDetails: any = {
    difficulty: '',
    practice: '',
    themes: [],
    networks: [],
    profile: ''
  };

  constructor(
    private onlineTreks: OnlineTreksService,
    private offlineTreks: OfflineTreksService,
    private route: ActivatedRoute,
    private alertController: AlertController,
    private translate: TranslateService,
    public modalController: ModalController,
    private platform: Platform,
    public settings: SettingsService,
    private loadingController: LoadingController,
    private navController: NavController
  ) {}

  ngOnInit(): void {
    this.loadTrek();
  }

  async loadTrek() {
    const offline = !!this.route.snapshot.data['offline'];
    const isStage = !!this.route.snapshot.data['isStage'];
    const trekId = +(<string>this.route.snapshot.paramMap.get('trekId'));
    const stageId = +(<string>this.route.snapshot.paramMap.get('stageId'));
    const currentTrekId = isStage ? stageId : trekId;
    const parentId: number | undefined = isStage ? trekId : undefined;
    this.isAvailableOffline = await this.offlineTreks.trekIsAvailableOffline(
      trekId
    );

    const treksService: TreksService =
      offline || this.isAvailableOffline ? this.offlineTreks : this.onlineTreks;

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
          this.connectionError = false;

          const commonSrc = await treksService.getCommonImgSrc();
          const hydratedTrek: HydratedTrek = this.settings.getHydratedTrek(
            trek,
            commonSrc
          );
          const touristicCategoriesWithFeatures =
            this.settings.getTouristicCategoriesWithFeatures(touristicContents);

          if (this.settings.data$.value) {
            this.typePois = this.settings.data$.value.find(
              (setting) => setting.id === 'poi_types'
            );
          }

          this.isItinerancy = !!(
            hydratedTrek.properties.children &&
            hydratedTrek.properties.children.features.length > 0
          );

          this.offline = offline || this.isAvailableOffline;
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

          if (
            this.currentTrek.properties.difficulty &&
            this.currentTrek.properties.difficulty.pictogram
          ) {
            this.trekExtraDetails.difficulty = await this.getPictureSrc({
              url: this.currentTrek.properties.difficulty.pictogram
            });
          }

          if (
            this.currentTrek.properties.practice &&
            this.currentTrek.properties.practice.pictogram
          ) {
            this.trekExtraDetails.practice = await this.getPictureSrc({
              url: this.currentTrek.properties.practice.pictogram
            });
          }

          if (
            this.currentTrek.properties.profile &&
            this.currentTrek.properties.profile !== ''
          ) {
            this.trekExtraDetails.profile = await this.getPictureSrc({
              url: this.currentTrek.properties.profile
            });
          }

          for (const network of this.currentTrek.properties.networks) {
            this.trekExtraDetails.networks.push({
              ...network,
              url: await this.getPictureSrc({
                url: network.pictogram
              })
            });
          }

          for (const theme of this.currentTrek.properties.themes) {
            this.trekExtraDetails.themes.push({
              ...theme,
              url: await this.getPictureSrc({ url: theme.pictogram })
            });
          }

          for (const picture of this.currentTrek.properties.pictures) {
            const url = await this.getPictureSrc(picture);
            this.pictures.push({
              picture,
              url
            });
          }

          const settings = this.settings.data$.getValue();
          if (settings) {
            this.typePois = settings.find(
              (setting) => setting.id === 'poi_types'
            );
          }
        },
        () => {
          this.connectionError = true;
        }
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
          this.isAvailableOffline =
            await this.offlineTreks.trekIsAvailableOffline(
              this.currentTrek.properties.id
            );
          this.loadTrek();
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

  public async getPictureSrc(picture: Picture | any): Promise<string> {
    return await this.treksTool.getTrekImageSrc(this.originalTrek, picture);
  }

  public refresh(): void {
    this.loadTrek();
  }

  public async shareTrek() {
    if (this.platform.is('ios') || this.platform.is('android')) {
      const onlineUrl = this.baseUrl.replace('mobile', '');
      const url =
        environment.randoVersion === 3
          ? `${onlineUrl}${this.translate.getDefaultLang()}/trek/${
              this.currentTrek.properties.id
            }-${this.currentTrek.properties.slug}/`
          : `${onlineUrl}${this.currentTrek.properties.practice.slug}/${this.currentTrek.properties.slug}/`;
      const sharingOptions = {
        text: this.currentTrek.properties.name,
        title: environment.appName,
        url
      };
      await Share.share(sharingOptions);
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
    return `/trek-details${this.offline ? '-offline' : ''}/${
      this.parentTrek.properties.id
    }/${stepId}`;
  }

  public clickDeleteConfirm($event: Event) {
    $event.stopPropagation();
    this.presentDeleteConfirm();
  }

  private async deleteTrek() {
    const translationTrekCard = await this.translate
      .get('trekCard')
      .toPromise();

    const loader = await this.loadingController.create({
      message: translationTrekCard.deletionInProgress
    });
    await loader.present();

    this.offlineTreks
      .removeTrek(this.currentTrek.properties.id, true)
      .subscribe(
        () => {
          loader.dismiss();
          this.presentDeleteConfirm(true, translationTrekCard.trekIsDelete);
          this.navController.pop();
        },
        () => {
          loader.dismiss();
          this.presentDeleteConfirm(
            true,
            translationTrekCard.errorWhileDeleting
          );
        }
      );
  }

  private async presentDeleteConfirm(isAlert?: boolean, alertMsg?: string) {
    const translationTrekCard = await this.translate
      .get('trekCard')
      .toPromise();
    const deleteConfirm = await this.alertController.create({
      header: translationTrekCard.deleteTitle,
      message: isAlert ? alertMsg : translationTrekCard.askDelete,
      buttons: isAlert
        ? [translationTrekCard.confirmButton]
        : [
            {
              text: translationTrekCard.cancelButton,
              role: 'cancel',
              cssClass: 'secondary'
            },
            {
              text: translationTrekCard.deleteLabel,
              handler: () => {
                this.deleteTrek();
              }
            }
          ]
    });

    await deleteConfirm.present();
  }
}
