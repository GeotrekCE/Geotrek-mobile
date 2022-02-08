import { Component, OnDestroy, OnInit } from '@angular/core';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation/ngx';
import {
  NavParams,
  Platform,
  PopoverController,
  ModalController
} from '@ionic/angular';

import { InAppDisclosureComponent } from '@app/components/in-app-disclosure/in-app-disclosure.component';
import { SettingsService } from '@app/services/settings/settings.service';
import { GeolocateService } from '@app/services/geolocate/geolocate.service';
import { Order } from '@app/interfaces/interfaces';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-treks-order',
  templateUrl: './treks-order.component.html',
  styleUrls: ['./treks-order.component.scss']
})
export class TreksOrderComponent implements OnInit, OnDestroy {
  orders: any;
  currentOrder: Order;
  isFirstCheck = true;
  private orderSubscription: Subscription;

  constructor(
    private navParams: NavParams,
    private settings: SettingsService,
    private platform: Platform,
    private backgroundGeolocation: BackgroundGeolocation,
    private popoverController: PopoverController,
    private modalController: ModalController,
    private geolocate: GeolocateService
  ) {}

  ngOnInit(): void {
    this.orders = this.navParams.get('orders');

    this.orderSubscription = this.settings.order$.subscribe((order) => {
      this.currentOrder = order!.type;
    });
  }

  ngOnDestroy(): void {
    if (this.orderSubscription) {
      this.orderSubscription.unsubscribe();
    }
  }

  public async treksOrderChange(orderValue: string) {
    let error = false;
    if (orderValue === 'location') {
      if (this.platform.is('ios') || this.platform.is('android')) {
        let startLocation;
        try {
          const shouldShowInAppDisclosure =
            await this.geolocate.shouldShowInAppDisclosure();
          if (shouldShowInAppDisclosure) {
            await this.presentInAppDisclosure();
          }
          startLocation = await this.backgroundGeolocation.getCurrentLocation();
        } catch (catchError) {
          error = true;
        }
        if (startLocation) {
          this.settings.saveOrderState(orderValue, [
            startLocation.longitude,
            startLocation.latitude
          ]);
        } else {
          error = true;
        }
        await this.popoverController.dismiss({ error });
      } else if ('geolocation' in navigator) {
        const shouldShowInAppDisclosure =
          await this.geolocate.shouldShowInAppDisclosure();
        if (shouldShowInAppDisclosure) {
          await this.presentInAppDisclosure();
        }
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            this.settings.saveOrderState(orderValue, [
              position.coords.longitude,
              position.coords.latitude
            ]);
            await this.popoverController.dismiss();
          },
          async () => {
            await this.popoverController.dismiss({ error: true });
          }
        );
      }
    } else if (orderValue === 'alphabetical') {
      this.settings.saveOrderState(orderValue);
      await this.popoverController.dismiss();
    } else if (orderValue === 'random') {
      this.settings.saveOrderState(orderValue);
      await this.popoverController.dismiss();
    }
  }

  public async presentInAppDisclosure(): Promise<void> {
    const modal = await this.modalController.create({
      component: InAppDisclosureComponent,
      componentProps: {},
      cssClass: 'full-size'
    });

    await modal.present();

    await modal.onDidDismiss();
  }
}
