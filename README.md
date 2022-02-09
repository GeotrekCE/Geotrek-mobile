# Geotrek Mobile

Mobile application of _Geotrek Rando_ (http://geotrek.fr).

# INSTALLATION

```
npm install -g @ionic/cli@6.18.1
npm install -g cordova@11.0.0
npm install -g cordova-res@0.15.4
git clone git@github.com:GeotrekCE/Geotrek-mobile.git
cd Geotrek-mobile
npm install
```

[iOS environment setup](https://ionicframework.com/docs/installation/ios)\
[Android environment setup](https://ionicframework.com/docs/installation/android)

# RUN THE APP

_Minimum requirements : Fill in 'onlineBaseUrl' in 'src/environments/environment.ts'_ with your personal api url (the one you can create [here](https://geotrek.readthedocs.io/en/master/synchronization.html#geotrek-mobile-app-v3) and configure [here](https://github.com/GeotrekCE/Geotrek-rando/blob/master/docs/http-server.md))

## BROWSER

```
ionic serve
```

## iOS

```
ionic cordova run ios
```

## Android

```
ionic cordova run android
```

# BUILD RELEASE APP

_Minimum requirements : Fill in 'onlineBaseUrl' in 'src/environments/environment.prod.ts'_ with your personal api url

## iOS

```
npm run build:ios
```

## Android

```
npm run build:android
```

# CUSTOMIZATION OPTIONS

## config.xml

App id

```
<widget  id="io.geotrek.starter" ...>
```

App name

```
<name>Geotrek Starter</name>
```

## src/environments/environment.ts & environment.prod.ts

You can overwrite a lot of options inside these files
AppName (header of the app) , availableLanguage, api url, map options and more

_environment.ts will be use for development  
environment.prod.ts will be use for release app_

## src/assets/i18n

You can find all the internationalization ressources here (by default Fr and En)

## src/assets/map/icons/

Local icons to display on the map, like departure or parking icon

## src/theme/variables.scss

Colors that will be used  
_The most important point here is the primary color to customize your application_

## icons and splashscreen

- The source image for icons should ideally be at least 1024×1024px and located in resources/icon.png

- The source image for splash screens should ideally be at least 2732×2732px and located in resources/splash.png. For best results, the splash screen's artwork should roughly fit within a square (1200×1200px) at the center of the image.

Then you have to run

```
ionic cordova resources
```

## Firebase Analytics Configuration

To use Firebase analytics, you had to create a Firebase App

- Then store google-services.json and GoogleService-Info.plist in ./Analytics/

- Set true to useFirebase variable in environment files

## Remove Firebase Analytics

To build the app without Firebase you had to

- Remove these plugins

```
ionic cordova plugin rm cordova-plugin-firebase-analytics
ionic cordova plugin rm cordova-android-play-services-gradle-release
ionic cordova plugin rm cordova-support-android-plugin
```

- In config.xml, remove these resource file lines

```
<resource-file src="analytics/google-services.json" target="app/google-services.json" />
<resource-file src="analytics/GoogleService-Info.plist" />
```

# End-to-end testing

```
npx cypress open
```

# LICENCE

- OpenSource - BSD
- Copyright (c) Makina Corpus - Parc National des Écrins

[<img src="https://geotrek.fr/assets/img/logo_makina.svg">](http://www.makina-corpus.com)
[<img src="http://geonature.fr/img/logo-pne.jpg">](http://www.ecrins-parcnational.fr)
