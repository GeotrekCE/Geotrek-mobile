import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FilterValue, Picture, Trek } from '@app/interfaces/interfaces';
import { OfflineTreksService } from '@app/services/offline-treks/offline-treks.service';

@Component({
  selector: 'app-filter-value',
  templateUrl: './filter-value.component.html',
  styleUrls: ['./filter-value.component.scss']
})
export class FilterValueComponent implements OnInit {
  @Input() value: FilterValue;
  @Input() commonSrc: string;
  @Output() public valueChange = new EventEmitter<{
    checked: boolean;
    value: FilterValue;
  }>();
  public imgPracticeSrc: string;
  private firstTryToLoadFromOnline = true;
  public hideImgPracticeSrc = false;

  constructor(public offlineTreks: OfflineTreksService) {}

  async ngOnInit() {
    this.imgPracticeSrc = await this.offlineTreks.getTrekImageSrc(
      {} as Trek,
      {
        url: this.value.pictogram
      } as Picture
    );
  }

  public valueCheckChanged($event: any, value: FilterValue) {
    this.valueChange.emit({ checked: $event.detail.checked, value: value });
  }

  public onImgPracticeSrcError() {
    if (this.value.pictogram && this.firstTryToLoadFromOnline) {
      this.firstTryToLoadFromOnline = false;
      this.imgPracticeSrc = this.commonSrc + this.value.pictogram;
    } else {
      this.hideImgPracticeSrc = true;
    }
  }
}
