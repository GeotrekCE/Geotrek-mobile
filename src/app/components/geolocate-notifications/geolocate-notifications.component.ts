import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  OnChanges,
  SimpleChanges,
  SimpleChange,
  Output,
  EventEmitter
} from '@angular/core';
import { GeolocateService } from '@app/services/geolocate/geolocate.service';
import { Platform } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Subscription } from 'rxjs';
import { point } from '@turf/helpers';
import { TranslateService } from '@ngx-translate/core';

const distance = require('@turf/distance').default;

import { Pois } from '@app/interfaces/interfaces';
import { environment } from '@env/environment';

@Component({
  selector: 'app-geolocate-notifications',
  templateUrl: './geolocate-notifications.component.html',
  styleUrls: ['./geolocate-notifications.component.scss']
})
export class GeolocateNotificationsComponent
  implements OnInit, OnChanges, OnDestroy {
  currentPoisToNotify: any[] = [];
  clicklocalNotifications$: Subscription;
  notificationsModeIsActive = false;
  @Input() currentPois: Pois;
  @Input() trekName: string;
  @Output() presentPoiDetails = new EventEmitter<any>();
  private currentPosition$: Subscription;

  constructor(
    public platform: Platform,
    public localNotifications: LocalNotifications,
    public alertController: AlertController,
    private geolocate: GeolocateService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    if (this.platform.is('ios') || this.platform.is('android')) {
      this.localNotifications.setDefaults({
        icon: 'res://icon',
        smallIcon: 'res://ic_stat_panorama',
        vibrate: true,
        foreground: true,
        priority: 2,
        silent: false,
        launch: true,
        lockscreen: true
      });
      this.clicklocalNotifications$ = this.localNotifications
        .on('click')
        .subscribe(({ data }) => {
          const poi = this.currentPois.features.find(
            (feature) => feature.properties.id === data.id
          );
          this.presentPoiDetails.emit(poi);
        });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    const changesCurrentPois: SimpleChange = changes.currentPois;
    if (changesCurrentPois.currentValue && !changesCurrentPois.previousValue) {
      if (this.currentPois && Array.isArray(this.currentPois.features)) {
        this.currentPoisToNotify = this.currentPois.features.map((feature) => ({
          id: feature.properties.id,
          name: feature.properties.name,
          coordinates: feature.geometry.coordinates
        }));
      }
    }
  }

  ngOnDestroy(): void {
    if (this.clicklocalNotifications$) {
      this.clicklocalNotifications$.unsubscribe();
    }

    if (this.currentPosition$) {
      this.disableGeolocationNotification();
    }
  }

  async changeNotificationsMode() {
    if (!this.notificationsModeIsActive) {
      if (this.platform.is('ios') || this.platform.is('android')) {
        if (!(await this.geolocate.checkAuthorization())) {
          this.presentPersmissionsConfirm();
        } else {
          this.geolocate.stopOnMapTracking(false, false);
          this.geolocate.startNotificationsModeTracking(this.trekName);
          if (await this.localNotifications.hasPermission()) {
            this.notificationsModeIsActive = true;
            this.enableGeolocationNotification();
          } else {
            await this.localNotifications.requestPermission();
          }
        }
      } else {
        this.geolocate.stopOnMapTracking(false, false);
        this.geolocate.startNotificationsModeTracking(this.trekName);
        this.notificationsModeIsActive = true;
        this.enableGeolocationNotification();
      }
    } else {
      this.notificationsModeIsActive = false;
      this.geolocate.stopNotificationsModeTracking();
      this.geolocate.startOnMapTracking();
      this.disableGeolocationNotification();
    }
  }

  enableGeolocationNotification(): void {
    this.currentPosition$ = this.geolocate.currentPosition$.subscribe(
      (coordinates) => this.checkToNotify(coordinates)
    );
  }

  disableGeolocationNotification(): void {
    this.currentPosition$.unsubscribe();
  }

  checkToNotify(fromCoordinates: number[]) {
    if (
      fromCoordinates &&
      this.currentPoisToNotify &&
      this.currentPoisToNotify.length > 0
    ) {
      const kmToNotify = environment.metersToNotify / 1000;
      const options = {
        units: 'kilometers'
      };
      const from = point(fromCoordinates);
      const notifiedIndex = this.currentPoisToNotify.findIndex(
        (feature) =>
          distance(from, point(feature.coordinates), options) <= kmToNotify
      );

      if (notifiedIndex !== -1) {
        if (this.platform.is('ios') || this.platform.is('android')) {
          this.translate.get('geolocate.poiNearBy').subscribe((trad) => {
            this.localNotifications.schedule({
              id: this.currentPoisToNotify[notifiedIndex].id,
              title: trad,
              text: this.currentPoisToNotify[notifiedIndex].name,
              data: {
                id: this.currentPoisToNotify[notifiedIndex].id
              },
              icon: 'res://icon',
              smallIcon: 'res://ic_stat_panorama',
              vibrate: true,
              foreground: true,
              priority: 2,
              silent: false,
              launch: true,
              lockscreen: true
            });

            this.currentPoisToNotify.splice(notifiedIndex, 1);
          });
        } else {
          console.log('Poi', this.currentPoisToNotify[notifiedIndex]);
        }
      }
    }
  }

  async presentPersmissionsConfirm() {
    await this.translate
      .get([
        'geolocate.askLocatePermission',
        'geolocate.cancel',
        'geolocate.open'
      ])
      .subscribe(async (trad) => {
        const persmissionsConfirm = await this.alertController.create({
          header: 'Permissions',
          message: trad['geolocate.askLocatePermission'],
          buttons: [
            {
              text: trad['geolocate.cancel'],
              role: 'cancel',
              cssClass: 'secondary'
            },
            {
              text: trad['geolocate.open'],
              handler: () => {
                this.geolocate.showAppSettings();
              }
            }
          ]
        });

        await persmissionsConfirm.present();
      });
  }
}
