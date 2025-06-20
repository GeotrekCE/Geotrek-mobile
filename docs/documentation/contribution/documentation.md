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

# Contribuer

**1. Contribuer les fichiers existants**

Vous pouvez commencer à contribuer la documentation de Geotrek-mobile en mettant à jour les fichiers markdown présents dans le dossier `docs/documentation` :

```bash
cd /docs/documentation
```

Chaque sous-dossier présent dans /docs concerne une section de la documentation (Introduction, Thème, Composants, etc.).

**2. Ajouter de nouvelles sections**

Pour ajouter une nouvelle section, il faut créer un nouveau dossier ainsi que les fichiers markdown `docs/.vitepress/config/fr.ts` :

```bash
cd /docs/.vitepress/config/fr.ts
```

Exemple de création de nouvelle section :

```js
    {
        text: 'Nouvelle Section',
        collapsed: true,
        items: [
          { text: 'Partie 1', link: '/documentation/newsection/partie1' },
          { text: 'Partie 2', link: '/documentation/newsection/partie2' },
        ],
      }
```

# Traduire la documentation

Traduire une documentation utilisateur dans une autre langue que le français offre plusieurs avantages :

- **Améliorer l'accessibilité** : en traduisant la documentation de Geotrek-mobile, vous contribuez à rendre le produit accessible à un public plus large à travers le monde
- **Améliorer l'expérience utilisateur** : la traduction de la documentation dans la langue des utilisateurs permet de faciliter la compréhension et l'utilisation et donc d'améliorer leur expérience globale du produit
- **Faciliter la collaboration** : si Geotrek-mobile est utilisé par une équipe internationale, avoir une documentation en anglais facilite la collaboration, le support et la communication

## Ajouter du contenu en anglais

Pour traduire le contenu existant de la documentation, il suffit de mettre à jour les fichiers markdown présents dans le dossier `/docs/en/documentation/`.

## Ajouter une section de menu en anglais

Dans le cas de la création d'une nouvelle entrée de menu dans la documentation, il faut :

**1. Créer le fichier markdown**

Exemple : `/docs/en/documentation/features/new-file.md`

::: info
Pour des raisons de cohérence, il est préférable de conserver la même arborescence de fichier que celle de la langue d'origine (français).

L'ensemble des fichiers markdown de documentation se trouvent dans le dossier /docs/**en**/documentation/
:::

**2. Mettre à jour l'index**

Dans cet exemple, on met à jour le fichier `/docs/.vitepress/config/en.ts` en ajoutant la ligne mise en évidence :

```js
      {
        text: 'Features',
        items: [
          { text: 'Online', link: '/en/documentation/features/online' },
          { text: 'Offline', link: '/en/documentation/features/offline' },
          { text: 'New file', link: '/en/documentation/features/new-file' },// [!code focus]
        ]
      },
```

## Ajouter une nouvelle langue

Pour ajouter le support d'une nouvelle langue (prenons ici l'exemple de l'_italien_), il faut :

**1. Créer un dossier `/docs/it/documentation/`**

**2. Créer tous les sous-dossiers et fichiers markdown nécessaires**

Pour des raisons de simplicité, les noms des sous-dossiers et fichiers markdown n'ont pas besoin d'être traduits :

- `/docs/it/documentation/features`
  - online.md
  - offline.md
  - new-file.md
- etc.

**3. Créer le fichier `it.ts` dans le dossier `/docs/.vitepress/config/`**

Il s'agit du fichier où l'arborescence des menus dans la langue sera effectuée. Les menus ont également besoin d'être traduits.

::: tip
Pour plus de facilité, il peut être intéressant de reprendre le contenu du fichier `en.ts` et de l'adapter au contenu de la nouvelle langue.
:::

**4. Inclure la langue dans le fichier /docs/.vitepress/config/index.ts**

La dernière étape consiste à inclure la langue dans le fichier `index.ts` :

```js
export default defineConfig({
  ...shared,
  locales: {
    root: {
      label: 'Français',
      ...fr,
    },
    en: {
      label: 'English',
      ...en,
    },
    it: {
      label: 'Italiano', // [!code focus]
      ...it,
    },
  },
});
```
