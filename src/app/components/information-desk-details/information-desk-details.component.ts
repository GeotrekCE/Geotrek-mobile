import { Component } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

import { environment } from '@env/environment';
import { InformationDesk } from '@app/interfaces/interfaces';

@Component({
  selector: 'app-information-desk-details',
  templateUrl: './information-desk-details.component.html',
  styleUrls: ['./information-desk-details.component.scss'],
})
export class InformationDeskDetailsComponent {
  baseUrl = environment.onlineBaseUrl;
  informationDesk: InformationDesk;
  informationDeskPicture = '';

  constructor(public modalCtrl: ModalController, public navParams: NavParams) {}

  ionViewWillEnter() {
    this.informationDesk = this.navParams.get('informationDesk');
    if (this.informationDesk && this.informationDesk.picture) {
      this.informationDeskPicture = `${this.baseUrl}${this.informationDesk.picture}`;
    }
  }

  close(): void {
    this.modalCtrl.dismiss();
  }
}
