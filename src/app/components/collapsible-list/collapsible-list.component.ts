import { Component, Input, OnInit, TemplateRef } from '@angular/core';

import { expandCollapse } from '@app/components/animations';

@Component({
  selector: 'app-collapsible-list',
  templateUrl: './collapsible-list.component.html',
  styleUrls: ['./collapsible-list.component.scss'],
  animations: [expandCollapse],
})
export class CollapsibleListComponent<T> implements OnInit {
  @Input() items: T[];
  @Input() showAllLabel: string;
  @Input() hideAllLabel: string;
  @Input() initialSize = 5;
  @Input() initialState: 'expanded' | 'collapsed' = 'collapsed';
  @Input() itemTemplate: TemplateRef<any>;

  public alwaysDisplayedItems: T[] = [];
  public expandableItems: T[] = [];
  public expanded = false;

  constructor() {}

  ngOnInit() {
    this.expanded = this.initialState === 'expanded';
    this.alwaysDisplayedItems = this.items.slice(0, this.initialSize);
    this.expandableItems = this.items.slice(this.initialSize, this.items.length);
  }

  public toggleExpandables() {
    this.expanded = !this.expanded;
  }
}
