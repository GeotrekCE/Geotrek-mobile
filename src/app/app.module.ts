import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';
import { MoreItemResolver } from '@app/resolvers/more-item.resolver';
import { MoreResolver } from '@app/resolvers/more.resolver';
import { LoadingInterceptor } from '@app/services/loading/loading.service';
import { SharedUiModule } from '@app/shared/shared-ui.module';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

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
import { Network } from '@ionic-native/network/ngx';

import { AppRoutingModule } from '@app/app-routing.module';
import { AppComponent } from '@app/app.component';

import { FiltersComponent } from '@app/components/filters/filters.component';
import { FilterComponent } from './components/filter/filter.component';
import { PoiDetailsComponent } from '@app/components/poi-details/poi-details.component';
import { InformationDeskDetailsComponent } from '@app/components/information-desk-details/information-desk-details.component';
import { SearchComponent } from '@app/components/search/search.component';
import { ProgressComponent } from '@app/components/progress/progress.component';

import { FilterValueComponent } from './components/filter-value/filter-value.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    FiltersComponent,
    PoiDetailsComponent,
    SearchComponent,
    ProgressComponent,
    FilterComponent,
    FilterValueComponent,
    InformationDeskDetailsComponent,
  ],
  entryComponents: [
    FiltersComponent,
    PoiDetailsComponent,
    SearchComponent,
    ProgressComponent,
    InformationDeskDetailsComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot({ mode: 'md', animated: true }),
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
    SharedUiModule,
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
    Network,
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
