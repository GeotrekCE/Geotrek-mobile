import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Filter, FilterValue } from '@app/interfaces/interfaces';
import { deburr } from 'lodash';

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
  valuesToDisplay: FilterValue[];

  constructor(private modalController: ModalController) {}

  public ngOnInit(): void {
    this.temporaryFilter = this.filter;
    this.valuesToDisplay = [...this.filter.values];
  }

  public cancel(): void {
    this.modalController.dismiss();
  }

  public select(): void {
    this.modalController.dismiss({ temporaryFilter: this.temporaryFilter });
  }

  public expandFilterValues(infiniteScroll: any): void {
    if (this.currentMaxFilterValues < this.valuesToDisplay.length) {
      if (
        this.currentMaxFilterValues + this.filterValuesByStep >
        this.valuesToDisplay.length
      ) {
        this.currentMaxFilterValues = this.valuesToDisplay.length;
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

  public search(searchValue: any): void {
    if (searchValue.detail.value) {
      this.valuesToDisplay = this.searchValuesInFilter(
        this.filter,
        searchValue.detail.value
      );
    } else {
      this.valuesToDisplay = [...this.filter.values];
    }
    this.currentMaxFilterValues = this.filterValuesByStep;
  }

  public searchValuesInFilter(
    filter: Filter,
    searchValue: string
  ): FilterValue[] {
    if (!filter) {
      return [];
    }

    if (!!!searchValue) {
      return filter.values.sort(function (a, b) {
        return a.name.localeCompare(b.name);
      });
    }
    searchValue = searchValue.toLowerCase();
    return filter.values
      .filter((value) => {
        return deburr(value.name.toLowerCase()).startsWith(searchValue);
      })
      .sort(function (a, b) {
        return a.name.localeCompare(b.name);
      });
  }
}
