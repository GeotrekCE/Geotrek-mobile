import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { OfflineTreksService } from '@app/services/offline-treks/offline-treks.service';
import { OnlineTreksService } from '@app/services/online-treks/online-treks.service';
import {
  Picture,
  Poi,
  Trek,
  DataSetting,
  Property
} from '@app/interfaces/interfaces';
import { environment } from '@env/environment';
import { PoiDetailsComponent } from '../poi-details/poi-details.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-poi',
  templateUrl: './poi.component.html',
  styleUrls: ['./poi.component.scss']
})
export class PoiComponent implements OnChanges {
  @Input() public poi!: Poi | any;
  @Input() public offline = false;
  @Input() public commonSrc!: string;
  @Input() public typePois: DataSetting | undefined;

  public baseUrl = environment.mobileApiUrl;
  public picture: Picture | null = null;
  public typeImgSrc: string | null = null;
  public currentTypePoi!: Property;
  private firstTryToLoadFromOnline = true;
  public hideImgPracticeSrc = false;

  constructor(
    public offlineTreks: OfflineTreksService,
    public onlineTreks: OnlineTreksService,
    private modalController: ModalController
  ) {}

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['poi'] || changes['offline']) {
      if (this.typePois && this.poi.properties.type) {
        this.currentTypePoi = this.typePois.values.find(
          (typePoi) => typePoi.id === this.poi.properties.type
        )!;
        if (this.currentTypePoi) {
          this.typeImgSrc = await this.offlineTreks.getTrekImageSrc(
            {} as Trek,
            { url: this.currentTypePoi.pictogram } as Picture
          );
        }
      }

      if (this.poi.properties.pictures.length > 0) {
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
    }
  }

  public onImgPracticeSrcError() {
    if (this.currentTypePoi.pictogram && this.firstTryToLoadFromOnline) {
      this.firstTryToLoadFromOnline = false;
      this.typeImgSrc = `${this.commonSrc}${this.currentTypePoi.pictogram}`;
    } else {
      this.hideImgPracticeSrc = true;
    }
  }

  public async presentPoiDetails(): Promise<void> {
    const modal = await this.modalController.create({
      component: PoiDetailsComponent,
      componentProps: {
        poi: this.poi,
        offline: this.offline,
        commonSrc: this.commonSrc
      }
    });

    return await modal.present();
  }
}
