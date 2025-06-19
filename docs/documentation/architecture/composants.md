## Architecture technique de l’application

L’application **Geotrek-mobile** repose sur une architecture moderne et modulaire, conçue pour être performante, maintenable et compatible avec la plupart des appareils mobiles.

### Composants techniques principaux

* **Frameworks** :

  * Développement basé sur **[Angular](https://angular.dev/)**, associé à **[Ionic](https://ionicframework.com/)** pour la gestion de l’interface mobile
  * Utilisation de **[Capacitor](https://capacitorjs.com/)** pour l’encapsulation de l’application dans un environnement natif (Android / iOS)

* **Langage** :

  * Code écrit en **[TypeScript](https://www.typescriptlang.org/)**, permettant une meilleure **maintenabilité** et une réduction des risques de bugs grâce au typage statique. P
* **Gestion cartographique** :

  * Cartes intégrées à l’aide de **[Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/api/)**, permettant un affichage fluide, interactif et vectoriel des données géographiques

* **Fonds de carte** :

  * Par défaut, l’application utilise les fonds **[OpenStreetMap](https://www.openstreetmap.org/about)** (OSM), mais peut aussi intégrer d’autres fonds selon les droits et les préférences du territoire (OpenTopoMap, IGN…)
