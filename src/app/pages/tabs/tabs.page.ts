import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss']
})
export class TabsPage {
  constructor(
    private platform: Platform,
    private router: Router,
    private location: Location
  ) {
    this.platform.backButton.subscribeWithPriority(9999, () => {
      const url = this.router.url;
      if (
        url !== '/tabs/treks' &&
        url !== '/tabs/treks-offline' &&
        url !== '/tabs/more'
      ) {
        this.location.back();
      }
    });
  }
}
