# Geotrek Mobile

Mobile application of _Geotrek Rando_ (http://geotrek.fr).

# INSTALLATION

```
git clone git@github.com:GeotrekCE/Geotrek-mobile.git
cd Geotrek-mobile
npm install
```

[iOS environment setup](https://ionicframework.com/docs/installation/ios)\
[Android environment setup](https://ionicframework.com/docs/installation/android)

# BUILD RELEASE APP

```
npx ionic build --configuration production
```

## iOS

```
npx cap add ios
```

## Android

```
npx cap add android
```

# CUSTOMIZATION OPTIONS

capacitor.config.ts

src/environments/environment.ts & environment.prod.ts

src/theme/variables.scss

src/assets/i18n/

src/assets/map/icons/

resources/

# End-to-end testing

```
npx cypress open
```

# LICENCE

- OpenSource - BSD
- Copyright (c) Makina Corpus - Parc National des Écrins

[<img src="https://geotrek.fr/assets/img/logo_makina.svg">](http://www.makina-corpus.com)
[<img src="http://geonature.fr/img/logo-pne.jpg">](http://www.ecrins-parcnational.fr)
