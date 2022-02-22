import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { InformationItem } from '@app/interfaces/interfaces';
import { MoreInformationsService } from '@app/services/more-informations/more-informations.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-more-item',
  templateUrl: './more-item.page.html',
  styleUrls: ['./more-item.page.scss']
})
export class MoreItemPage implements OnInit {
  moreItem: InformationItem;
  moreItemId: number;
  connectionError = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private more: MoreInformationsService
  ) {}

  ngOnInit() {
    const moreItemId = +(<string>(
      this.route.snapshot.paramMap.get('moreItemId')
    ));

    this.more
      .getMoreItemById(moreItemId)
      .pipe(first())
      .subscribe(
        (moreItem) => {
          this.moreItem = moreItem;
        },
        () => {
          this.connectionError = true;
        }
      );
  }

  refresh() {
    this.router.navigate([this.router.url]);
  }
}
