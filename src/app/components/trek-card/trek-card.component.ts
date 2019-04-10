import { Component, Input, OnInit } from '@angular/core';
import { Trek, HydratedTrek, Picture } from '@app/interfaces/interfaces';
import { OfflineTreksService } from '@app/services/offline-treks/offline-treks.service';
import { OnlineTreksService } from '@app/services/online-treks/online-treks.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { SettingsService } from '@app/services/settings/settings.service';

@Component({
  selector: 'app-trek-card',
  templateUrl: './trek-card.component.html',
  styleUrls: ['./trek-card.component.scss'],
})
export class TrekCardComponent implements OnInit {
  @Input() public trek: Trek;
  @Input() public offline = false;
  @Input() public showAllData: boolean;
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
  ) {}

  ngOnInit() {
    this.hydratedTrek = this.settings.getHydratedTrek(this.trek);
    if (this.offline) {
      this.imgSrc = this.offlineTreks.getTrekImageSrc(this.trek);
      this.imgPracticeSrc = this.offlineTreks.getTrekImageSrc(
        {} as Trek,
        {
          url: this.hydratedTrek.properties.practice.pictogram,
        } as Picture,
      );
    } else {
      this.imgSrc = this.onlineTreks.getTrekImageSrc(this.trek);
      this.imgPracticeSrc = this.onlineTreks.getTrekImageSrc(
        {} as Trek,
        {
          url: this.hydratedTrek.properties.practice.pictogram,
        } as Picture,
      );
    }

    this.routerLink = `/app/tabs/treks${this.offline ? '-offline' : ''}/trek-details/${this.trek.properties.id}`;
  }

  public clickDeleteConfirm($event: Event) {
    $event.stopPropagation();
    this.presentDeleteConfirm();
  }

  private async deleteTrek() {
    const loader = await this.loadingController.create({
      message: 'Suppression en cours',
    });
    await loader.present();

    this.offlineTreks.removeTrek(this.trek.properties.id, true).subscribe(trekRemoved => {
      loader.dismiss();
      this.presentDeleteConfirm(
        true,
        trekRemoved
          ? 'La randonnée est supprimée du mode hors ligne'
          : 'Une erreur est survenue lors de la suppression de la randonnée',
      );
    });
  }

  private async presentDeleteConfirm(isAlert?: boolean, alertMsg?: string) {
    const deleteConfirm = await this.alertController.create({
      header: 'Suppression',
      message: isAlert ? alertMsg : `Supprimer cette randonnée du mode hors ligne ?`,
      buttons: isAlert
        ? ['OK']
        : [
            {
              text: 'Annuler',
              role: 'cancel',
              cssClass: 'secondary',
            },
            {
              text: 'Supprimer',
              handler: () => {
                this.deleteTrek();
              },
            },
          ],
    });

    await deleteConfirm.present();
  }
}
