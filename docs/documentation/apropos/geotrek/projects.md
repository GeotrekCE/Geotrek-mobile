# Les quatre briques

La suite logicielle Geotrek dispose de quatre briques à la fois distinctes et complémentaires :

* [Geotrek-admin](https://geotrek.readthedocs.io/en/master//about/geotrek.html): outil de gestion et de saisie de l’ensemble des informations, intégrant les données des Systèmes d’Informations Touristiques (SIT) et pouvant être connecté à votre SIG ou à des systèmes d’information transport
* [Geotrek-rando](https://github.com/GeotrekCE/Geotrek-rando-v3/blob/main/docs/presentation-fr.md) : site web, reprenant les informations saisies dans Geotrek-admin, à destination des internautes grand public
* [Geotrek-mobile](https://github.com/GeotrekCE/Geotrek-mobile#geotrek-mobile) : application mobile fonctionnant sous Android et iOS, reprenant des informations saisies dans Geotrek-admin et optimisées pour l’usage mobile (volume, impact sur la batterie, hors-ligne, géolocalisation…)
* [Geotrek-rando-widget](/documentation/introduction/overview.html) : nouveau composant web permettant de valoriser une offre de contenus touristiques et de randonnées auprès des usagers du territoire, en l'intégrant dans un site internet existant.

::: info
Cette documentation ne traite que de **Geotrek-rando-widget**, chaque brique ayant sa propre documentation.
:::

## Utilisateurs


L’application Geotrek, **destinée à deux types de public**, est une solution web qui apporte :

* des fonctionnalités de gestion des informations (itinéraires, sites outdoor, points d’intérêts, description, interprétation, médias…) et de gestion des infrastructures (signalétique, aménagements, travaux, réglementation…) pour les utilisateurs gérant un territoire (**Geotrek-admin**) 
* des fonctionnalités simples et ludiques de recherche et de consultation d’itinéraires pour les internautes et les mobinautes (**Geotrek-rando V3**, **Geotrek-mobile** et **Geotrek-rando-widget**).

Pour retrouver plus d'informations sur la suite applicative Geotrek, rendez-vous sur [https://geotrek.fr](https://geotrek.fr)

## Composants libres

L’application Geotrek utilise les technologies open source suivantes :

### Geotrek-admin

* **Python / Django**, l'épine dorsale de l'application qui prend en charge les principales fonctionnalités comme le module de configuration, l'exploitation de la base de données, la gestion des utilisateurs et de leurs droits ou l'intégration avec les bibliothèques cartographiques. La richesse de son écosystème permet de concevoir des applications aux possibilités infinies, en favorisant la production d'applications sécurisées, solides (tests automatiques) et robustes (Python).
* **PostgreSQL / PostGIS** pour la base de données. La totalité des données de l'application est stockée dans une instance PostgreSQL avec l'extension spatiale PostGIS :

  * attributs, comptes utilisateurs…,
  * géométries,
  * raster (Modèle Numérique Terrain).

### Geotrek-rando
* **Next.js** (*React, Typescript*), 
* **Leaflet**, utilisé comme librairie cartographique

### Geotrek-rando-widget

* **Stencil**, framework permettant de créer des composants web personnalisables et légers.
* **Leaflet**, utilisé comme librairie cartographique

### Geotrek-mobile

* **Angular**, framework utilisé pour l'application Geotrek-mobile.
* **Ionic**, composant UI
* **Capacitor**, boîte à outils nécessaires à la création d'applications mobiles
* **MapLibre**, utilisé comme librairie cartographique 