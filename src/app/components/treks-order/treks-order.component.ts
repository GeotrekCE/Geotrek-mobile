import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  NavParams,
  Platform,
  PopoverController,
  ModalController
} from '@ionic/angular';
import { Subscription } from 'rxjs/internal/Subscription';
import { InAppDisclosureComponent } from '@app/components/in-app-disclosure/in-app-disclosure.component';
import { SettingsService } from '@app/services/settings/settings.service';
import { GeolocateService } from '@app/services/geolocate/geolocate.service';
import { Order } from '@app/interfaces/interfaces';

@Component({
  selector: 'app-treks-order',
  templateUrl: './treks-order.component.html',
  styleUrls: ['./treks-order.component.scss']
})
export class TreksOrderComponent implements OnInit, OnDestroy {
  orders: any;
  currentOrder!: Order;
  isFirstCheck = true;
  private orderSubscription!: Subscription;

  constructor(
    private navParams: NavParams,
    private settings: SettingsService,
    private platform: Platform,
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
      let startLocation: any;
      try {
        const shouldShowInAppDisclosure =
          await this.geolocate.shouldShowInAppDisclosure();
        if (shouldShowInAppDisclosure) {
          await this.presentInAppDisclosure();
        }
        startLocation = await this.geolocate.getCurrentPosition();
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
