import { Component, OnInit, Input } from '@angular/core';
import { Picture, Trek } from '@app/interfaces/interfaces';
import { OfflineTreksService } from '@app/services/offline-treks/offline-treks.service';
import { environment } from '@env/environment';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-select-poi',
  templateUrl: './select-poi.component.html',
  styleUrls: ['./select-poi.component.scss']
})
export class SelectPoiComponent implements OnInit {
  @Input() public themePois!: string;
  @Input() public radioPois!: {
    id: number;
    name: string;
    imgPoi: { src: string; color: string | undefined };
    imgTypePoi: { src: string; color: string | undefined };
  }[];
  public baseUrl = environment.mobileApiUrl;
  public selectedPoiId!: number;
  public imgPractices: {
    src: string;
    color: string | undefined;
    firstTryToLoadFromOnline: boolean;
    hideImgPracticeSrc: boolean;
  }[] = [];

  constructor(
    private modalController: ModalController,
    public offlineTreks: OfflineTreksService
  ) {}

  async ngOnInit() {
    this.selectedPoiId = this.radioPois[0].id;
    for (const radioPoi of this.radioPois) {
      this.imgPractices.push({
        ...radioPoi.imgTypePoi,
        src: await this.offlineTreks.getTrekImageSrc(
          {} as Trek,
          {
            url: radioPoi.imgTypePoi.src
          } as Picture
        ),
        firstTryToLoadFromOnline: true,
        hideImgPracticeSrc: false
      });
    }
  }

  public cancel(): void {
    this.modalController.dismiss();
  }

  public select(): void {
    this.modalController.dismiss({ selectedPoiId: this.selectedPoiId });
  }

  public selectedPoiChange(evt: any): void {
    this.selectedPoiId = evt.detail.value;
  }

  public onImgPracticeSrcError(i: number) {
    if (
      this.imgPractices[i].src &&
      this.imgPractices[i].firstTryToLoadFromOnline
    ) {
      this.imgPractices[i].firstTryToLoadFromOnline = false;
      this.imgPractices[i].src = `${this.baseUrl}${this.imgPractices[i].src}`;
    } else {
      this.imgPractices[i].hideImgPracticeSrc = true;
    }
  }
}
