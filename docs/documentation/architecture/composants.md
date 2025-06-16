## Architecture technique de l’application

L’application **Geotrek-mobile** repose sur une architecture moderne et modulaire, conçue pour être performante, maintenable et compatible avec la plupart des appareils mobiles.

### Composants techniques principaux

* **Frameworks** :

  * Développement basé sur **Angular**, associé à **Ionic** pour la gestion de l’interface mobile
  * Utilisation de **Cordova** pour l’encapsulation de l’application dans un environnement natif (Android / iOS)

* **Langage** :

  * Code écrit en **TypeScript**, permettant une meilleure **maintenabilité** et une réduction des risques de bugs grâce au typage statique
  * Pour plus d’informations : [Makina Corpus – Les nouveautés de TypeScript 3.0](https://makina-corpus.com/blog/metier/2018/les-nouveautes-de-typescript-3.0)

* **Gestion cartographique** :

  * Cartes intégrées à l’aide de **Mapbox GL JS**, permettant un affichage fluide, interactif et vectoriel des données géographiques

* **Fonds de carte** :

  * Par défaut, l’application utilise les fonds **OpenStreetMap** (OSM), mais peut aussi intégrer d’autres fonds selon les droits et les préférences du territoire (OpenTopoMap, IGN…)
