import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { environment } from '@env/environment';
import { InformationIntro } from '@app/interfaces/interfaces';

@Component({
  selector: 'app-more',
  templateUrl: './more.page.html',
  styleUrls: ['./more.page.scss']
})
export class MorePage implements OnInit, OnDestroy {
  moreInformationsIntro: InformationIntro[];
  connectionError = false;
  public appName: string = environment.appName;
  private moreInformationsIntroSubscription: Subscription;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.moreInformationsIntroSubscription = this.route.data.subscribe(
      (data) => {
        const items: InformationIntro[] | 'connectionError' = data.items;
        if (items === 'connectionError') {
          this.connectionError = true;
        } else {
          if (!this.moreInformationsIntro) {
            this.connectionError = false;
            this.moreInformationsIntro = items;
          }
        }
      }
    );
  }

  ngOnDestroy(): void {
    if (this.moreInformationsIntroSubscription) {
      this.moreInformationsIntroSubscription.unsubscribe();
    }
  }

  public refresh() {
    this.router.navigate([this.router.url]);
  }
}
