import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

import { InformationDesk, Trek } from '@app/interfaces/interfaces';
import { OfflineTreksService } from '@app/services/offline-treks/offline-treks.service';
import { OnlineTreksService } from '@app/services/online-treks/online-treks.service';

@Component({
  selector: 'app-information-desk-details',
  templateUrl: './information-desk-details.component.html',
  styleUrls: ['./information-desk-details.component.scss']
})
export class InformationDeskDetailsComponent implements OnInit {
  public offline = false;
  public informationDesk!: InformationDesk;
  public informationDeskPicture: string | null = null;

  constructor(
    public modalCtrl: ModalController,
    public navParams: NavParams,
    public offlineTreks: OfflineTreksService,
    public onlineTreks: OnlineTreksService
  ) {}

  async ngOnInit() {
    this.informationDesk = this.navParams.get('informationDesk');
    this.offline = this.navParams.get('offline');
    if (this.informationDesk.picture) {
      if (this.offline) {
        this.informationDeskPicture = await this.offlineTreks.getTrekImageSrc(
          {} as Trek,
          { url: this.informationDesk.picture } as any
        );
      } else {
        this.informationDeskPicture = this.onlineTreks.getTrekImageSrc(
          {} as Trek,
          { url: this.informationDesk.picture } as any
        );
      }
    } else {
      this.informationDeskPicture = null;
    }
  }

  close(): void {
    this.modalCtrl.dismiss();
  }
}
