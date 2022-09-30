import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Platform } from '@ionic/angular';
import { registerPlugin } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { BackgroundGeolocationPlugin } from '@capacitor-community/background-geolocation';
import {
  DeviceOrientation,
  DeviceOrientationCompassHeading
} from '@awesome-cordova-plugins/device-orientation/ngx';

const BackgroundGeolocation = registerPlugin<BackgroundGeolocationPlugin>(
  'BackgroundGeolocation'
);

@Injectable({
  providedIn: 'root'
})
export class GeolocateService {
  public currentPosition$: BehaviorSubject<any> = new BehaviorSubject(null);
  public currentHeading$: BehaviorSubject<any> = new BehaviorSubject(null);
  public currentWatchId: any = null;
  private deviceOrientationSubscription!: Subscription;

  constructor(
    private platform: Platform,
    private translate: TranslateService,
    private deviceOrientation: DeviceOrientation
  ) {}

  async shouldShowInAppDisclosure() {
    const alreadyAskGeolocationPermission = await Preferences.get({
      key: 'alreadyAskGeolocationPermission'
    });
    return !!!alreadyAskGeolocationPermission.value;
  }

  async checkIfCanGetCurrentHeading() {
    const deviceOrientation = await new Promise((resolve) => {
      this.deviceOrientation.getCurrentHeading().then(
        (data) => resolve(data),
        () => resolve(null)
      );
    });
    return !!deviceOrientation;
  }

  async startOnMapTracking() {
    if (this.platform.is('ios') || this.platform.is('android')) {
      const notificationTitle: string = await this.translate
        .get('geolocate.notificationTitle')
        .toPromise();
      BackgroundGeolocation.addWatcher(
        {
          backgroundTitle: notificationTitle,
          requestPermissions: true,
          stale: false,
          distanceFilter: 2
        },
        (location) => {
          this.currentPosition$.next(location);
        }
      ).then((watcher_id) => {
        this.currentWatchId = watcher_id;
        this.deviceOrientationSubscription = this.deviceOrientation
          .watchHeading({ frequency: 200 })
          .subscribe((data: DeviceOrientationCompassHeading) =>
            this.currentHeading$.next(data.magneticHeading)
          );
      });
    }
  }

  stopOnMapTracking() {
    if (this.platform.is('ios') || this.platform.is('android')) {
      if (this.deviceOrientationSubscription) {
        this.deviceOrientationSubscription.unsubscribe();
      }
      if (this.currentWatchId) {
        BackgroundGeolocation.removeWatcher({
          id: this.currentWatchId
        }).then(() => {
          this.currentWatchId = null;
        });
      }
    }
  }

  async getCurrentPosition() {
    return new Promise(async (resolve) => {
      if (this.platform.is('ios') || this.platform.is('android')) {
        let last_location: any;
        BackgroundGeolocation.addWatcher(
          {
            requestPermissions: true,
            stale: true
          },
          (location) => {
            last_location = location || null;
          }
        ).then((id) => {
          setTimeout(() => {
            resolve(last_location);
            BackgroundGeolocation.removeWatcher({ id });
          }, 500);
        });
      } else {
        resolve(null);
      }
    });
  }
}
