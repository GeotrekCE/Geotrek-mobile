import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

import { environment } from '@env/environment';
import { InformationDesk } from '@app/interfaces/interfaces';

@Component({
  selector: 'app-information-desk-details',
  templateUrl: './information-desk-details.component.html',
  styleUrls: ['./information-desk-details.component.scss']
})
export class InformationDeskDetailsComponent implements OnInit {
  public baseUrl = environment.mobileApiUrl;
  public informationDesk: InformationDesk;
  public informationDeskPicture = '';

  constructor(public modalCtrl: ModalController, public navParams: NavParams) {}

  ngOnInit() {
    this.informationDesk = this.navParams.get('informationDesk');
    if (this.informationDesk && this.informationDesk.picture) {
      this.informationDeskPicture = `${this.baseUrl}${this.informationDesk.picture}`;
    }
  }

  close(): void {
    this.modalCtrl.dismiss();
  }
}
