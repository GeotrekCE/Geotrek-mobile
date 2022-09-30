import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { environment } from '@env/environment';
import { InformationIntro } from '@app/interfaces/interfaces';
import { MoreInformationsService } from '@app/services/more-informations/more-informations.service';
import { from } from 'rxjs';

@Component({
  selector: 'app-more',
  templateUrl: './more.page.html',
  styleUrls: ['./more.page.scss']
})
export class MorePage implements OnInit {
  public appName: string = environment.appName;
  moreInformationsIntro!: InformationIntro[];
  connectionError = false;

  constructor(private more: MoreInformationsService) {}

  ngOnInit(): void {
    this.loadMoreItems();
  }

  loadMoreItems() {
    from(this.more.getMoreItems())
      .pipe(first())
      .subscribe(
        (moreItems) => {
          this.connectionError = false;
          this.moreInformationsIntro = moreItems.data;
        },
        () => {
          this.connectionError = true;
        }
      );
  }

  public refresh() {
    this.loadMoreItems();
  }
}
