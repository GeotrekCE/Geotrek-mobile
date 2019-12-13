import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';

// const TRANSLATIONS_EN = require('../assets/i18n/en.json');
// const TRANSLATIONS_FR = require('../assets/i18n/fr.json');
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { createTranslateLoader } from './app.module';
import { Globalization } from '@ionic-native/globalization/ngx';
import { IonicStorageModule } from '@ionic/storage';

describe('AppComponent', () => {
  let statusBarSpy: any,
    splashScreenSpy: any,
    platformReadySpy: any,
    platformSpy: any,
    globalizationSpy: any;
  // let translate: TranslateService;
  // let http: HttpTestingController;

  beforeEach(async(() => {
    statusBarSpy = jasmine.createSpyObj('StatusBar', ['styleLightContent']);
    splashScreenSpy = jasmine.createSpyObj('SplashScreen', ['hide']);
    platformReadySpy = Promise.resolve();
    platformSpy = jasmine.createSpyObj('Platform', {
      ready: platformReadySpy,
      is: 'ios'
    });
    globalizationSpy = jasmine.createSpyObj('Globalization', {
      getPreferredLanguage: { value: ['fr'] }
    });

    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: createTranslateLoader,
            deps: [HttpClient]
          }
        }),
        IonicStorageModule.forRoot()
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: StatusBar, useValue: statusBarSpy },
        { provide: SplashScreen, useValue: splashScreenSpy },
        { provide: Platform, useValue: platformSpy },
        { provide: Globalization, useValue: globalizationSpy }
      ]
    }).compileComponents();
    // translate = TestBed.get(TranslateService);
    // http = TestBed.get(HttpTestingController);
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should initialize the app', async () => {
    TestBed.createComponent(AppComponent);
    expect(platformSpy.ready).toHaveBeenCalled();
    await platformReadySpy;
  });

  // TODO: add more tests!
});
