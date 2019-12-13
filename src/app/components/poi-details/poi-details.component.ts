import { Component } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

import { OfflineTreksService } from '@app/services/offline-treks/offline-treks.service';
import { OnlineTreksService } from '@app/services/online-treks/online-treks.service';
import { environment } from '@env/environment';
import { Poi, Picture, Trek } from '@app/interfaces/interfaces';
import { SettingsService } from '@app/services/settings/settings.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-poi-details',
  templateUrl: './poi-details.component.html',
  styleUrls: ['./poi-details.component.scss']
})
export class PoiDetailsComponent {
  public offline = false;
  public baseUrl = environment.onlineBaseUrl;
  public poi: Poi;
  public poiImg = '';
  public typeImgSrc: string | null = null;
  public settingsSub: Subscription;
  public picture: Picture | null = null;
  public commonSrc: string;

  constructor(
    public modalCtrl: ModalController,
    public navParams: NavParams,
    public settings: SettingsService,
    public offlineTreks: OfflineTreksService,
    public onlineTreks: OnlineTreksService
  ) {}

  ionViewWillEnter() {
    this.poi = this.navParams.get('poi');
    this.offline = this.navParams.get('offline');
    this.commonSrc = this.navParams.get('commonSrc');

    if (
      this.poi &&
      this.poi.properties &&
      this.poi.properties.pictures &&
      this.poi.properties.pictures.length > 0 &&
      this.poi.properties.pictures[0].url
    ) {
      this.picture = this.poi.properties.pictures[0];
      if (this.offline) {
        this.picture = {
          ...this.poi.properties.pictures[0],
          url: this.offlineTreks.getTrekImageSrc(
            {} as Trek,
            this.poi.properties.pictures[0]
          )
        };
      } else {
        this.picture = {
          ...this.poi.properties.pictures[0],
          url: this.onlineTreks.getTrekImageSrc(
            {} as Trek,
            this.poi.properties.pictures[0]
          )
        };
      }
    } else {
      this.picture = null;
    }

    this.settingsSub = this.settings.data$.subscribe((settings) => {
      if (settings) {
        const typePois = settings.find((setting) => setting.id === 'poi_types');

        if (typePois && this.poi.properties.type) {
          const currentTypePoi = typePois.values.find(
            (typePoi) => typePoi.id === this.poi.properties.type
          );
          if (currentTypePoi) {
            this.typeImgSrc = this.commonSrc + currentTypePoi.pictogram;
          }
        }
      }
    });
  }

  close(): void {
    this.settingsSub.unsubscribe();
    this.modalCtrl.dismiss();
  }
}
