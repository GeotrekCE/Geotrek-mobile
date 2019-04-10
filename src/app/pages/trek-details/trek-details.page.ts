import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
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
} from '@app/interfaces/interfaces';
import { OfflineTreksService } from '@app/services/offline-treks/offline-treks.service';
import { OnlineTreksService } from '@app/services/online-treks/online-treks.service';
import { environment } from '@env/environment';
import { ModalController } from '@ionic/angular';
import { ProgressComponent } from '@app/components/progress/progress.component';

@Component({
  selector: 'app-trek-details',
  templateUrl: './trek-details.page.html',
  styleUrls: ['./trek-details.page.scss'],
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
  public mapLink: string;
  public treksTool: TreksService; // the accurate treks service
  public treksUrl = '';
  public connectionError = false;
  public commonSrc: string;
  public trekDownloading = false;

  constructor(
    private onlineTreks: OnlineTreksService,
    private offlineTreks: OfflineTreksService,
    private route: ActivatedRoute,
    private alertController: AlertController,
    private translate: TranslateService,
    private router: Router,
    public modalController: ModalController,
  ) {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.subscriptions$$.push(
      this.route.data.subscribe(
        (data: Data): void => {
          const context: TrekContext | null | 'connectionError' = data.context;
          if (context === 'connectionError') {
            this.connectionError = true;
          } else {
            this.connectionError = false;
            if (context !== null) {
              this.offline = context.offline;
              this.currentTrek = context.trek;
              this.originalTrek = context.originalTrek;
              this.currentPois = context.pois.features;
              this.treksTool = context.treksTool;
              this.touristicContents = context.touristicContents;
              this.touristicCategoriesWithFeatures = context.touristicCategoriesWithFeatures;
              this.touristicEvents = context.touristicEvents.features;
              this.treksUrl = this.treksTool.getTreksUrl();
              this.commonSrc = context.commonSrc;
              this.mapLink = context.treksTool.getTrekMapUrl(context.trek.properties.id);
            }
          }
        },
      ),
    );
  }

  async downloadTrek() {
    const simpleTrek = this.onlineTreks.getMinimalTrekById(this.currentTrek.properties.id);
    if (!simpleTrek) {
      return;
    }
    this.offlineTreks.createNewProgressStream();

    this.trekDownloading = true;
    const modalProgress = await this.modalController.create({
      component: ProgressComponent,
      cssClass: 'progress-modal',
    });
    await modalProgress.present();

    this.offlineTreks.saveTrek(simpleTrek, this.originalTrek, this.currentPois, this.touristicContents).subscribe(
      saveResult => {
        this.trekDownloading = false;
        modalProgress.dismiss();
        this.presentDownloadConfirm(true, saveResult);
      },
      saveResult => {
        this.trekDownloading = false;
        modalProgress.dismiss();
        this.presentDownloadConfirm(true, saveResult);
      },
    );
  }

  public async presentDownloadConfirm(isAlert?: boolean, success?: boolean) {
    await this.translate.get('trek.downloadAlert').subscribe(async trad => {
      const downloadConfirm = await this.alertController.create({
        header: trad.title,
        message: isAlert ? (success ? trad.success : trad.error) : trad.content,
        buttons: isAlert
          ? [trad.confirmError]
          : [
              {
                text: trad.cancelButton,
                role: 'cancel',
                cssClass: 'secondary',
              },
              {
                text: trad.confirmButton,
                handler: () => {
                  this.downloadTrek();
                },
              },
            ],
      });

      await downloadConfirm.present();
    });
  }

  public getPictureSrc(picture: Picture): string {
    return this.treksTool.getTrekImageSrc(this.originalTrek, picture);
  }

  public refresh() {
    this.router.navigate([this.router.url]);
  }
}
