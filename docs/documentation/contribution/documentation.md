# Documentation

## Installation en mode développement

### Prérequis

**1. Cloner le dépot**

```bash
git clone git@github.com:GeotrekCE/Geotrek-mobile.git
```

**2. Installer les modules npm**

```bash
npm install
```

### Démarrer l'application

Démarrer le serveur en mode développement en lançant cette commande :

```bash
npm run docs:dev
```

Rendez vous ensuite sur cette URL :

```bash
http://localhost:5173/
```

## Contribuer

**1. Contribuer les fichiers existants**

Vous pouvez commencer à contribuer la documentation de Geotrek-rando-widget en mettant à jour les fichiers markdown présents dans le dossier `docs/documentation` :

```bash
cd /docs/documentation
```

Chaque sous-dossier présent dans /docs concerne une section de la documentation (Introduction, Thème, Composants, etc.).

**2. Ajouter de nouvelles sections**

Pour ajouter une nouvelle section, il faut créer un nouveau dossier ainsi que les fichiers markdown `docs/.vitepress/config.mts` :

```bash
cd /docs/.vitepress/config.mts
```

Exemple de création de nouvelle section :

```js
    {
        text: 'Nouvelle Section',
        items: [
          { text: 'Partie 1', link: '/documentation/newsection/partie1' },
          { text: 'Partie 2', link: '/documentation/newsection/partie2' },
        ],
      }
```

## Traduire la documentation

Traduire une documentation utilisateur dans une autre langue que le français offre plusieurs avantages :

- **Améliorer l'accessibilité** : en traduisant la documentation de Geotrek-mobile, vous contribuez à rendre le produit accessible à un public plus large à travers le monde
- **Améliorer l'expérience utilisateur** : la traduction de la documentation dans la langue des utilisateurs permet de faciliter la compréhension et l'utilisation et donc d'améliorer leur expérience globale du produit
- **Faciliter la collaboration** : si Geotrek-mobile est utilisé par une équipe internationale, avoir une documentation en anglais facilite la collaboration, le support et la communication

