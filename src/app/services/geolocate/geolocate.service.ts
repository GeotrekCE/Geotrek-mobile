import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import {
  BackgroundGeolocation,
  BackgroundGeolocationConfig,
  BackgroundGeolocationEvents,
  BackgroundGeolocationLocationProvider
} from '@ionic-native/background-geolocation/ngx';
import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';
import { environment } from '@env/environment';
import {
  DeviceOrientation,
  DeviceOrientationCompassHeading
} from '@ionic-native/device-orientation/ngx';

@Injectable({
  providedIn: 'root'
})
export class GeolocateService {
  public currentPosition$: BehaviorSubject<any> = new BehaviorSubject(null);
  public currentHeading$: BehaviorSubject<any> = new BehaviorSubject(null);
  public currentHeadingSubscription: Subscription | null = null;
  public currentPositionInterval: number | null;

  constructor(
    public backgroundGeolocation: BackgroundGeolocation,
    public deviceOrientation: DeviceOrientation,
    public storage: Storage,
    public platform: Platform,
    private translate: TranslateService
  ) {}

  async shouldShowInAppDisclosure() {
    const alreadyAskGeolocationPermission = await this.storage.get(
      'alreadyAskGeolocationPermission'
    );
    return !!!alreadyAskGeolocationPermission;
  }

  async checkAuthorization() {
    const status = await this.backgroundGeolocation.checkStatus();
    return status.authorization !== 0;
  }

  async checkIfBackgroundGeolocationIsRunning() {
    const status = await this.backgroundGeolocation.checkStatus();
    return status.isRunning;
  }

  async startOnMapTracking() {
    if (this.platform.is('ios') || this.platform.is('android')) {
      if (
        (await this.checkIfCanGetCurrentHeading()) &&
        this.currentHeadingSubscription === null
      ) {
        this.currentHeadingSubscription = this.deviceOrientation
          .watchHeading({ frequency: 16 })
          .subscribe((data: DeviceOrientationCompassHeading) =>
            this.currentHeading$.next(data.trueHeading)
          );
      }

      const notificationTitle: string = await this.translate
        .get('geolocate.notificationTitle')
        .toPromise();
      const geolocationConfig: BackgroundGeolocationConfig = {
        locationProvider:
          BackgroundGeolocationLocationProvider.DISTANCE_FILTER_PROVIDER,
        startForeground: false,
        stopOnTerminate: true,
        debug: false,
        notificationTitle,
        notificationText: 'Geolocation',
        ...environment.backgroundGeolocation
      };

      if (await this.checkIfBackgroundGeolocationIsRunning()) {
        this.backgroundGeolocation.stop();
      }

      await this.backgroundGeolocation.configure(geolocationConfig);

      this.backgroundGeolocation
        .on(BackgroundGeolocationEvents.start)
        .subscribe(async () => {
          try {
            const startLocation = await this.backgroundGeolocation.getCurrentLocation(
              {
                timeout: 10000,
                maximumAge: 0,
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
      navigator.geolocation.getCurrentPosition((position) =>
        this.currentPosition$.next([
          position.coords.longitude,
          position.coords.latitude
        ])
      );
    }

    // this.getCurrentPosition();
    // this.currentPositionInterval = window.setInterval(() => {
    //   this.getCurrentPosition();
    // }, environment.backgroundGeolocation.interval);
    //
  }

  stopOnMapTracking(
    resetHeading: boolean = true,
    resetPosition: boolean = true
  ) {
    if (this.platform.is('ios') || this.platform.is('android')) {
      if (resetHeading && this.currentHeadingSubscription) {
        this.currentHeadingSubscription.unsubscribe();
        this.currentHeadingSubscription = null;
        this.currentHeading$.next(null);
      }
      this.backgroundGeolocation.stop();
    }

    if (resetPosition) {
      this.currentPosition$.next(null);
    }

    // if (this.currentPositionInterval !== null) {
    //   window.clearInterval(this.currentPositionInterval);
    //   this.currentPositionInterval = null;
    // }
  }

  async startNotificationsModeTracking(notificationText: string) {
    if (this.platform.is('ios') || this.platform.is('android')) {
      const notificationTitle: string = await this.translate
        .get('geolocate.notificationTitle')
        .toPromise();
      const geolocationConfig: BackgroundGeolocationConfig = {
        locationProvider:
          BackgroundGeolocationLocationProvider.DISTANCE_FILTER_PROVIDER,
        startForeground: true,
        stopOnTerminate: true,
        debug: false,
        notificationTitle,
        notificationText,
        ...environment.backgroundGeolocation
      };

      if (await this.checkIfBackgroundGeolocationIsRunning()) {
        this.backgroundGeolocation.stop();
      }

      await this.backgroundGeolocation.configure(geolocationConfig);

      this.backgroundGeolocation
        .on(BackgroundGeolocationEvents.start)
        .subscribe(async () => {
          try {
            const startLocation = await this.backgroundGeolocation.getCurrentLocation(
              {
                timeout: 10000,
                maximumAge: 0,
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
      navigator.geolocation.getCurrentPosition((position) =>
        this.currentPosition$.next([
          position.coords.longitude,
          position.coords.latitude
        ])
      );
    }
  }

  stopNotificationsModeTracking() {
    if (
      (this.platform.is('ios') || this.platform.is('android')) &&
      this.checkIfBackgroundGeolocationIsRunning()
    ) {
      this.backgroundGeolocation.stop();
    }
  }

  async checkIfCanGetCurrentHeading() {
    let currentHeading: DeviceOrientationCompassHeading | null = null;
    try {
      currentHeading =
        this.platform.is('ios') || this.platform.is('android')
          ? await this.deviceOrientation.getCurrentHeading()
          : null;
    } finally {
      return (
        currentHeading !== null &&
        typeof currentHeading === 'object' &&
        (currentHeading as DeviceOrientationCompassHeading).hasOwnProperty(
          'trueHeading'
        )
      );
    }
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
      if (this.platform.is('ios') || this.platform.is('android')) {
        startLocation = await this.backgroundGeolocation.getCurrentLocation({
          timeout: 10000,
          maximumAge: 0,
          enableHighAccuracy: true
        });
      } else {
        await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              if (position) {
                startLocation = {
                  longitude: position.coords.longitude,
                  latitude: position.coords.latitude
                };
              }
              resolve(true);
            },
            () => reject()
          );
        });
      }
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
