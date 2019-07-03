import { Component } from '@angular/core';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation/ngx';
import { NavParams, Platform } from '@ionic/angular';

import { UnSubscribe } from '@app/components/abstract/unsubscribe';
import { SettingsService } from '@app/services/settings/settings.service';
import { Order } from '@app/interfaces/interfaces';

@Component({
  selector: 'app-treks-order',
  templateUrl: './treks-order.component.html',
  styleUrls: ['./treks-order.component.scss'],
})
export class TreksOrderComponent extends UnSubscribe {
  orders: any;
  currentOrder: Order;
  isFirstCheck = true;

  constructor(
    private navParams: NavParams,
    private settings: SettingsService,
    private platform: Platform,
    private backgroundGeolocation: BackgroundGeolocation,
  ) {
    super();
  }

  ionViewWillEnter() {
    this.orders = this.navParams.get('orders');

    this.subscriptions$$.push(
      this.settings.order$.subscribe(order => {
        this.currentOrder = order.type;
      }),
    );
  }

  public async treksOrderChange(event: any) {
    if (!this.isFirstCheck) {
      if (event.detail.value === 'location') {
        if (this.platform.is('ios') || this.platform.is('android')) {
          const startLocation = await this.backgroundGeolocation.getCurrentLocation();
          if (startLocation) {
            this.settings.saveOrderState(event.detail.value, [startLocation.longitude, startLocation.latitude]);
          } else {
            // If location not provided, reset default order
            this.settings.saveOrderState('default');
          }
        } else if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(position => {
            this.settings.saveOrderState(event.detail.value, [position.coords.longitude, position.coords.latitude]);
          });
        }
      } else {
        this.settings.saveOrderState(event.detail.value);
      }
    } else {
      this.isFirstCheck = false;
    }
  }
}
