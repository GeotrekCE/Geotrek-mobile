import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FilterValue, Picture, Trek } from '@app/interfaces/interfaces';
import { OfflineTreksService } from '@app/services/offline-treks/offline-treks.service';
import { environment } from '@env/environment';

@Component({
  selector: 'app-filter-button',
  templateUrl: './filter-button.component.html',
  styleUrls: ['./filter-button.component.scss']
})
export class FilterButtonComponent implements OnInit {
  @Input() value!: FilterValue;
  @Output() public filterAndGo = new EventEmitter<FilterValue>();

  public imgPracticeSrc!: string;
  private firstTryToLoadFromOnline = true;
  public hideImgPracticeSrc = false;

  constructor(private offlineTreks: OfflineTreksService) {}

  async ngOnInit() {
    this.imgPracticeSrc = await this.offlineTreks.getTrekImageSrc(
      {} as Trek,
      {
        url: this.value.pictogram
      } as Picture
    );
  }

  public onImgPracticeSrcError() {
    if (this.value.pictogram && this.firstTryToLoadFromOnline) {
      this.firstTryToLoadFromOnline = false;
      this.imgPracticeSrc = environment.mobileApiUrl + this.value.pictogram;
    } else {
      this.hideImgPracticeSrc = true;
    }
  }

  onfilterAndGo() {
    this.filterAndGo.emit(this.value);
  }
}
