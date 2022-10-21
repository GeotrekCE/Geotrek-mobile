import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Platform } from '@ionic/angular';
import { Geolocation, Position } from '@capacitor/geolocation';
import { Preferences } from '@capacitor/preferences';
import {
  DeviceOrientation,
  DeviceOrientationCompassHeading
} from '@awesome-cordova-plugins/device-orientation/ngx';

@Injectable({
  providedIn: 'root'
})
export class GeolocateService {
  public currentPosition$: BehaviorSubject<any> = new BehaviorSubject(null);
  public currentHeading$: BehaviorSubject<any> = new BehaviorSubject(null);
  public currentWatchId: string | null = null;
  private deviceOrientationSubscription!: Subscription;

  constructor(
    private platform: Platform,
    private deviceOrientation: DeviceOrientation
  ) {}

  async shouldShowInAppDisclosure() {
    const alreadyAskGeolocationPermission = await Preferences.get({
      key: 'alreadyAskGeolocationPermission'
    });
    return !!!alreadyAskGeolocationPermission.value;
  }

  async checkIfCanGetCurrentHeading(): Promise<boolean> {
    let deviceOrientation = false;
    if (this.platform.is('ios') || this.platform.is('android')) {
      deviceOrientation = await new Promise((resolve) => {
        this.deviceOrientation.getCurrentHeading().then(
          (data) => resolve(!!data),
          () => resolve(false)
        );
      });
    }
    return deviceOrientation;
  }

  async startOnMapTracking(): Promise<void> {
    this.currentWatchId = await Geolocation.watchPosition(
      {
        enableHighAccuracy: true
      },
      (position) => {
        if (position) {
          this.currentPosition$.next({
            longitude: position.coords.longitude,
            latitude: position.coords.latitude
          });
        }
      }
    );
  }

  startOrientationTracking() {
    if (this.platform.is('ios') || this.platform.is('android')) {
      this.deviceOrientationSubscription = this.deviceOrientation
        .watchHeading({ frequency: 200 })
        .subscribe((data: DeviceOrientationCompassHeading) =>
          this.currentHeading$.next(data.magneticHeading)
        );
    }
  }

  stopOnMapTracking() {
    if (this.currentWatchId) {
      Geolocation.clearWatch({ id: this.currentWatchId });
      this.currentWatchId = null;
      this.currentPosition$.next(null);
    }
  }

  stopOrientationTracking() {
    if (this.platform.is('ios') || this.platform.is('android')) {
      if (this.deviceOrientationSubscription) {
        this.deviceOrientationSubscription.unsubscribe();
        this.currentPosition$.next(null);
      }
    }
  }

  async getCurrentPosition(): Promise<{
    longitude: number;
    latitude: number;
  } | null> {
    let position: {
      longitude: number;
      latitude: number;
    } | null = null;
    try {
      if (this.currentPosition$.getValue()) {
        position = this.currentPosition$.getValue();
      } else {
        const currentPosition = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true
        });
        position = {
          longitude: currentPosition.coords.longitude,
          latitude: currentPosition.coords.latitude
        };
      }
    } catch (error) {
      position = null;
    } finally {
      return position;
    }
  }
}
