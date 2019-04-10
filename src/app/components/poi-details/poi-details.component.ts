import { Component } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

import { environment } from '@env/environment';
import { Poi } from '@app/interfaces/interfaces';

@Component({
  selector: 'app-poi-details',
  templateUrl: './poi-details.component.html',
  styleUrls: ['./poi-details.component.scss'],
})
export class PoiDetailsComponent {
  baseUrl = environment.onlineBaseUrl;
  poi: Poi;
  poiImg = '';

  constructor(public modalCtrl: ModalController, public navParams: NavParams) {}

  ionViewWillEnter() {
    this.poi = this.navParams.get('poi');
    if (
      this.poi &&
      this.poi.properties &&
      this.poi.properties.pictures &&
      this.poi.properties.pictures.length > 0 &&
      this.poi.properties.pictures[0].url
    ) {
      this.poiImg = `${this.baseUrl}${this.poi.properties.pictures[0].url}`;
    }
  }

  close(): void {
    this.modalCtrl.dismiss();
  }
}
