import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { environment } from '@env/environment';
import { InformationIntro } from '@app/interfaces/interfaces';
import { MoreInformationsService } from '@app/services/more-informations/more-informations.service';

@Component({
  selector: 'app-more',
  templateUrl: './more.page.html',
  styleUrls: ['./more.page.scss']
})
export class MorePage implements OnInit {
  public appName: string = environment.appName;
  moreInformationsIntro: InformationIntro[];
  connectionError = false;

  constructor(private router: Router, private more: MoreInformationsService) {}

  ngOnInit(): void {
    this.more
      .getMoreItems()
      .pipe(first())
      .subscribe(
        (moreItems) => {
          this.moreInformationsIntro = moreItems;
        },
        () => {
          this.connectionError = true;
        }
      );
  }

  public refresh() {
    this.router.navigate([this.router.url]);
  }
}
