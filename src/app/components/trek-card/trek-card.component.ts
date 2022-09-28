import { Component, Input, OnInit } from '@angular/core';
import {
  Trek,
  MinimalTrek,
  HydratedTrek,
  Picture
} from '@app/interfaces/interfaces';
import { OfflineTreksService } from '@app/services/offline-treks/offline-treks.service';
import { OnlineTreksService } from '@app/services/online-treks/online-treks.service';
import { SettingsService } from '@app/services/settings/settings.service';

@Component({
  selector: 'app-trek-card',
  templateUrl: './trek-card.component.html',
  styleUrls: ['./trek-card.component.scss']
})
export class TrekCardComponent implements OnInit {
  @Input() public trek!: Trek | MinimalTrek;
  @Input() public offline = false;
  @Input() public showAllData!: boolean;
  @Input() public isStage = false;
  @Input() public numStage = 0;
  @Input() public parentId: number | undefined = undefined;

  public hydratedTrek!: HydratedTrek;
  public imgSrc!: string;
  public routerLink!: string;
  public imgPracticeSrc!: string;
  private firstTryToLoadFromOnline = true;
  public hideImgPracticeSrc = false;
  public hideImgSrc = false;
  public days!: number;
  public hours!: number;
  public minutes!: number;

  constructor(
    public offlineTreks: OfflineTreksService,
    public onlineTreks: OnlineTreksService,
    public settings: SettingsService
  ) {}

  async ngOnInit() {
    const isAvailableOffline = await this.offlineTreks.trekIsAvailableOffline(
      this.trek.properties.id
    );
    const trekService =
      this.offline || isAvailableOffline ? this.offlineTreks : this.onlineTreks;
    this.hydratedTrek = this.settings.getHydratedTrek(
      this.trek as Trek,
      await trekService.getCommonImgSrc()
    );
    if (this.hydratedTrek.properties.practice) {
      this.imgPracticeSrc = await this.offlineTreks.getTrekImageSrc(
        {} as Trek,
        {
          url: this.hydratedTrek.properties.practice.pictogram
        } as Picture
      );
    }
    if (this.offline || isAvailableOffline) {
      this.imgSrc = await this.offlineTreks.getTrekImageSrc(this.trek as Trek);
    } else {
      this.imgSrc = this.onlineTreks.getTrekImageSrc(this.trek as Trek);
    }

    if (this.isStage) {
      this.routerLink = `/trek-details${this.offline ? '-offline' : ''}/${
        this.parentId
      }/${this.trek.properties.id}`;
    } else {
      this.routerLink = `/trek-details${this.offline ? '-offline' : ''}/${
        this.trek.properties.id
      }`;
    }
    if (this.hydratedTrek.properties.duration) {
      if (this.hydratedTrek.properties.duration < 24) {
        this.hours = this.hydratedTrek.properties.duration;
        if (this.hydratedTrek.properties.duration % 1 > 0) {
          this.minutes = 60 * (this.hydratedTrek.properties.duration % 1);
        }
      }
      else {
        this.days = this.hydratedTrek.properties.duration / 24;
      }
    }
  }

  public onImgSrcError() {
    this.hideImgSrc = true;
  }

  public onImgPracticeSrcError() {
    if (
      this.hydratedTrek.properties.practice &&
      this.firstTryToLoadFromOnline
    ) {
      this.firstTryToLoadFromOnline = false;
      this.imgPracticeSrc = this.onlineTreks.getTrekImageSrc(
        {} as Trek,
        {
          url: this.hydratedTrek.properties.practice.pictogram
        } as Picture
      );
    } else {
      this.hideImgPracticeSrc = true;
    }
  }
}
