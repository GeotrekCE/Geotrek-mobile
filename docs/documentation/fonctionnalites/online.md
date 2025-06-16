# Fonctionnalités

## Interface graphique et ergonomie

### Personnalisation

L’application **Geotrek-mobile** est personnalisable aux couleurs de la charte graphique de la structure gestionnaire. Cela inclut notamment :

* la couleur principale de l’interface,
* le **nom de l’application** affiché sur l’écran d’accueil et l’icône du smartphone ou de la tablette.

## Écran principal de l’application

L’écran d’accueil donne accès aux principales fonctionnalités de découverte des itinéraires.

### Modes d’affichage

* **Par liste**
* **Par vignettes** (2 par ligne)

### Classement des itinéraires

* Par **ordre alphabétique** (par défaut)
* Par **proximité** (en fonction de la position GPS de l’utilisateur)
* En **ordre aléatoire**

### Informations affichées pour chaque itinéraire

* Une photo représentative
* Le **titre de la randonnée**
* La **commune de départ** et, si différente, celle d’arrivée
* Un pictogramme indiquant la **pratique associée** (randonnée pédestre, VTT, etc.)
* Le **niveau de difficulté**, la **durée**, la **distance**
* Un bouton permettant de revenir à la liste complète des itinéraires

## Accès aux cartes et aux fonctionnalités principales

L’application propose une **carte interactive** permettant une exploration intuitive des itinéraires.

### Carte principale

* **Fonds de carte** disponibles :

  * OpenStreetMap
  * OpenTopoMap
  * IGN (si la structure dispose d’un accès spécifique)
* **Pictogrammes** localisant les randonnées
* **Clusters** (regroupement d’itinéraires proches)
* **Zoom/dézoom**, **échelle**, et mentions légales des cartes
* **Localisation GPS** de l’utilisateur avec cône d’orientation
* Bouton pour **revenir à la liste des randonnées**

## Fiche détail d’un itinéraire

En sélectionnant une randonnée (depuis la liste ou la carte), l’utilisateur accède à une fiche complète incluant :

### Contenus disponibles

* **Nom de la randonnée**
* **Photos** (une ou plusieurs)
* **Description**
* **Partage** de l’URL
* **Téléchargement** de la fiche pour une utilisation en mode déconnecté
* **Caractéristiques** :

  * Départ / Arrivée
  * Communes concernées
  * Durée
  * Distance
  * Dénivelé
  * Difficulté
  * Type de parcours
  * Pratique(s) recommandée(s)
* **Thématique(s)** (si renseignée)
* **Description pas à pas** (étapes de l’itinéraire)

  * Possibilité d’indiquer le balisage
* **Profil altimétrique**
* Informations touristiques :

  * **Parking conseillé**
  * **Recommandations**
  * **Lieux de renseignement**
  * **Hébergement, restauration, patrimoine à proximité**

## Carte de l’itinéraire sélectionné

Depuis une fiche détail, il est possible d’accéder à la carte du parcours. Celle-ci affiche :

* Le **tracé complet** de la randonnée
* Les **étapes** correspondant au descriptif pas à pas
* Le **point de départ** et **d’arrivée** (visuels distinctifs)
* Le **sens de parcours** (flèches directionnelles)
* Les **éléments touristiques** (pictos spécifiques)

  * Possibilité de regrouper sous forme de cluster
* Fonction **zoom/dézoom**
* Bouton **GPS / géolocalisation en direct**

  * Mode de suivi : recentrage automatique sur l’utilisateur
* Bouton pour **revenir au tracé complet**
* Bouton pour **afficher/masquer les éléments de patrimoine**
* **Cône d’orientation** de l’appareil
* **Notifications** activables
* Possibilité de revenir à tout moment à la fiche détail de l’itinéraire.

## Filtres et recherche

### Filtres

Les filtres disponibles sont configurés en amont dans **Geotrek-Admin**. Ils permettent de restreindre l’affichage des randonnées sur la liste **et sur la carte** :

Filtres possibles :

* Par **pratique**
* Par **difficulté**
* Par **dénivelé**
* Par **thématique**
* Par **type de parcours**
* Par **commune**
* **Accessibilité** (présence d’aménagements spécifiques)

Fonctionnalités associées :

* Possibilité de **réinitialiser** tous les filtres ("Effacer tout")

### Recherche

La recherche permet d’accéder rapidement à une randonnée par son **nom**.
Elle dispose d’un système **d’auto-complétion** : les résultats s’affinent à chaque lettre saisie.

## Cas de l’itinérance (randonnées sur plusieurs jours)

Les randonnées en itinérance sont présentées comme des itinéraires classiques, mais indiquent :

* Le **nombre d’étapes** dans les caractéristiques
* Une **liste des étapes**, accessible dans la fiche détail

Chaque étape dispose de sa propre fiche, avec les mêmes fonctionnalités qu’un itinéraire standard.

