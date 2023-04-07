import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs/internal/Subscription';
import { InAppDisclosureComponent } from '@app/components/in-app-disclosure/in-app-disclosure.component';
import { SettingsService } from '@app/services/settings/settings.service';
import { GeolocateService } from '@app/services/geolocate/geolocate.service';
import { Order } from '@app/interfaces/interfaces';
import { first } from 'rxjs';

@Component({
  selector: 'app-treks-order',
  templateUrl: './treks-order.component.html',
  styleUrls: ['./treks-order.component.scss']
})
export class TreksOrderComponent implements OnInit {
  orders: any;
  currentOrder!: Order;
  isFirstCheck = true;

  constructor(
    private navParams: NavParams,
    private settings: SettingsService,
    private popoverController: PopoverController,
    private modalController: ModalController,
    private geolocate: GeolocateService
  ) {}

  ngOnInit(): void {
    this.orders = this.navParams.get('orders');

    this.settings.order$.pipe(first()).subscribe((order) => {
      this.currentOrder = order!.type;
    });
  }

  public async treksOrderChange(orderValue: any) {
    let error = false;
    if (orderValue.detail.value === 'location') {
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
        this.settings.saveOrderState(orderValue.detail.value, [
          startLocation.longitude,
          startLocation.latitude
        ]);
      } else {
        error = true;
      }
      await this.popoverController.dismiss({ error });
    } else if (orderValue.detail.value === 'alphabetical') {
      this.settings.saveOrderState(orderValue.detail.value);
      await this.popoverController.dismiss();
    } else if (orderValue.detail.value === 'random') {
      this.settings.saveOrderState(orderValue.detail.value);
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
