import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { IonicModule, IonicRouteStrategy, Platform } from '@ionic/angular';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SplashScreen } from '@capacitor/splash-screen';
import { DeviceOrientation } from '@awesome-cordova-plugins/device-orientation/ngx';
import { AppRoutingModule } from '@app/app-routing.module';
import { AppComponent } from '@app/app.component';
import { PoiDetailsComponent } from '@app/components/poi-details/poi-details.component';
import { InformationDeskDetailsComponent } from '@app/components/information-desk-details/information-desk-details.component';
import { ProgressComponent } from '@app/components/progress/progress.component';
import { LayersVisibilityComponent } from '@app/components/layers-visibility/layers-visibility.component';
import { TreksOrderComponent } from '@app/components/treks-order/treks-order.component';
import { FiltersComponent } from '@app/components/filters/filters.component';
import { FilterComponent } from '@app/components/filter/filter.component';
import { FilterValueComponent } from '@app/components/filter-value/filter-value.component';
import { SearchComponent } from '@app/components/search/search.component';
import { SelectFilterComponent } from '@app/components/select-filter/select-filter.component';
import { SelectPoiComponent } from '@app/components/select-poi/select-poi.component';
import { InAppDisclosureComponent } from '@app/components/in-app-disclosure/in-app-disclosure.component';
import { SettingsService } from '@app/services/settings/settings.service';
import { OnlineTreksService } from '@app/services/online-treks/online-treks.service';
import { SelectTrekComponent } from '@app/components/select-trek/select-trek.component';

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
    FiltersComponent,
    FilterComponent,
    FilterValueComponent,
    SearchComponent,
    SelectFilterComponent,
    TreksOrderComponent,
    InAppDisclosureComponent,
    SelectPoiComponent,
    SelectTrekComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot({
      mode: 'md'
    }),
    AppRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    DeviceOrientation,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: APP_INITIALIZER,
      useFactory:
        (
          settingsService: SettingsService,
          onlineTreksService: OnlineTreksService
        ) =>
        async () => {
          return new Promise(async (resolve) => {
            await settingsService.initializeSettings();
            await onlineTreksService.loadTreks();
            SplashScreen.hide();
            resolve(true);
          });
        },
      deps: [SettingsService, OnlineTreksService, Platform],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
