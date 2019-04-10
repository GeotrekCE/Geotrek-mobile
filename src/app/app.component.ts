import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '@env/environment';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { OnlineTreksService } from '@app/services/online-treks/online-treks.service';
import { Globalization } from '@ionic-native/globalization/ngx';
import { SettingsService } from '@app/services/settings/settings.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private translate: TranslateService,
    private globalization: Globalization,
    private onlineTreks: OnlineTreksService,
    private settings: SettingsService,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      let defaultLanguage;

      if (this.platform.is('ios') || this.platform.is('android')) {
        defaultLanguage = (await this.globalization.getPreferredLanguage()).value.slice(0, 2);
        this.statusBar.styleLightContent();
        this.splashScreen.hide();
      } else {
        defaultLanguage = navigator.language.slice(0, 2);
      }

      // we assume that availableLanguage[0] is default language if user language is not available
      if (environment.availableLanguage && environment.availableLanguage.length > 0) {
        if (environment.availableLanguage.indexOf(defaultLanguage) === -1) {
          defaultLanguage = environment.availableLanguage[0];
        }
      } else {
        // or 'fr' if array is empty
        defaultLanguage = 'fr';
      }

      this.translate.setDefaultLang(defaultLanguage);

      this.settings.loadSettings();
      this.onlineTreks.loadTreks();
    });
  }
}
