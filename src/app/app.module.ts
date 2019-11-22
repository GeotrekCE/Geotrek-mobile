import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';
import { MoreItemResolver } from '@app/resolvers/more-item.resolver';
import { MoreResolver } from '@app/resolvers/more.resolver';
import { LoadingInterceptor } from '@app/services/loading/loading.service';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { Animation } from '@ionic/core';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { TrekContextResolver } from '@app/resolvers/trek.resolver';
import { TreksContextResolver } from '@app/resolvers/treks.resolver';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation/ngx';

import { File } from '@ionic-native/file/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Zip } from '@ionic-native/zip/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { Globalization } from '@ionic-native/globalization/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Network } from '@ionic-native/network/ngx';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics/ngx';

import { AppRoutingModule } from '@app/app-routing.module';
import { AppComponent } from '@app/app.component';

import { PoiDetailsComponent } from '@app/components/poi-details/poi-details.component';
import { InformationDeskDetailsComponent } from '@app/components/information-desk-details/information-desk-details.component';

import { ProgressComponent } from '@app/components/progress/progress.component';
import { LayersVisibilityComponent } from '@app/components/layers-visibility/layers-visibility.component';

import { TreksOrderComponent } from './components/treks-order/treks-order.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function noAnimation(AnimationC: Animation): Promise<Animation> {
  return Promise.resolve(new AnimationC());
}

registerLocaleData(localeFr, 'fr');

@NgModule({
  declarations: [
    AppComponent,
    PoiDetailsComponent,
    ProgressComponent,
    InformationDeskDetailsComponent,
    LayersVisibilityComponent,
    TreksOrderComponent,
  ],
  entryComponents: [
    PoiDetailsComponent,
    ProgressComponent,
    InformationDeskDetailsComponent,
    LayersVisibilityComponent,
    TreksOrderComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot({
      mode: 'md',
      animated: true,
      navAnimation: noAnimation,
    }),
    AppRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    IonicStorageModule.forRoot(),
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
    MoreResolver,
    MoreItemResolver,
    TrekContextResolver,
    TreksContextResolver,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
