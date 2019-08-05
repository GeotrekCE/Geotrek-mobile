import { Component, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { OfflineTreksService } from '@app/services/offline-treks/offline-treks.service';
import { OnlineTreksService } from '@app/services/online-treks/online-treks.service';
import { Picture, Poi, Trek, DataSetting } from '@app/interfaces/interfaces';
import { environment } from '@env/environment';

@Component({
  selector: 'app-poi',
  templateUrl: './poi.component.html',
  styleUrls: ['./poi.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PoiComponent implements OnChanges {
  @Input() public poi: Poi;
  @Input() public offline = false;
  @Input() public commonSrc: string;
  @Input() public typePois: DataSetting | undefined;

  public baseUrl = environment.onlineBaseUrl;
  public picture: Picture | null = null;
  public typeImgSrc: string | null = null;

  constructor(public offlineTreks: OfflineTreksService, public onlineTreks: OnlineTreksService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.poi) {
      if (this.typePois && this.poi.properties.type) {
        const currentTypePoi = this.typePois.values.find(typePoi => typePoi.id === this.poi.properties.type);
        if (currentTypePoi) {
          this.typeImgSrc = this.commonSrc + currentTypePoi.pictogram;
        }
      }

      if (this.poi.properties.pictures.length > 0) {
        this.picture = this.poi.properties.pictures[0];
        if (this.offline) {
          this.picture = {
            ...this.poi.properties.pictures[0],
            url: this.offlineTreks.getTrekImageSrc({} as Trek, this.poi.properties.pictures[0]),
          };
        } else {
          this.picture = {
            ...this.poi.properties.pictures[0],
            url: this.onlineTreks.getTrekImageSrc({} as Trek, this.poi.properties.pictures[0]),
          };
        }
      } else {
        this.picture = null;
      }
    }
  }
}
