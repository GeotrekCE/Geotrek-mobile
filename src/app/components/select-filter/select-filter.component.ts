import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Filter, FilterValue } from '@app/interfaces/interfaces';

@Component({
  selector: 'app-select-filter',
  templateUrl: './select-filter.component.html',
  styleUrls: ['./select-filter.component.scss']
})
export class SelectFilterComponent implements OnInit {
  @Input() public filter: Filter;
  @Input() public commonSrc: string;
  selectedItems: any[];
  currentMaxFilterValues = 20;
  filterValuesByStep = 20;
  temporaryFilter: Filter;

  constructor(private modalController: ModalController) {}

  public ngOnInit(): void {}

  ionViewDidEnter(): void {
    this.temporaryFilter = this.filter;
  }

  public cancel(): void {
    this.modalController.dismiss();
  }

  public select(): void {
    this.modalController.dismiss({ temporaryFilter: this.temporaryFilter });
  }

  public expandFilterValues(infiniteScroll: any): void {
    if (this.currentMaxFilterValues < this.filter.values.length) {
      if (
        this.currentMaxFilterValues + this.filterValuesByStep >
        this.filter.values.length
      ) {
        this.currentMaxFilterValues = this.filter.values.length;
      } else {
        this.currentMaxFilterValues += this.filterValuesByStep;
      }
    }
    infiniteScroll.target.complete();
  }

  public trackFilterValues(index: number, element: FilterValue): number | null {
    return element ? element.id : null;
  }

  public valueChanged(event: { checked: boolean; value: FilterValue }): void {
    const filterValue = this.temporaryFilter.values.find(
      (value) => value.id === event.value.id
    );
    if (filterValue) {
      filterValue.checked = event.checked;
    }
  }
}
