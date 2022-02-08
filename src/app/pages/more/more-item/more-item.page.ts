import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { InformationItem } from '@app/interfaces/interfaces';

@Component({
  selector: 'app-more-item',
  templateUrl: './more-item.page.html',
  styleUrls: ['./more-item.page.scss']
})
export class MoreItemPage implements OnInit, OnDestroy {
  moreItem: InformationItem;
  moreItemId: number;
  connectionError = false;
  private moreItemSubscription: Subscription;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.moreItemSubscription = this.route.data.subscribe((data: Data) => {
      const item = data['item'] as InformationItem | 'connectionError';
      if (item === 'connectionError') {
        this.connectionError = true;
      } else {
        if (!this.moreItem) {
          this.connectionError = false;
          this.moreItem = item;
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.moreItemSubscription) {
      this.moreItemSubscription.unsubscribe();
    }
  }

  refresh() {
    this.router.navigate([this.router.url]);
  }
}
