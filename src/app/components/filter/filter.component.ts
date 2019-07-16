// src/app/core/expand-collapse.animation.ts
import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectionStrategy } from '@angular/core';

import { Filter, FilterValue } from '@app/interfaces/interfaces';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent implements OnInit {
  @Input() public filter: Filter;
  @Input() public commonSrc: string;
  @Output() public valueChange = new EventEmitter<{ checked: boolean; value: FilterValue }>();

  public expanded: boolean;

  constructor() {}

  public ngOnInit(): void {
    this.filter.values.slice(4).forEach(value => {
      // expand filter if an expandable value is already checked
      if (value.checked) {
        this.expanded = true;
      }
    });
  }

  public valueChanged({ checked, value }: { checked: boolean; value: FilterValue }) {
    this.valueChange.emit({ checked: checked, value: value });
  }
}
