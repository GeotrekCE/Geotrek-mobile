import { Component, OnInit, Input } from '@angular/core';
import { Picture, Trek } from '@app/interfaces/interfaces';
import { OfflineTreksService } from '@app/services/offline-treks/offline-treks.service';
import { environment } from '@env/environment';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-select-trek',
  templateUrl: './select-trek.component.html',
  styleUrls: ['./select-trek.component.scss']
})
export class SelectTrekComponent implements OnInit {
  @Input() public radioTreks!: {
    id: number;
    name: string;
    imgPractice: { src: string; color: string | undefined };
  }[];
  public baseUrl = environment.mobileApiUrl;
  public selectedTrekId!: number;
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
    this.selectedTrekId = this.radioTreks[0].id;
    for (const radioTrek of this.radioTreks) {
      this.imgPractices.push({
        ...radioTrek.imgPractice,
        src: await this.offlineTreks.getTrekImageSrc(
          {} as Trek,
          {
            url: radioTrek.imgPractice.src
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
    this.modalController.dismiss({ selectedTrekId: this.selectedTrekId });
  }

  public selectedTrekChange(evt: any): void {
    this.selectedTrekId = evt.detail.value;
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
