import { Component } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { UnSubscribe } from '@app/components/abstract/unsubscribe';
import { SettingsService } from '@app/services/settings/settings.service';
import { Order } from '@app/interfaces/interfaces';
import { GeolocateService } from '@app/services/geolocate/geolocate.service';

@Component({
  selector: 'app-treks-order',
  templateUrl: './treks-order.component.html',
  styleUrls: ['./treks-order.component.scss'],
})
export class TreksOrderComponent extends UnSubscribe {
  orders: any;
  currentOrder: Order;

  constructor(
    private navParams: NavParams,
    private settings: SettingsService,
    private geolocate: GeolocateService
  ) {
    super();
  }

  ionViewWillEnter() {
    this.orders = this.navParams.get('orders');

    this.subscriptions$$.push(
      this.settings.order$.subscribe(order => {
        this.currentOrder = order || 'default';
      })
    );
  }

  public treksOrderChange(event: any) {
    if (event.detail.value === 'location') {
      this.geolocate.startTracking('');
      this.subscriptions$$.push(
        this.geolocate.currentPosition$.subscribe(coordinates => {
          this.settings.saveOrderState(event.detail.value, coordinates);
        })
      );
    } else {
      this.geolocate.stopTracking();
      this.settings.saveOrderState(event.detail.value);
    }
  }
}
