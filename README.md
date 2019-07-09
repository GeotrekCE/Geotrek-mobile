# Geotrek Mobile

Mobile application of _Geotrek Rando_ (http://geotrek.fr).

# INSTALLATION

_Before proceeding, make sure the latest version of [Node.js and npm](https://nodejs.org/en/) are installed_

    npm install -g ionic@5.1.0

    npm install -g cordova@9.0.0

    git clone git@github.com:GeotrekCE/Geotrek-mobile.git

    cd Geotrek-mobile

    npm install

# RUN THE APP IN THE BROWSER

_Minimum requirements : Fill in 'onlineBaseUrl' in 'src/environments/environments.ts'_ with your personal api url

    ionic serve

# RUN THE APP ON DEVICE

/!\ The `run` argument build the apk, then install it on the device

## iOS

_Need [iOS environment setup](https://ionicframework.com/docs/installation/ios) available only on macOS_

    ionic cordova run ios

## Android

_Need [Android environment setup](https://ionicframework.com/docs/installation/android) available on Windows, macOS and Linux_

    ionic cordova run android

# BUILD RELEASE APP

_Minimum requirements : Fill in 'onlineBaseUrl' in 'src/environments/environments.prod.ts'_ with your personal api url

/!\ The `build` argument just build the apk, but don't install it on the device

## iOS

    ionic cordova build ios --prod --release

## Android

    ionic cordova build android --prod --release

# CUSTOMIZATION OPTIONS

You can find below all available options. You can easily overwrite them to customize your app.

## config.xml

App id

    <widget  id="io.geotrek.starter" ...>

App name

    <name>Geotrek Starter</name>

## src/environments/environment.ts & environment.prod.ts

You can overwrite a lot of options inside these files:  
AppName (header of the app) , availableLanguage, api url, map options and more

_environment.prod.ts will be use for development  
environment.prod.ts will be use for release app_

## src/assets/i18n

You can find all the internationalization ressources here (by default Fr and En)

## src/assets/map/icons/

Local icons to display on the map, like departure or parking icon

## src/assets/map/zone/zone.geojson

Geosjon to display on the map  
_Generally represents the limits of the geographical area of the application_

## src/theme/variables.scss

Colors that will be used  
_The most important point here is the primary color to customize your application_

## icons and splashscreen

- The source image for icons should ideally be at least 1024×1024px and located in resources/icon.png

- The source image for splash screens should ideally be at least 2732×2732px and located in resources/splash.png. For best results, the splash screen's artwork should roughly fit within a square (1200×1200px) at the center of the image.

Then you just have to run

    ionic cordova resources

## Other resources

- All others resources are provided by the api
  _We download a global package for offline mode when user downloads his first trek_

## Firebase Analytics Configuration

In order to use Firebase analytics, you had to create a Firebase App.

- Then store google-services.json and GoogleService-Info.plist in ./Analytics/
- In config.xml, add

```
  <platform name="android">
    <resource-file src="analytics/google-services.json" target="app/google-services.json" />
    ...
  </platform>
  <platform name="ios">
    <resource-file src="analytics/GoogleService-Info.plist" />
    ...
  </platform>
```

- Set true to useFirebase variable in environment files

## Remove Firebase Analytics

In order to build the app without Firebase you had to

- Set false to useFirebase variable in environment files

- Run this list of command
  (If you add platforms previously, be sure to delete them)

```
    ionic cordova platform rm android

    ionic cordova platform rm ios

    ionic cordova plugin rm cordova-plugin-firebase-analytics

    ionic cordova plugin rm cordova-android-play-services-gradle-release

    ionic cordova plugin rm cordova-support-google-services

    ionic cordova plugin rm cordova-support-android-plugin

    ionic cordova platform add android

    ionic cordova build android
```

## Documentation

[Access to extensive documentation](https://geotrekce.github.io/Geotrek-mobile)

# LICENCE

- OpenSource - BSD
- Copyright (c) Makina Corpus - Parc National des Écrins

[<img src="http://depot.makina-corpus.org/public/logo.gif">](http://www.makina-corpus.com)
[<img src="http://geonature.fr/img/logo-pne.jpg">](http://www.ecrins-parcnational.fr)
