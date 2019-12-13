import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';

import { UnSubscribe } from '@app/components/abstract/unsubscribe';
import { InformationItem } from '@app/interfaces/interfaces';

@Component({
  selector: 'app-more-item',
  templateUrl: './more-item.page.html',
  styleUrls: ['./more-item.page.scss']
})
export class MoreItemPage extends UnSubscribe implements OnInit, OnDestroy {
  moreItem: InformationItem;
  moreItemId: number;
  connectionError = false;

  constructor(private route: ActivatedRoute, private router: Router) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this.subscriptions$$.push(
      this.route.data.subscribe((data: Data) => {
        const item = data['item'] as (InformationItem | 'connectionError');
        if (item === 'connectionError') {
          this.connectionError = true;
        } else {
          this.connectionError = false;
          this.moreItem = item;
        }
      })
    );
  }

  refresh() {
    this.router.navigate([this.router.url]);
  }
}
