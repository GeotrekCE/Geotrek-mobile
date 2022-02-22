import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { BackgroundGeolocation } from '@ionic-native/background-geolocation/ngx';

import { File } from '@ionic-native/file/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Zip } from '@ionic-native/zip/ngx';
import { Globalization } from '@ionic-native/globalization/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Network } from '@ionic-native/network/ngx';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics/ngx';
import { DeviceOrientation } from '@ionic-native/device-orientation/ngx';

import { AppRoutingModule } from '@app/app-routing.module';
import { AppComponent } from '@app/app.component';

import { PoiDetailsComponent } from '@app/components/poi-details/poi-details.component';
import { InformationDeskDetailsComponent } from '@app/components/information-desk-details/information-desk-details.component';

import { ProgressComponent } from '@app/components/progress/progress.component';
import { LayersVisibilityComponent } from '@app/components/layers-visibility/layers-visibility.component';

import { TreksOrderComponent } from './components/treks-order/treks-order.component';

import { IonicStorageModule } from '@ionic/storage-angular';

import { SettingsService } from '@app/services/settings/settings.service';
import { OnlineTreksService } from '@app/services/online-treks/online-treks.service';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

registerLocaleData(localeFr, 'fr');

@NgModule({
  declarations: [
    AppComponent,
    PoiDetailsComponent,
    ProgressComponent,
    InformationDeskDetailsComponent,
    LayersVisibilityComponent,
    TreksOrderComponent
  ],
  entryComponents: [
    PoiDetailsComponent,
    ProgressComponent,
    InformationDeskDetailsComponent,
    LayersVisibilityComponent,
    TreksOrderComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot({
      mode: 'md',
      animated: true
    }),
    AppRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    IonicStorageModule.forRoot()
  ],
  providers: [
    StatusBar,
    SplashScreen,
    File,
    Zip,
    WebView,
    BackgroundGeolocation,
    LocalNotifications,
    ScreenOrientation,
    Globalization,
    SocialSharing,
    Network,
    FirebaseAnalytics,
    DeviceOrientation,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: APP_INITIALIZER,
      useFactory:
        (
          settingsService: SettingsService,
          onlineTreksService: OnlineTreksService,
          platform: Platform,
          splashScreen: SplashScreen
        ) =>
        () => {
          return new Promise(async (resolve) => {
            await settingsService.initializeSettings();
            await onlineTreksService.loadTreks();
            if (platform.is('ios') || platform.is('android')) {
              splashScreen.hide();
            }
            resolve(true);
          });
        },
      deps: [SettingsService, OnlineTreksService, Platform, SplashScreen],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
