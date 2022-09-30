import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { InformationItem } from '@app/interfaces/interfaces';
import { MoreInformationsService } from '@app/services/more-informations/more-informations.service';
import { from } from 'rxjs';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-more-item',
  templateUrl: './more-item.page.html',
  styleUrls: ['./more-item.page.scss']
})
export class MoreItemPage implements OnInit {
  moreItem!: InformationItem;
  moreItemId!: number;
  connectionError = false;

  constructor(
    private route: ActivatedRoute,
    private more: MoreInformationsService
  ) {}

  ngOnInit() {
    this.loadMoreItem();
  }

  loadMoreItem() {
    const moreItemId = +(<string>(
      this.route.snapshot.paramMap.get('moreItemId')
    ));
    from(this.more.getMoreItemById(moreItemId))
      .pipe(first())
      .subscribe(
        (moreItem) => {
          this.connectionError = false;
          this.moreItem = moreItem.data;
        },
        () => {
          this.connectionError = true;
        }
      );
  }

  refresh() {
    this.loadMoreItem();
  }
}
