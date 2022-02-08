import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy
} from '@angular/core';
import {
  Trek,
  MinimalTrek,
  HydratedTrek,
  Picture
} from '@app/interfaces/interfaces';
import { OfflineTreksService } from '@app/services/offline-treks/offline-treks.service';
import { OnlineTreksService } from '@app/services/online-treks/online-treks.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { SettingsService } from '@app/services/settings/settings.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-trek-card',
  templateUrl: './trek-card.component.html',
  styleUrls: ['./trek-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrekCardComponent implements OnInit {
  @Input() public trek: Trek | MinimalTrek;
  @Input() public offline = false;
  @Input() public showAllData: boolean;
  @Input() public isStage = false;
  @Input() public numStage = 0;
  @Input() public parentId: number | undefined = undefined;

  public hydratedTrek: HydratedTrek;
  public imgSrc: string;
  public routerLink: string;
  public imgPracticeSrc: string;

  constructor(
    private alertController: AlertController,
    private loadingController: LoadingController,
    public offlineTreks: OfflineTreksService,
    public onlineTreks: OnlineTreksService,
    public settings: SettingsService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    const trekService = this.offline ? this.offlineTreks : this.onlineTreks;
    this.hydratedTrek = this.settings.getHydratedTrek(
      this.trek as Trek,
      trekService.getCommonImgSrc()
    );
    if (this.offline) {
      this.imgSrc = this.offlineTreks.getTrekImageSrc(this.trek as Trek);
      if (this.hydratedTrek.properties.practice) {
        this.imgPracticeSrc = this.offlineTreks.getTrekImageSrc(
          {} as Trek,
          {
            url: this.hydratedTrek.properties.practice.pictogram
          } as Picture
        );
      }
    } else {
      this.imgSrc = this.onlineTreks.getTrekImageSrc(this.trek as Trek);
      if (this.hydratedTrek.properties.practice) {
        this.imgPracticeSrc = this.onlineTreks.getTrekImageSrc(
          {} as Trek,
          {
            url: this.hydratedTrek.properties.practice.pictogram
          } as Picture
        );
      }
    }

    if (this.isStage) {
      this.routerLink = `/trek-details${this.offline ? '-offline' : ''}/${
        this.parentId
      }/${this.trek.properties.id}`;
    } else {
      this.routerLink = `/trek-details${this.offline ? '-offline' : ''}/${
        this.trek.properties.id
      }`;
    }
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
      .removeTrek(
        this.isStage && this.parentId ? this.parentId : this.trek.properties.id,
        true
      )
      .subscribe(
        () => {},
        () => {
          loader.dismiss();
          this.presentDeleteConfirm(
            true,
            translationTrekCard.errorWhileDeleting
          );
        },
        () => {
          loader.dismiss();
          this.presentDeleteConfirm(true, translationTrekCard.trekIsDelete);
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
