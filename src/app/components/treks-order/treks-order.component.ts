import { Component } from '@angular/core';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation/ngx';
import { NavParams, Platform, PopoverController } from '@ionic/angular';

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
    private popoverController: PopoverController,
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
    let error = false;
    if (!this.isFirstCheck) {
      // disable backdrop dismiss while treksOrderChange
      const trekOrderPopOver: any = this.popoverController.getTop();
      trekOrderPopOver.__zone_symbol__value.backdropDismiss = false;
      if (event.detail.value === 'location') {
        if (this.platform.is('ios') || this.platform.is('android')) {
          let startLocation;
          try {
            startLocation = await this.backgroundGeolocation.getCurrentLocation({
              timeout: 3000,
              maximumAge: 10000,
              enableHighAccuracy: true,
            });
          } catch (catchError) {
            error = true;
          }
          if (startLocation) {
            this.settings.saveOrderState(event.detail.value, [startLocation.longitude, startLocation.latitude]);
          } else {
            error = true;
            // If location not provided, reset default order
            this.settings.saveOrderState('default');
          }
          await this.popoverController.dismiss({ error });
        } else if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            async position => {
              this.settings.saveOrderState(event.detail.value, [position.coords.longitude, position.coords.latitude]);
              await this.popoverController.dismiss();
            },
            async () => {
              await this.popoverController.dismiss({ error: true });
            },
          );
        }
      } else {
        this.settings.saveOrderState(event.detail.value);
        await this.popoverController.dismiss();
      }
    } else {
      this.isFirstCheck = false;
    }
  }
}
