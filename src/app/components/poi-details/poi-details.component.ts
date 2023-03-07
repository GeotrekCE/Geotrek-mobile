import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, Platform } from '@ionic/angular';

import { OfflineTreksService } from '@app/services/offline-treks/offline-treks.service';
import { OnlineTreksService } from '@app/services/online-treks/online-treks.service';
import { environment } from '@env/environment';
import { Poi, Picture, Trek, Property } from '@app/interfaces/interfaces';
import { SettingsService } from '@app/services/settings/settings.service';
import { Subscription } from 'rxjs';
import { AppLauncher } from '@capacitor/app-launcher';

@Component({
  selector: 'app-poi-details',
  templateUrl: './poi-details.component.html',
  styleUrls: ['./poi-details.component.scss']
})
export class PoiDetailsComponent implements OnInit {
  public offline = false;
  public baseUrl = environment.mobileApiUrl;
  public poi!: Poi;
  public poiImg = '';
  public typeImgSrc: string | null = null;
  public settingsSub!: Subscription;
  public picture: Picture | null = null;
  public commonSrc!: string;
  private currentTypePoi!: Property;
  private firstTryToLoadFromOnline = true;
  public hideImgPracticeSrc = false;
  public showGoToPoi = environment.showGoToPoi;

  constructor(
    public modalCtrl: ModalController,
    public navParams: NavParams,
    public settings: SettingsService,
    public offlineTreks: OfflineTreksService,
    public onlineTreks: OnlineTreksService,
    private platform: Platform
  ) {}

  async ngOnInit() {
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
          url: await this.offlineTreks.getTrekImageSrc(
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

    this.settingsSub = this.settings.data$.subscribe(async (settings) => {
      if (settings) {
        const typePois = settings.find((setting) => setting.id === 'poi_types');

        if (typePois && this.poi.properties.type) {
          this.currentTypePoi = typePois.values.find(
            (typePoi) => typePoi.id === this.poi.properties.type
          )!;
          if (this.currentTypePoi) {
            this.typeImgSrc = await this.offlineTreks.getTrekImageSrc(
              {} as Trek,
              { url: this.currentTypePoi.pictogram } as Picture
            );
          }
        }
      }
    });
  }

  close(): void {
    this.settingsSub.unsubscribe();
    this.modalCtrl.dismiss();
  }

  public onImgPracticeSrcError() {
    if (this.currentTypePoi.pictogram && this.firstTryToLoadFromOnline) {
      this.firstTryToLoadFromOnline = false;
      this.typeImgSrc = `${this.commonSrc}${this.currentTypePoi.pictogram}`;
    } else {
      this.hideImgPracticeSrc = true;
    }
  }

  async goToPoi() {
    const point = [
      this.poi.geometry.coordinates[1],
      this.poi.geometry.coordinates[0]
    ].toString();

    if (this.platform.is('android')) {
      if (
        (
          await AppLauncher.canOpenUrl({
            url: `google.navigation:q=${point}`
          })
        ).value
      ) {
        await AppLauncher.openUrl({
          url: `google.navigation:q=${point}`
        });
      } else {
        window.open(`https://www.google.fr/maps/dir//${point}`, '_blank');
      }
    } else if (this.platform.is('ios')) {
      if (
        (
          await AppLauncher.canOpenUrl({
            url: `maps://?daddr=${point}`
          })
        ).value
      ) {
        await AppLauncher.openUrl({
          url: `maps://?daddr=${point}`
        });
      } else {
        window.open(`https://maps.apple.com/?daddr=${point}`, '_blank');
      }
    }
  }
}
