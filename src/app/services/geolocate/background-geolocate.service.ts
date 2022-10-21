import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Platform } from '@ionic/angular';
import { registerPlugin } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { BackgroundGeolocationPlugin } from '@capacitor-community/background-geolocation';

const BackgroundGeolocation = registerPlugin<BackgroundGeolocationPlugin>(
  'BackgroundGeolocation'
);

@Injectable({
  providedIn: 'root'
})
export class BackgroundGeolocateService {
  public currentPosition$: BehaviorSubject<any> = new BehaviorSubject(null);
  public currentHeading$: BehaviorSubject<any> = new BehaviorSubject(null);
  public currentWatchId: any = null;
  private deviceOrientationSubscription!: Subscription;

  constructor(
    private platform: Platform,
    private translate: TranslateService
  ) {}

  async shouldShowInAppDisclosure() {
    const alreadyAskGeolocationPermission = await Preferences.get({
      key: 'alreadyAskGeolocationPermission'
    });
    return !!!alreadyAskGeolocationPermission.value;
  }

  async startOnMapTracking() {
    if (this.platform.is('ios') || this.platform.is('android')) {
      const notificationTitle: string = await this.translate
        .get('geolocate.notificationTitle')
        .toPromise();
      BackgroundGeolocation.addWatcher(
        {
          backgroundTitle: notificationTitle,
          requestPermissions: false,
          stale: false,
          distanceFilter: 2
        },
        (location) => {
          this.currentPosition$.next(location);
        }
      ).then((watcher_id) => {
        this.currentWatchId = watcher_id;
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
      this.currentPosition$.next(null);
    }
  }
}
