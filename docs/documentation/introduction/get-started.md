# Installation

## Préparation de l’environnement

Suivez les instructions officielles pour configurer votre environnement de développement : [Guide d’installation de Capacitor](https://capacitorjs.com/docs/getting-started/environment-setup)

### Cloner le dépôt et installer les dépendances :

```bash
git clone git@github.com:GeotrekCE/Geotrek-mobile.git
cd Geotrek-mobile
npm install
```

# Créer votre propre application

Pour personnaliser l’application à votre territoire, il est nécessaire de modifier au minimum les fichiers suivants :

* `capacitor.config.ts`
* `src/environments/environment.ts`
* `src/environments/environment.prod.ts`

Remplacez également les ressources graphiques par vos propres fichiers :

* `resources/icon.png` (1024×1024 px)
* `resources/splash.png` (2732×2732 px)

# Génération d’une version de production

### Construction de l’application en mode production

```bash
npx ionic build --configuration production
```

## Ajouter une plateforme mobile

### iOS

```bash
npx cap add ios
```

### Android

```bash
npx cap add android
```


## Génération des icônes et écrans de lancement

```bash
npx @capacitor/assets generate --android --ios
```

## Configuration native

```bash
npx trapeze run config.yaml
```

Une fois la configuration appliquée, vous pouvez générer l'application finale via **Xcode** (iOS) et **Android Studio** (Android).

