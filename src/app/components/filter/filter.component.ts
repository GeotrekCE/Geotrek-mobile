import { Component, EventEmitter, Input, OnInit, Output, DoCheck } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Filter, FilterValue } from '@app/interfaces/interfaces';
import { environment } from '@env/environment';
import { SelectFilterComponent } from '@app/components/select-filter/select-filter.component';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit, DoCheck {
  @Input() public filter: Filter;
  @Input() public commonSrc: string;
  @Output() public valueChange = new EventEmitter<{ checked: boolean; value: FilterValue }>();
  @Output() public selectChange = new EventEmitter<{ filter: Filter }>();
  public selectedItems = '';
  public containsFilterShouldUseSelectAbove = environment.containsFilterShouldUseSelectAbove;

  constructor(private modalController: ModalController) {}

  public ngOnInit(): void {
    this.updateSelectedItems(this.filter);
  }

  ngDoCheck() {
    if (
      !this.filter.values.find(value => {
        return value.checked;
      })
    ) {
      this.updateSelectedItems(this.filter);
    }
  }

  public valueChanged({ checked, value }: { checked: boolean; value: FilterValue }): void {
    this.valueChange.emit({ checked: checked, value: value });
  }

  public async openSelect(): Promise<void> {
    const modal = await this.modalController.create({
      component: SelectFilterComponent,
      componentProps: { filter: this.filter, commonSrc: this.commonSrc },
      cssClass: 'full-size',
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data && data.temporaryFilter) {
      this.updateSelectedItems(data.temporaryFilter);
      this.selectChange.emit({ filter: data.temporaryFilter });
    }
  }

  public updateSelectedItems(temporaryFilter: Filter) {
    const selectedItems: string[] = [];

    for (const filterValue of temporaryFilter.values) {
      if (filterValue.checked) {
        selectedItems.push(filterValue.name);
      }
    }
    this.selectedItems = selectedItems.join(', ');
  }
}
