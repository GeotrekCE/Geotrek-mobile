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
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { point } from '@turf/helpers';
import distance from '@turf/distance';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Pois } from '@app/interfaces/interfaces';
import { environment } from '@env/environment';

@Component({
  selector: 'app-geolocate-notifications',
  templateUrl: './geolocate-notifications.component.html',
  styleUrls: ['./geolocate-notifications.component.scss']
})
export class GeolocateNotificationsComponent
  implements OnInit, OnChanges, OnDestroy
{
  currentPoisToNotify: any[] = [];
  notificationsModeIsActive = false;
  @Input() currentPois!: Pois;
  @Input() trekName!: string;
  @Output() presentPoiDetails = new EventEmitter<any>();
  private currentPosition$!: Subscription;

  constructor(
    public platform: Platform,
    public alertController: AlertController,
    private geolocate: GeolocateService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    LocalNotifications.addListener(
      'localNotificationActionPerformed',
      (localNotificationAction) => {
        const poi = this.currentPois.features.find(
          (feature) =>
            feature.properties.id === localNotificationAction.notification.id
        );
        this.presentPoiDetails.emit(poi);
      }
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    const changesCurrentPois: SimpleChange = changes['currentPois'];
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
    LocalNotifications.removeAllListeners();
    if (this.currentPosition$) {
      this.disableGeolocationNotification();
    }
  }

  async changeNotificationsMode() {
    if (!this.notificationsModeIsActive) {
      if (this.platform.is('ios') || this.platform.is('android')) {
        if (
          (await LocalNotifications.checkPermissions()).display === 'granted'
        ) {
          this.notificationsModeIsActive = true;
          this.enableGeolocationNotification();
        } else {
          await LocalNotifications.requestPermissions();
        }
      }
    } else {
      this.notificationsModeIsActive = false;
      this.disableGeolocationNotification();
    }
  }

  enableGeolocationNotification(): void {
    this.currentPosition$ = this.geolocate.currentPosition$.subscribe(
      (location) => this.checkToNotify([location.longitude, location.latitude])
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
          distance(from, point(feature.coordinates), options as any) <=
          kmToNotify
      );
      if (notifiedIndex !== -1) {
        if (this.platform.is('ios') || this.platform.is('android')) {
          this.translate.get('geolocate.poiNearBy').subscribe((trad) => {
            LocalNotifications.schedule({
              notifications: [
                {
                  id: this.currentPoisToNotify[notifiedIndex].id,
                  title: trad,
                  body: this.currentPoisToNotify[notifiedIndex].name,
                  extra: {
                    id: this.currentPoisToNotify[notifiedIndex].id
                  }
                }
              ]
            });
            this.currentPoisToNotify.splice(notifiedIndex, 1);
          });
        }
      }
    }
  }
}
