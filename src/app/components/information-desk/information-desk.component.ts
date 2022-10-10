import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { OfflineTreksService } from '@app/services/offline-treks/offline-treks.service';
import { OnlineTreksService } from '@app/services/online-treks/online-treks.service';
import { Trek, InformationDesk } from '@app/interfaces/interfaces';
import { ModalController } from '@ionic/angular';
import { InformationDeskDetailsComponent } from '../information-desk-details/information-desk-details.component';

@Component({
  selector: 'app-information-desk',
  templateUrl: './information-desk.component.html',
  styleUrls: ['./information-desk.component.scss']
})
export class InformationDeskComponent implements OnChanges {
  @Input() public informationDesk!: InformationDesk;
  @Input() public offline = false;

  public picture: string | null = null;

  constructor(
    public offlineTreks: OfflineTreksService,
    public onlineTreks: OnlineTreksService,
    private modalController: ModalController
  ) {}

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['informationDesk'] || changes['offline']) {
      if (this.informationDesk.picture) {
        if (this.offline) {
          this.picture = await this.offlineTreks.getTrekImageSrc(
            {} as Trek,
            { url: this.informationDesk.picture } as any
          );
        } else {
          this.picture = this.onlineTreks.getTrekImageSrc(
            {} as Trek,
            { url: this.informationDesk.picture } as any
          );
        }
      } else {
        this.picture = null;
      }
    }
  }

  public async presentInformationDeskDetails(): Promise<void> {
    const modal = await this.modalController.create({
      component: InformationDeskDetailsComponent,
      componentProps: {
        informationDesk: this.informationDesk,
        offline: this.offline
      }
    });
    return await modal.present();
  }
}
