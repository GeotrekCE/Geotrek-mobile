import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@env/environment';

import { UnSubscribe } from '@app/components/abstract/unsubscribe';
import { InformationIntro } from '@app/interfaces/interfaces';

@Component({
  selector: 'app-more',
  templateUrl: './more.page.html',
  styleUrls: ['./more.page.scss']
})
export class MorePage extends UnSubscribe implements OnInit {
  moreInformationsIntro: InformationIntro[];
  connectionError = false;
  public appName: string = environment.appName;

  constructor(private route: ActivatedRoute, private router: Router) {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.subscriptions$$.push(
      this.route.data.subscribe((data) => {
        const items: InformationIntro[] | 'connectionError' = data.items;
        if (items === 'connectionError') {
          this.connectionError = true;
        } else {
          this.connectionError = false;
          this.moreInformationsIntro = items;
        }
      })
    );
  }

  public refresh() {
    this.router.navigate([this.router.url]);
  }
}
