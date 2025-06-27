# Principales options de configuration

Cette page présente les principales options de configuration à modifier dans le fichier :

`mobile/config/src/environments/environment.prod.ts`

## Activer la page d'accueil

Par défaut, l’application présente un affichage des itinéraires par liste ou par vignette. Pour afficher une **page d'accueil** avec un menu :

Modifier la ligne suivante :

```diff
- navigation: 'tabs',
+ navigation: 'menu',
```

## Afficher les vignettes vers les pratiques outdoor

Pour activer l’affichage des **pratiques outdoor** (via ferrata, escalade, parapente, etc.) en page d’accueil :

Modifier la ligne suivante :

```diff
- enableOutdoorPracticesShortcuts: false,
+ enableOutdoorPracticesShortcuts: { portals: [] },
```

**Astuce** :
Si vous souhaitez activer cette fonctionnalité uniquement pour certains portails, ajoutez leurs identifiants dans le tableau `portals`.

Exemple :

```ts
enableOutdoorPracticesShortcuts: { portals: ['2,5'] },
```

## Choisir le tri initial des itinéraires

L’ordre d’affichage des contenus peut être défini par l’une des options suivantes :

* `alphabetical` (ordre alphabétique, par défaut)
* `random` (ordre aléatoire)
* `location` (par proximité géographique)

Exemple pour un tri par **proximité géographique** :

```ts
initialOrder: 'location',
```

## Définir la distance de déclenchement des notifications POI

L’application peut notifier l’utilisateur à l’approche d’un point d’intérêt (POI).

Pour modifier la distance à partir de laquelle la notification s’affiche (en mètres) :

```ts
metersToNotify: 200,
```

Exemple : pour notifier à 300 mètres :

```ts
metersToNotify: 300,
```

## Modifier le fond de carte

Voici un exemple de configuration pour afficher le fond de carte **Plan IGN V2** :

```ts
sources: {
  'tiles-background': {
    type: 'raster',
    tiles: [
      'https://data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&STYLE=normal&FORMAT=image/png&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}'
    ],
    tileSize: 256
  }
}
```

**À noter** :
Il est possible d’utiliser d’autres fonds de carte compatibles avec Mapbox GL JS (raster ou vectoriel), en adaptant l’URL et les paramètres `sources` et `layers`.

# Paramètres de confonfigurations possibles

Vous pouvez retrouver l'ensemble des paramètres disponibles pour la surcharge de configuration mobile ici : [/main/src/environments/environment.prod.ts](https://github.com/GeotrekCE/Geotrek-mobile/blob/main/src/environments/environment.prod.ts)
