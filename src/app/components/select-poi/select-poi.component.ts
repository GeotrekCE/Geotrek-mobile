import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-select-poi',
  templateUrl: './select-poi.component.html',
  styleUrls: ['./select-poi.component.scss']
})
export class SelectPoiComponent implements OnInit {
  @Input() public themePois: string;
  @Input() public radioPois: {
    id: number;
    name: string;
    imgPoi: { src: string; color: string | undefined };
    imgTypePoi: { src: string; color: string | undefined };
  }[];
  selectedPoiId: number;

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    this.selectedPoiId = this.radioPois[0].id;
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
}
