# Installation

## Preparing the environment

Follow the official instructions to set up your development environment: [Capacitor Installation Guide](https://capacitorjs.com/docs/getting-started/environment-setup)

### Clone the repository and install dependencies:

```bash
git clone git@github.com:GeotrekCE/Geotrek-mobile.git
cd Geotrek-mobile
npm install
```

# Create your own application

To customize the application for your territory, you need to modify at least the following files:

* `capacitor.config.ts`
* `src/environments/environment.ts`
* `src/environments/environment.prod.ts`

Also replace the graphic resources with your own files:

* `resources/icon.png` (1024×1024 px)
* `resources/splash.png` (2732×2732 px)

# Building a production version

### Build the application in production mode

```bash
npx ionic build --configuration production
```

## Add a mobile platform

### iOS

```bash
npx cap add ios
```

### Android

```bash
npx cap add android
```

## Generate icons and splash screens

```bash
npx @capacitor/assets generate --android --ios
```

## Native configuration

```bash
npx trapeze run config.yaml
```

Once the configuration is applied, you can generate the final application using **Xcode** (iOS) and **Android Studio** (Android).

