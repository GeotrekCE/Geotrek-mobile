import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FilterValue } from '@app/interfaces/interfaces';

@Component({
  selector: 'app-filter-value',
  templateUrl: './filter-value.component.html',
  styleUrls: ['./filter-value.component.scss'],
})
export class FilterValueComponent implements OnInit {
  @Input() value: FilterValue;
  @Input() commonSrc: string;
  @Output() public valueChange = new EventEmitter<{ checked: boolean; value: FilterValue }>();

  constructor() {}

  ngOnInit() {}

  public valueCheckChanged($event: CustomEvent, value: FilterValue) {
    this.valueChange.emit({ checked: $event.detail.checked, value: value });
  }
}
