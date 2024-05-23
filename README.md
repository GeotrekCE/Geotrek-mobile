# Geotrek Mobile

Mobile application of _Geotrek Rando_ (http://geotrek.fr).

# INSTALLATION

[Environment Setup](https://capacitorjs.com/docs/getting-started/environment-setup)

```
git clone git@github.com:GeotrekCE/Geotrek-mobile.git
cd Geotrek-mobile
npm install
```

# Create your own application

Modify at least these files capacitor.config.ts, src/environments/environment.ts and environment.prod.ts.\
Replace resources/icon.png (1024×1024px) and resources/splash.png (2732×2732px).

# BUILD RELEASE APP

```
npx ionic build --configuration production
```

## Add iOS platform

```
npx cap add ios
```

## Add Android platform

```
npx cap add android
```

## Icons and splashscreens

```
npx @capacitor/assets generate --android --ios
```

## Native configuration

```
npx trapeze run config.yaml
```

Now you can create your release app using xCode and Android Studio.

# LICENCE

- OpenSource - BSD
- Copyright (c) Makina Corpus - Parc National des Écrins

[<img src="https://geotrek.fr/assets/img/logo_makina.svg">](https://territoires.makina-corpus.com/)
[<img src="https://geonature.fr/img/logo-pne.jpg">](https://www.ecrins-parcnational.fr)
