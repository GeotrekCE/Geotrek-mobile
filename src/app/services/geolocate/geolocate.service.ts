import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import {
  BackgroundGeolocation,
  BackgroundGeolocationConfig,
  BackgroundGeolocationEvents,
  BackgroundGeolocationLocationProvider
} from '@ionic-native/background-geolocation/ngx';
import { Platform } from '@ionic/angular';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class GeolocateService {
  public currentPosition$: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(
    public backgroundGeolocation: BackgroundGeolocation,
    public platform: Platform,
    private translate: TranslateService
  ) {}

  async checkAuthorization() {
    const status = await this.backgroundGeolocation.checkStatus();
    return status.authorization !== 0;
  }

  async checkIfTrackerIsRunning() {
    const status = await this.backgroundGeolocation.checkStatus();
    return status.isRunning;
  }

  async startTracking(notificationText: string) {
    if (this.platform.is('ios') || this.platform.is('android')) {
      const notificationTitle: string = await this.translate
        .get('geolocate.notificationTitle')
        .toPromise();
      const geolocationConfig: BackgroundGeolocationConfig = {
        locationProvider:
          BackgroundGeolocationLocationProvider.DISTANCE_FILTER_PROVIDER,
        maxLocations: 10,
        startForeground: true,
        stopOnTerminate: true,
        debug: false,
        notificationTitle,
        notificationText,
        ...environment.backgroundGeolocation
      };

      await this.backgroundGeolocation.configure(geolocationConfig);

      this.backgroundGeolocation
        .on(BackgroundGeolocationEvents.start)
        .subscribe(async () => {
          try {
            const startLocation = await this.backgroundGeolocation.getCurrentLocation(
              {
                timeout: 3000,
                maximumAge: Number.MAX_SAFE_INTEGER,
                enableHighAccuracy: true
              }
            );
            this.currentPosition$.next([
              startLocation.longitude,
              startLocation.latitude
            ]);
          } catch (error) {
            this.currentPosition$.next(null);
            error = true;
          }
        });

      this.backgroundGeolocation
        .on(BackgroundGeolocationEvents.location)
        .subscribe((location) => {
          try {
            this.currentPosition$.next([location.longitude, location.latitude]);
          } catch (error) {
            this.currentPosition$.next(null);
            error = true;
          }
        });

      this.backgroundGeolocation.start();
    } else {
      // fake position for browser dev
      this.currentPosition$.next([0.705824, 44.410157]);
    }
  }

  stopTracking() {
    if (this.platform.is('ios') || this.platform.is('android')) {
      this.backgroundGeolocation.stop();
    }

    this.currentPosition$.next([0, 0]);
  }

  showAppSettings() {
    this.backgroundGeolocation.showAppSettings();
  }

  showLocationSettings() {
    this.backgroundGeolocation.showLocationSettings();
  }

  async getCurrentPosition() {
    let startLocation;
    try {
      startLocation = await this.backgroundGeolocation.getCurrentLocation({
        timeout: 3000,
        maximumAge: Number.MAX_SAFE_INTEGER,
        enableHighAccuracy: true
      });
    } catch (error) {
      startLocation = null;
    } finally {
      this.currentPosition$.next(
        startLocation
          ? [startLocation.longitude, startLocation.latitude]
          : startLocation
      );

      return startLocation;
    }
  }
}
